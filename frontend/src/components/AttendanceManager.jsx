import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getAttendance, markAttendance } from '../api';
import AttendanceConfirmationModal from './AttendanceConfirmationModal';

// 1. Accept the new prop `onAttendanceChange`
export default function AttendanceManager({ employees, selectedId, setSelectedId, onAttendanceChange }) {
  const [history, setHistory] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Present');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(null);

  const fetchHistory = async () => {
    if (!selectedId) {
        setHistory([]);
        return;
    }
    try {
      const { data } = await getAttendance(selectedId, startDate, endDate);
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedId, startDate, endDate]);

  const executeMarkAttendance = async () => {
    if (!selectedId) return;
    try {
      await markAttendance({ employee_id: selectedId, date, status });
      fetchHistory(); // Update local table
      
      // 2. Tell the parent App to update the main Employee list (and counts) immediately
      if (onAttendanceChange) {
        onAttendanceChange();
      }
      
    } catch (err) {
      alert('Error marking attendance');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedId) return;

    const today = new Date().toISOString().split('T')[0];
    const isDifferentDate = date !== today;
    const skipWarning = localStorage.getItem('hrms_skip_date_warning') === 'true';

    if (isDifferentDate && !skipWarning) {
      setPendingSubmission({ date, status });
      setIsModalOpen(true);
    } else {
      executeMarkAttendance();
    }
  };

  const onConfirmModal = (dontShowAgain) => {
    if (dontShowAgain) {
      localStorage.setItem('hrms_skip_date_warning', 'true');
    }
    executeMarkAttendance();
    setIsModalOpen(false);
    setPendingSubmission(null);
  };

  return (
    <>
      <AttendanceConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirmModal}
        date={pendingSubmission?.date}
        status={pendingSubmission?.status}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Attendance</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <select required className="w-full border-gray-300 rounded-md border p-2 text-sm" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                <option value="">-- Select Employee --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
              </select>
              <input type="date" required className="w-full border-gray-300 rounded-md border p-2 text-sm" value={date} onChange={e => setDate(e.target.value)} />
              <select className="w-full border-gray-300 rounded-md border p-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              <button disabled={!selectedId} type="submit" className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                Mark Status
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-medium text-gray-900">Attendance Log</h3>
              <div className="flex items-center space-x-2">
                <input type="date" className="pl-2 pr-2 py-1 border rounded text-xs" value={startDate} onChange={e => setStartDate(e.target.value)} title="Start Date"/>
                <span className="text-gray-400">-</span>
                <input type="date" className="pl-2 pr-2 py-1 border rounded text-xs" value={endDate} onChange={e => setEndDate(e.target.value)} title="End Date"/>
                {(startDate || endDate) && <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-xs text-red-500 hover:text-red-700 underline">Clear</button>}
              </div>
            </div>

            {!selectedId ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <Search className="w-12 h-12 text-gray-300 mb-2" />
                <p>Select an employee to view records.</p>
              </div>
            ) : history.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No records found for this period.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{record.date}</td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{record.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}