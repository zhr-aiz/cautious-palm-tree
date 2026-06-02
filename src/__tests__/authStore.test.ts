import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../stores/authStore';
import { STORAGE_KEYS } from '../utils/constants';

describe('authStore', () => {
  beforeEach(() => {
    // 重置 store 状态
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
    // 清理 localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  });

  describe('初始状态', () => {
    it('初始时用户应为 null', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });

    it('初始时未认证', () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('登录成功后应设置用户信息', async () => {
      const store = useAuthStore.getState();
      await store.login({ email: 'test@example.com', password: '123456' });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).not.toBeNull();
      expect(state.user?.email).toBe('test@example.com');
    });

    it('登录后用户 nickname 应从邮箱提取', async () => {
      const store = useAuthStore.getState();
      await store.login({ email: 'myname@example.com', password: '123456' });

      const state = useAuthStore.getState();
      expect(state.user?.nickname).toBe('myname');
    });

    it('登录后用户应有 id', async () => {
      const store = useAuthStore.getState();
      await store.login({ email: 'test@example.com', password: '123456' });

      const state = useAuthStore.getState();
      expect(state.user?.id).toBeTruthy();
    });

    it('相同邮箱再次登录应找到已存在用户', async () => {
      // 先登录
      const store1 = useAuthStore.getState();
      await store1.login({ email: 'test@example.com', password: '123456' });

      // 登出
      useAuthStore.getState().logout();

      // 再次登录
      await useAuthStore.getState().login({ email: 'test@example.com', password: '123456' });
      const user2 = useAuthStore.getState().user;

      expect(user2?.email).toBe('test@example.com');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe('register', () => {
    it('注册成功后应设置用户信息', async () => {
      const store = useAuthStore.getState();
      await store.register({
        email: 'new@example.com',
        password: '123456',
        nickname: 'TestUser',
        phone: '13800138000',
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe('new@example.com');
      expect(state.user?.nickname).toBe('TestUser');
      expect(state.user?.phone).toBe('13800138000');
    });

    it('注册时未提供 nickname 应从邮箱提取', async () => {
      const store = useAuthStore.getState();
      await store.register({
        email: 'noname@example.com',
        password: '123456',
      });

      const state = useAuthStore.getState();
      expect(state.user?.nickname).toBe('noname');
    });

    it('注册时未提供 phone 应为空字符串', async () => {
      const store = useAuthStore.getState();
      await store.register({
        email: 'nophone@example.com',
        password: '123456',
      });

      const state = useAuthStore.getState();
      expect(state.user?.phone).toBe('');
    });

    it('重复邮箱注册应抛出错误', async () => {
      const store = useAuthStore.getState();
      await store.register({
        email: 'duplicate@example.com',
        password: '123456',
      });

      await expect(
        store.register({
          email: 'duplicate@example.com',
          password: '654321',
        })
      ).rejects.toThrow('该邮箱已注册');
    });
  });

  describe('logout', () => {
    it('登出后用户应为 null', async () => {
      const store = useAuthStore.getState();
      await store.login({ email: 'logout@example.com', password: '123456' });

      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('应能更新用户昵称', async () => {
      const store = useAuthStore.getState();
      await store.login({ email: 'update@example.com', password: '123456' });

      useAuthStore.getState().updateProfile({ nickname: 'NewName' });

      const state = useAuthStore.getState();
      expect(state.user?.nickname).toBe('NewName');
    });

    it('应能更新手机号', async () => {
      const store = useAuthStore.getState();
      await store.login({ email: 'update2@example.com', password: '123456' });

      useAuthStore.getState().updateProfile({ phone: '13900139000' });

      const state = useAuthStore.getState();
      expect(state.user?.phone).toBe('13900139000');
    });

    it('未登录时更新资料不应崩溃', () => {
      useAuthStore.getState().updateProfile({ nickname: 'NoUser' });
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });
  });
});
