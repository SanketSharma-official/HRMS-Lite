import React from 'react';
import { BarChart3, Users, Calendar } from 'lucide-react';

export default function Navbar({ view, setView }) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600">HRMS Lite</span>
          </div>
          <div className="flex space-x-8 items-center">
            <NavButton icon={BarChart3} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
            <NavButton icon={Users} label="Employees" active={view === 'employees'} onClick={() => setView('employees')} />
            <NavButton icon={Calendar} label="Attendance" active={view === 'attendance'} onClick={() => setView('attendance')} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${active ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors`}
    >
      <Icon className="w-4 h-4 mr-2" /> {label}
    </button>
  );
}