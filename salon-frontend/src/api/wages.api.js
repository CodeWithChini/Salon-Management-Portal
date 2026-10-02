import axiosClient from './axiosClient';

export const wagesApi = {
  getAll: (params) => axiosClient.get('/wages', { params }).then((r) => r.data),
  getMyEarnings: (params) => axiosClient.get('/wages/my-earnings', { params }).then((r) => r.data),
  getMonthlySummary: (params) => axiosClient.get('/wages/monthly-summary', { params }).then((r) => r.data),
  getForBarber: (barberId, params) => axiosClient.get(`/wages/barber/${barberId}`, { params }).then((r) => r.data),
  create: (payload) => axiosClient.post('/wages', payload).then((r) => r.data),
  updateStatus: (id, status) => axiosClient.put(`/wages/${id}/status`, { status }).then((r) => r.data),
  updateCommissionRate: (barberId, commissionRate) =>
    axiosClient.put(`/wages/commission/${barberId}`, { commissionRate }).then((r) => r.data),
};
