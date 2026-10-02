import axiosClient from './axiosClient';

export const analyticsApi = {
  getRevenue: (params) => axiosClient.get('/analytics/revenue', { params }).then((r) => r.data),
  getUserGrowth: (params) => axiosClient.get('/analytics/user-growth', { params }).then((r) => r.data),
  getServicePopularity: () => axiosClient.get('/analytics/service-popularity').then((r) => r.data),
  getStaffPerformance: (params) => axiosClient.get('/analytics/staff-performance', { params }).then((r) => r.data),
  getOverview: () => axiosClient.get('/analytics/overview').then((r) => r.data),
  getMonthlyAppointments: (params) => axiosClient.get('/analytics/monthly-appointments', { params }).then((r) => r.data),
};
