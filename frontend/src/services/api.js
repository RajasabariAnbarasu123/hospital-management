import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Patient APIs
export const patientAPI = {
  searchDoctors: (params = {}) => api.get('/patient/doctors/search', { params }),
  getAvailableSlots: (doctorId, date) => api.get(`/patient/doctors/${doctorId}/slots`, { params: { date } }),
  bookAppointment: (data) => api.post('/patient/appointments/book', data),
  getMyAppointments: (patientId) => api.get(`/patient/appointments/${patientId}`),
  cancelAppointment: (appointmentId) => api.put(`/patient/appointments/${appointmentId}/cancel`),
};

// Doctor APIs
export const doctorAPI = {
  addAvailability: (data) => api.post('/doctor/availability', data),
  getAvailability: (doctorId, date) => api.get(`/doctor/availability/${doctorId}`, { params: { date } }),
  getAppointments: (doctorId) => api.get(`/doctor/appointments/${doctorId}`),
  confirmAppointment: (appointmentId) => api.put(`/doctor/appointments/${appointmentId}/confirm`),
  completeAppointment: (appointmentId) => api.put(`/doctor/appointments/${appointmentId}/complete`),
};

// Admin APIs
export const adminAPI = {
  createDoctor: (data) => api.post('/admin/doctors', data),
  getAllDoctors: () => api.get('/admin/doctors'),
  deleteDoctor: (doctorId) => api.delete(`/admin/doctors/${doctorId}`),
  getAppointmentReports: () => api.get('/admin/reports/appointments'),
  getDoctorReports: () => api.get('/admin/reports/doctors'),
};

export default api;