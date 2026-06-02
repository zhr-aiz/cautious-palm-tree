import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../stores/authStore';
import { MembershipTier } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

describe('authStore 会员扩展', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  });

  describe('User.tier 字段', () => {
    it('注册后默认 tier 应为 FREE', async () => {
      await useAuthStore.getState().register({
        email: 'tier-test@example.com',
        password: '123456',
        nickname: 'TierTest',
      });

      const state = useAuthStore.getState();
      expect(state.user?.tier).toBe(MembershipTier.FREE);
    });

    it('登录后默认 tier 应为 FREE', async () => {
      await useAuthStore.getState().login({
        email: 'login-tier@example.com',
        password: '123456',
      });

      const state = useAuthStore.getState();
      expect(state.user?.tier).toBe(MembershipTier.FREE);
    });

    it('应能通过 updateProfile 更新 tier', async () => {
      await useAuthStore.getState().login({
        email: 'upgrade@example.com',
        password: '123456',
      });

      useAuthStore.getState().updateProfile({ tier: MembershipTier.PRO });

      const state = useAuthStore.getState();
      expect(state.user?.tier).toBe(MembershipTier.PRO);
    });
  });
});
