import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_META } from '../utils/constants';

export default function RoleRoute({ allow }) {
  const { user } = useAuth();

  if (!user) return null;

  if (!allow.includes(user.role)) {
    const home = ROLE_META[user.role]?.home || '/login';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
