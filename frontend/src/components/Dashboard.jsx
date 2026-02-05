import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, HelpCircle, ChevronRight } from 'lucide-react';
import { getDashboardStats } from '../api';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({ 
    total_employees: 0, present_today: 0, absent_today: 0, unmarked_today: 0, employee_list: []
  });

  useEffect(() => {
    getDashboardStats().then(res => setStats(res.data)).catch(console.error);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Today's Overview ({new Date().toLocaleDateString()})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Employees" count={stats.total_employees} icon={Users} color="indigo" />
        <StatCard title="Present Today" count={stats.present_today} icon={CheckCircle} color="green" />
        <StatCard title="Absent Today" count={stats.absent_today} icon={XCircle} color="red" />
        <StatCard title="Unmarked" count={stats.unmarked_today} icon={HelpCircle} color="gray" />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Today's Employee Status</h3>
          <p className="text-xs text-gray-500 mt-1">Click on a row to view full attendance history.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.employee_list && stats.employee_list.length > 0 ? (
                stats.employee_list.map((emp) => (
                  <tr key={emp.id} onClick={() => onNavigate(emp.id)} className="hover:bg-indigo-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(emp.status)}`}>{emp.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400"><ChevronRight className="w-4 h-4" /></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, count, icon: Icon, color }) {
  const borderColors = { indigo: 'border-indigo-500', green: 'border-green-500', red: 'border-red-500', gray: 'border-gray-400' };
  const textColors = { indigo: 'text-indigo-600', green: 'text-green-600', red: 'text-red-600', gray: 'text-gray-600' };
  const iconColors = { indigo: 'text-indigo-200', green: 'text-green-200', red: 'text-red-200', gray: 'text-gray-300' };

  return (
    <div className={`bg-white p-6 rounded-lg shadow border-l-4 ${borderColors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${textColors[color]}`}>{count}</p>
        </div>
        <Icon className={`w-8 h-8 ${iconColors[color]}`} />
      </div>
    </div>
  );
}