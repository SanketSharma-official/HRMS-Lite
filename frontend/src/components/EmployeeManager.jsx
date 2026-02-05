import React, { useState } from 'react';
import { Trash2, UserPlus, AlertCircle } from 'lucide-react';
import { createEmployee, deleteEmployee } from '../api';
import DeleteModal from './DeleteModal';

export default function EmployeeManager({ employees, refresh, loading, onNavigate }) {
  const [form, setForm] = useState({ employee_id: '', full_name: '', email: '', department: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createEmployee(form);
      setForm({ employee_id: '', full_name: '', email: '', department: '' });
      refresh();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error adding employee';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const initiateDelete = (e, emp) => {
    e.stopPropagation(); 
    setEmployeeToDelete(emp);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteEmployee(employeeToDelete.id);
      refresh();
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
    } catch (err) {
      alert('Error deleting employee');
    }
  };

  return (
    <>
      <DeleteModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
        employeeName={employeeToDelete?.full_name} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: List */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Employee Directory</h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
              {employees.length} Total
            </span>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading...</div>
          ) : employees.length === 0 ? (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center">
              <UserPlus className="w-12 h-12 text-gray-200 mb-2" />
              <p>No employees yet. Add one on the right.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {employees.map((emp) => (
                <li 
                  key={emp.id} 
                  onClick={() => onNavigate(emp.id)} 
                  className="px-6 py-4 hover:bg-indigo-50 flex justify-between items-center transition cursor-pointer group"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-4">
                      {emp.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-700">{emp.full_name}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-2">
                        <span className="font-mono text-gray-400">#{emp.employee_id}</span>
                        <span>•</span>
                        <span>{emp.department}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                      <span className="block text-xs text-gray-400">Attendance</span>
                      <span className="block text-sm font-medium text-green-600">{emp.attendance_count} Days</span>
                    </div>
                    <button 
                      onClick={(e) => initiateDelete(e, emp)} 
                      className="text-gray-300 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-full"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Column: Add Form */}
        <div className="bg-white shadow rounded-lg p-6 h-fit sticky top-6">
          <h3 className="text-lg font-medium text-gray-900 mb-5 flex items-center">
            Add New Employee
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs flex items-start rounded-r">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">ID</label>
              <input 
                required 
                placeholder="EMP001" 
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono uppercase" 
                value={form.employee_id} 
                onChange={e => setForm({
                  ...form, 
                  employee_id: e.target.value.toUpperCase().replace(/\s/g, '')
                })} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Full Name</label>
              <input 
                required 
                placeholder="Jane Doe" 
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                value={form.full_name} 
                onChange={e => setForm({...form, full_name: e.target.value})} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
              <input 
                required 
                type="email" 
                placeholder="jane@company.com" 
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Department</label>
              <input 
                required 
                placeholder="Engineering" 
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
                value={form.department} 
                onChange={e => setForm({...form, department: e.target.value})} 
              />
            </div>

            <button 
              disabled={submitting} 
              type="submit" 
              className="w-full mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Creating...' : 'Create Employee'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}