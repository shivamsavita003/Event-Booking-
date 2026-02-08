import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Event API
export const eventAPI = {
  getAll: () => apiClient.get('/events'),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events', data),
  update: (id, data) => apiClient.put(`/events/${id}`, data),
  delete: (id) => apiClient.delete(`/events/${id}`),
  search: (query) => apiClient.get(`/events/search?q=${query}`)
};

// Booking API
export const bookingAPI = {
  create: (data) => apiClient.post('/bookings', data),
  getAll: () => apiClient.get('/bookings'),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  update: (id, data) => apiClient.put(`/bookings/${id}`, data),
  delete: (id) => apiClient.delete(`/bookings/${id}`),
  getByEvent: (eventId) => apiClient.get(`/bookings/event/${eventId}`)
};

export default apiClient;
