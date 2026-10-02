import axiosClient from './axiosClient';

export const ordersApi = {
  create: (payload) => axiosClient.post('/orders', payload).then((r) => r.data),
  getMy: (params) => axiosClient.get('/orders/my', { params }).then((r) => r.data),
  getAll: (params) => axiosClient.get('/orders', { params }).then((r) => r.data),
  getById: (id) => axiosClient.get(`/orders/${id}`).then((r) => r.data),
  updateStatus: (id, payload) => axiosClient.put(`/orders/${id}/status`, payload).then((r) => r.data),
  cancel: (id) => axiosClient.put(`/orders/${id}/cancel`).then((r) => r.data),
};
