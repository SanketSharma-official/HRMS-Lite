import React, { useState, useEffect } from 'react';
import { getEmployees } from './api';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import EmployeeManager from './components/EmployeeManager';
import AttendanceManager from './components/AttendanceManager';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const goToAttendance = (empId) => {
    setSelectedEmpId(empId);
    setView('attendance');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      <Navbar view={view} setView={setView} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && <Dashboard onNavigate={goToAttendance} />}
        
        {view === 'employees' && (
          <EmployeeManager 
            employees={employees} 
            refresh={fetchEmployees} 
            loading={loading} 
            onNavigate={goToAttendance} 
          />
        )}
        
        {view === 'attendance' && (
          <AttendanceManager 
            employees={employees} 
            selectedId={selectedEmpId} 
            setSelectedId={setSelectedEmpId} 
            onAttendanceChange={fetchEmployees} 
          />
        )}

      </main>
    </div>
  );
}