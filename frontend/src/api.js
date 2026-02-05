import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
});

export const getEmployees = () => api.get('/employees/');
export const createEmployee = (data) => api.post('/employees/', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const markAttendance = (data) => api.post('/attendance/', data);

export const getAttendance = (id, startDate, endDate) => {
  let url = `/attendance/${id}`;
  const params = [];
  if (startDate) params.push(`start_date=${startDate}`);
  if (endDate) params.push(`end_date=${endDate}`);
  
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  return api.get(url);
};

export const getDashboardStats = () => api.get('/dashboard/stats');