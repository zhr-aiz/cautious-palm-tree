import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthFormData, MembershipTier } from '../types';
import { generateId } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

/** Auth store state */
interface AuthState {
  /** Current logged-in user (null if not authenticated) */
  user: User | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Login with email and password */
  login: (data: Pick<AuthFormData, 'email' | 'password'>) => Promise<void>;
  /** Register a new account */
  register: (data: AuthFormData) => Promise<void>;
  /** Logout */
  logout: () => void;
  /** Update user profile */
  updateProfile: (updates: Partial<User>) => void;
}

/** Mock user database for demo purposes */
const mockUsers: Map<string, User & { password: string }> = new Map();

/**
 * Auth store with localStorage persistence.
 * Manages user authentication state.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (data) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const existingUser = mockUsers.get(data.email);
        if (existingUser && (existingUser as any).password === data.password) {
          const { password: _password, ...user } = existingUser as any;
          void _password;
          set({ user, isAuthenticated: true });
          return;
        }

        // For demo: auto-create user on login
        const newUser: User = {
          id: generateId(),
          email: data.email,
          phone: '',
          nickname: data.email.split('@')[0],
          avatarUrl: '',
          createdAt: new Date(),
          tier: MembershipTier.FREE,
        };
        mockUsers.set(data.email, { ...newUser, password: data.password } as any);
        set({ user: newUser, isAuthenticated: true });
      },

      register: async (data) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (mockUsers.has(data.email)) {
          throw new Error('该邮箱已注册');
        }

        const newUser: User = {
          id: generateId(),
          email: data.email,
          phone: data.phone || '',
          nickname: data.nickname || data.email.split('@')[0],
          avatarUrl: '',
          createdAt: new Date(),
          tier: MembershipTier.FREE,
        };
        mockUsers.set(data.email, { ...newUser, password: data.password } as any);
        set({ user: newUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...updates };
          return { user: updatedUser };
        });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_USER,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
