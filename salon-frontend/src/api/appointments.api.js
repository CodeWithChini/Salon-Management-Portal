import axiosClient from './axiosClient';

export const appointmentsApi = {
  getAvailableSlots: (barberId, date) =>
    axiosClient.get('/appointments/available-slots', { params: { barberId, date } }).then((r) => r.data),
  getMy: (params) => axiosClient.get('/appointments/my', { params }).then((r) => r.data),
  getForBarber: (params) => axiosClient.get('/appointments/barber', { params }).then((r) => r.data),
  getAll: (params) => axiosClient.get('/appointments', { params }).then((r) => r.data),
  getById: (id) => axiosClient.get(`/appointments/${id}`).then((r) => r.data),
  create: (payload) => axiosClient.post('/appointments', payload).then((r) => r.data),
  updateStatus: (id, status) => axiosClient.put(`/appointments/${id}/status`, { status }).then((r) => r.data),
  cancel: (id, reason) => axiosClient.put(`/appointments/${id}/cancel`, { reason }).then((r) => r.data),
  reschedule: (id, payload) => axiosClient.put(`/appointments/${id}/reschedule`, payload).then((r) => r.data),
  assignBarber: (id, barberId) => axiosClient.put(`/appointments/${id}/assign`, { barberId }).then((r) => r.data),
};
