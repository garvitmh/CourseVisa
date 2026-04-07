import { ReactNode } from 'react';
import { useAuth } from '../../hooks';
import { Navigate } from 'react-router-dom';
import { getDashboardRouteForRole } from '../../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'admin' | 'mentor' | 'student'>;
  unauthorizedRedirectTo?: string;
}

export default function ProtectedRoute({ children, allowedRoles, unauthorizedRedirectTo }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="loader">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={unauthorizedRedirectTo || getDashboardRouteForRole(user.role)} replace />;
  }

  return <>{children}</>;
}
