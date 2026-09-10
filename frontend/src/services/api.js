import axios from 'axios';

const API_BASE_URL = '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth APIs
export const authAPI = {
  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE_URL}/auth/login`, data),
  getCurrentUser: () => axios.get(`${API_BASE_URL}/auth/me`, { headers: getAuthHeader() })
};

// User APIs
export const userAPI = {
  getProfile: () => axios.get(`${API_BASE_URL}/user/profile`, { headers: getAuthHeader() }),
  updateProfile: (data) => axios.put(`${API_BASE_URL}/user/profile`, data, { headers: getAuthHeader() }),
  getDashboard: () => axios.get(`${API_BASE_URL}/user/dashboard`, { headers: getAuthHeader() }),
  getHistory: () => axios.get(`${API_BASE_URL}/user/history`, { headers: getAuthHeader() }),
  getNotifications: () => axios.get(`${API_BASE_URL}/user/notifications`, { headers: getAuthHeader() }),
  dispenseRation: (data) => axios.post(`${API_BASE_URL}/user/dispense`, data, { headers: getAuthHeader() })
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => axios.get(`${API_BASE_URL}/admin/dashboard`, { headers: getAuthHeader() }),
  getUsers: (params) => axios.get(`${API_BASE_URL}/admin/users`, { params, headers: getAuthHeader() }),
  getUserById: (id) => axios.get(`${API_BASE_URL}/admin/users/${id}`, { headers: getAuthHeader() }),
  updateUser: (id, data) => axios.put(`${API_BASE_URL}/admin/users/${id}`, data, { headers: getAuthHeader() }),
  deleteUser: (id) => axios.delete(`${API_BASE_URL}/admin/users/${id}`, { headers: getAuthHeader() }),
  getHistory: (params) => axios.get(`${API_BASE_URL}/admin/history`, { params, headers: getAuthHeader() }),
  getInventory: () => axios.get(`${API_BASE_URL}/admin/inventory`, { headers: getAuthHeader() }),
  updateInventory: (id, data) => axios.put(`${API_BASE_URL}/admin/inventory/${id}`, data, { headers: getAuthHeader() }),
  simulateLowStock: (data) => axios.post(`${API_BASE_URL}/admin/inventory/simulate/low-stock`, data, { headers: getAuthHeader() }),
  getDevices: () => axios.get(`${API_BASE_URL}/admin/devices`, { headers: getAuthHeader() }),
  updateDevice: (id, data) => axios.put(`${API_BASE_URL}/admin/devices/${id}`, data, { headers: getAuthHeader() }),
  simulateSolarCharging: (id) => axios.post(`${API_BASE_URL}/admin/devices/${id}/simulate/solar-charging`, {}, { headers: getAuthHeader() }),
  simulateBatteryDrain: (id) => axios.post(`${API_BASE_URL}/admin/devices/${id}/simulate/battery-drain`, {}, { headers: getAuthHeader() }),
  simulateDeviceOffline: (id) => axios.post(`${API_BASE_URL}/admin/devices/${id}/simulate/offline`, {}, { headers: getAuthHeader() }),
  simulateDeviceOnline: (id) => axios.post(`${API_BASE_URL}/admin/devices/${id}/simulate/online`, {}, { headers: getAuthHeader() }),
  getRefills: () => axios.get(`${API_BASE_URL}/admin/refills`, { headers: getAuthHeader() }),
  createRefill: (data) => axios.post(`${API_BASE_URL}/admin/refills`, data, { headers: getAuthHeader() }),
  updateRefill: (id, data) => axios.put(`${API_BASE_URL}/admin/refills/${id}`, data, { headers: getAuthHeader() }),
  getNotifications: () => axios.get(`${API_BASE_URL}/admin/notifications`, { headers: getAuthHeader() }),
  markNotificationAsRead: (id) => axios.put(`${API_BASE_URL}/admin/notifications/${id}/read`, {}, { headers: getAuthHeader() })
};

export default axios;
