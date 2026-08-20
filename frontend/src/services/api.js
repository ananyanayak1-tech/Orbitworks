import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for carrying token authorization headers on all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth Methods
export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  if (res.data && res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

// Employees Methods
export const getEmployees = async () => {
  const res = await api.get('/employees');
  return res.data;
};

export const createEmployee = async (data) => {
  const res = await api.post('/employees', data);
  return res.data.employee;
};

export const updateEmployee = async (id, data) => {
  const res = await api.put(`/employees/${id}`, data);
  return res.data.employee;
};

// Departments Methods
export const getDepartments = async () => {
  const res = await api.get('/misc/departments');
  return res.data;
};

export const createDepartment = async (data) => {
  const res = await api.post('/misc/departments', data);
  return res.data;
};

export const updateDepartment = async (id, data) => {
  const res = await api.put(`/misc/departments/${id}`, data);
  return res.data;
};

// Projects Methods
export const getProjects = async () => {
  const res = await api.get('/misc/projects');
  return res.data;
};

export const createProject = async (data) => {
  const res = await api.post('/misc/projects', data);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await api.put(`/misc/projects/${id}`, data);
  return res.data;
};

// Tasks Methods
export const getTasks = async () => {
  const res = await api.get('/tasks');
  return res.data;
};

export const createTask = async (data) => {
  const res = await api.post('/tasks', data);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
};

export const addTaskComment = async (taskId, comment) => {
  const res = await api.post(`/tasks/${taskId}/comments`, comment);
  return res.data.task;
};

export const deleteTaskComment = async (taskId, commentId) => {
  const res = await api.delete(`/tasks/${taskId}/comments/${commentId}`);
  return res.data;
};

export const getChatHistory = async (room) => {
  const res = await api.get(`/chat/${room}`);
  return res.data;
};

// Attendance Methods
export const getAttendance = async (date) => {
  const res = await api.get('/attendance', { params: { date } });
  return res.data;
};

export const getEmployeeAttendanceHistory = async (employeeId) => {
  const res = await api.get('/attendance');
  return res.data.filter(a => a.employeeId === employeeId);
};

export const markAttendanceManually = async (data) => {
  const res = await api.post('/attendance/manual', data);
  return res.data;
};

export const checkIn = async (employeeId) => {
  const res = await api.post('/attendance/check-in', { employeeId });
  return res.data.log;
};

export const checkOut = async (employeeId) => {
  const res = await api.post('/attendance/check-out', { employeeId });
  return res.data.log;
};

// Leave Requests Methods
export const getLeaveRequests = async () => {
  const res = await api.get('/leaves');
  return res.data;
};

export const createLeaveRequest = async (data) => {
  const res = await api.post('/leaves', data);
  return res.data;
};

export const updateLeaveRequestStatus = async (id, status) => {
  const res = await api.put(`/leaves/${id}`, { status });
  return res.data;
};

// Announcements Methods
export const getAnnouncements = async () => {
  const res = await api.get('/misc/announcements');
  return res.data;
};

export const createAnnouncement = async (data) => {
  const res = await api.post('/misc/announcements', data);
  return res.data;
};

// Holidays Methods
export const getHolidays = async () => {
  const res = await api.get('/misc/holidays');
  return res.data;
};

export const createHoliday = async (data) => {
  const res = await api.post('/misc/holidays', data);
  return res.data;
};

// Notifications Methods
export const getNotifications = async (userId) => {
  const res = await api.get('/misc/notifications');
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.put(`/misc/notifications/${id}/read`);
  return res.data;
};

// Demo Requests Methods
export const submitDemoRequest = async (data) => {
  const res = await api.post('/misc/demo-requests', data);
  return res.data;
};

export default api;
