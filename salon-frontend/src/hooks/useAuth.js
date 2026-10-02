import { useSelector } from 'react-redux';

export function useAuth() {
  const { user, token, status, error } = useSelector((s) => s.auth);
  return { user, token, isAuthenticated: Boolean(token && user), status, error };
}
