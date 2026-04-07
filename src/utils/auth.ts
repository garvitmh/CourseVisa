import { User } from '../types';

export function getDashboardRouteForRole(role?: User['role']): string {
  if (role === 'admin') return '/admin';
  if (role === 'mentor') return '/mentor-dashboard';
  return '/dashboard';
}

