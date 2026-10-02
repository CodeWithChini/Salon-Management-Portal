import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onUnauthorized } from './api/axiosClient';
import { fetchCurrentUser, loggedOut } from './features/auth/authSlice';
import { useAuth } from './hooks/useAuth';
import { ROLE_META, ROLES } from './utils/constants';

import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import DashboardLayout from './layouts/DashboardLayout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/shared/ProfilePage';
import AppointmentsBoardPage from './pages/shared/AppointmentsBoardPage';
import TimeOffApprovalsPage from './pages/shared/TimeOffApprovalsPage';

import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import ServicesPage from './pages/customer/ServicesPage';
import BookAppointmentPage from './pages/customer/BookAppointmentPage';
import MyAppointmentsPage from './pages/customer/MyAppointmentsPage';
import StorePage from './pages/customer/StorePage';
import CartPage from './pages/customer/CartPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';

import BarberDashboardPage from './pages/barber/BarberDashboardPage';
import BarberSchedulePage from './pages/barber/BarberSchedulePage';
import EarningsPage from './pages/barber/EarningsPage';
import TimeOffPage from './pages/barber/TimeOffPage';

import ReceptionistDashboardPage from './pages/receptionist/ReceptionistDashboardPage';
import CustomersPage from './pages/receptionist/CustomersPage';
import StaffAvailabilityPage from './pages/receptionist/StaffAvailabilityPage';

import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import StaffManagementPage from './pages/admin/StaffManagementPage';
import UsersPage from './pages/admin/UsersPage';
import ServiceManagementPage from './pages/admin/ServiceManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import InventoryManagementPage from './pages/admin/InventoryManagementPage';
import WageManagementPage from './pages/admin/WageManagementPage';

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_META[user.role]?.home || '/login'} replace />;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) return <Navigate to={ROLE_META[user.role]?.home || '/'} replace />;
  return children;
}

export default function App() {
  const dispatch = useDispatch();
  const { token } = useAuth();

  useEffect(() => {
    return onUnauthorized(() => dispatch(loggedOut()));
  }, [dispatch]);

  useEffect(() => {
    if (token) dispatch(fetchCurrentUser());

  }, [token]);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        {/* Customer */}
        <Route element={<RoleRoute allow={[ROLES.CUSTOMER]} />}>
          <Route path="/app/customer" element={<DashboardLayout />}>
            <Route index element={<CustomerDashboardPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="book" element={<BookAppointmentPage />} />
            <Route path="appointments" element={<MyAppointmentsPage />} />
            <Route path="store" element={<StorePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<MyOrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Barber / Stylist */}
        <Route element={<RoleRoute allow={[ROLES.BARBER]} />}>
          <Route path="/app/barber" element={<DashboardLayout />}>
            <Route index element={<BarberDashboardPage />} />
            <Route path="schedule" element={<BarberSchedulePage />} />
            <Route path="earnings" element={<EarningsPage />} />
            <Route path="time-off" element={<TimeOffPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Receptionist */}
        <Route element={<RoleRoute allow={[ROLES.RECEPTIONIST]} />}>
          <Route path="/app/receptionist" element={<DashboardLayout />}>
            <Route index element={<ReceptionistDashboardPage />} />
            <Route path="schedule" element={<AppointmentsBoardPage />} />
            <Route path="time-off" element={<TimeOffApprovalsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="availability" element={<StaffAvailabilityPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<RoleRoute allow={[ROLES.ADMIN]} />}>
          <Route path="/app/admin" element={<DashboardLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="appointments" element={<AppointmentsBoardPage />} />
            <Route path="staff" element={<StaffManagementPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="services" element={<ServiceManagementPage />} />
            <Route path="products" element={<ProductManagementPage />} />
            <Route path="inventory" element={<InventoryManagementPage />} />
            <Route path="wages" element={<WageManagementPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
