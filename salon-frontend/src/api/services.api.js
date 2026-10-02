import axiosClient from './axiosClient';

export const servicesApi = {
  getAll: (params) => axiosClient.get('/services', { params }).then((r) => r.data),
  getCategories: () => axiosClient.get('/services/categories').then((r) => r.data),
  getById: (id) => axiosClient.get(`/services/${id}`).then((r) => r.data),
  create: (payload) => axiosClient.post('/services', payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/services/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/services/${id}`).then((r) => r.data),
};
