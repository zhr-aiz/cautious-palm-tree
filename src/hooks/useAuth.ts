import { useAuthStore } from '../stores/authStore';

/** Hook for accessing auth state and actions */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };
}
