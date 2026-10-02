import axiosClient from './axiosClient';

export const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => axiosClient.post('/auth/login', payload).then((r) => r.data),
  getMe: () => axiosClient.get('/auth/me').then((r) => r.data),
  updateProfile: (payload) => axiosClient.put('/auth/profile', payload).then((r) => r.data),
  changePassword: (payload) => axiosClient.put('/auth/change-password', payload).then((r) => r.data),
};
