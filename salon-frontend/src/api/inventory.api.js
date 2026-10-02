import axiosClient from './axiosClient';

export const inventoryApi = {
  getAll: (params) => axiosClient.get('/inventory', { params }).then((r) => r.data),
  getLowStock: () => axiosClient.get('/inventory/low-stock').then((r) => r.data),
  getCategories: () => axiosClient.get('/inventory/categories').then((r) => r.data),
  getById: (id) => axiosClient.get(`/inventory/${id}`).then((r) => r.data),
  create: (payload) => axiosClient.post('/inventory', payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/inventory/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/inventory/${id}`).then((r) => r.data),
  restock: (id, quantity) => axiosClient.put(`/inventory/${id}/restock`, { quantity }).then((r) => r.data),
};
