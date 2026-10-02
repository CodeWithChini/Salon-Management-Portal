import axiosClient from './axiosClient';

export const usersApi = {
  getAll: (params) => axiosClient.get('/users', { params }).then((r) => r.data),
  getBarbers: (params) => axiosClient.get('/users/barbers', { params }).then((r) => r.data),
  getById: (id) => axiosClient.get(`/users/${id}`).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/users/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/users/${id}`).then((r) => r.data),
};
