import { getValidInterval } from 'recharts/types/util/scale/getNiceTickValues';
import axiosClient from './axiosClient';

export const dashboardApi = {
  getCustomer: () => axiosClient.get('/dashboard/customer').then((r) => r.data),
  getBarber: () => axiosClient.get('/dashboard/barber').then((r) => r.data),
  getReceptionist: () => axiosClient.get('/dashboard/receptionist').then((r) => r.data),
};

