import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import AuthGuard from '../components/auth/AuthGuard';
import { useAuthStore } from '../stores/authStore';
import { ROUTES } from '../utils/constants';

/** 包裹 MUI 主题的渲染辅助函数 */
function renderWithProviders(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={ROUTES.AUTH} element={<div data-testid="auth-page">登录页面</div>} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <div data-testid="protected-content">受保护的内容</div>
              </AuthGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('AuthGuard', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('未认证时应重定向到登录页面', () => {
    renderWithProviders(<></>, { route: '/' });
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('已认证时应显示受保护内容', () => {
    useAuthStore.setState({
      user: {
        id: '1',
        email: 'test@test.com',
        phone: '',
        nickname: 'Test',
        avatarUrl: '',
        createdAt: new Date(),
      },
      isAuthenticated: true,
    });

    renderWithProviders(<></>, { route: '/' });
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('从认证到未认证状态切换时应重定向', () => {
    useAuthStore.setState({
      user: {
        id: '1',
        email: 'test@test.com',
        phone: '',
        nickname: 'Test',
        avatarUrl: '',
        createdAt: new Date(),
      },
      isAuthenticated: true,
    });

    const { rerender } = renderWithProviders(<></>, { route: '/' });
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();

    // 模拟登出
    useAuthStore.setState({ user: null, isAuthenticated: false });

    rerender(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path={ROUTES.AUTH} element={<div data-testid="auth-page">登录页面</div>} />
            <Route
              path="/"
              element={
                <AuthGuard>
                  <div data-testid="protected-content">受保护的内容</div>
                </AuthGuard>
              }
            />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
  });
});
