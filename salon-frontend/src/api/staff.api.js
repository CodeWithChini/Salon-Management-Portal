import axiosClient from './axiosClient';

export const staffApi = {
  getAll: (params) => axiosClient.get('/staff', { params }).then((r) => r.data),
  getById: (id) => axiosClient.get(`/staff/${id}`).then((r) => r.data),
  create: (payload) => axiosClient.post('/staff', payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/staff/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/staff/${id}`).then((r) => r.data),
  updateShift: (id, payload) => axiosClient.put(`/staff/${id}/shift`, payload).then((r) => r.data),
  getAvailability: (date) => axiosClient.get('/staff/availability', { params: { date } }).then((r) => r.data),
  requestTimeOff: (payload) => axiosClient.post('/staff/time-off', payload).then((r) => r.data),
  getAllTimeOffs: (params) => axiosClient.get('/staff/time-off', { params }).then((r) => r.data),
  getMyTimeOffs: () => axiosClient.get('/staff/my-time-off').then((r) => r.data),
  updateTimeOffStatus: (id, status) => axiosClient.put(`/staff/time-off/${id}`, { status }).then((r) => r.data),
};
