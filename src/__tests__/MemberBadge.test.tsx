import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import theme from '../theme';
import MemberBadge from '../components/membership/MemberBadge';
import { MembershipTier } from '../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('MemberBadge', () => {
  it('Free tier 应显示免费版', () => {
    renderWithTheme(<MemberBadge tier={MembershipTier.FREE} />);
    expect(screen.getByText(/免费版/)).toBeInTheDocument();
  });

  it('Pro tier 应显示专业版', () => {
    renderWithTheme(<MemberBadge tier={MembershipTier.PRO} />);
    expect(screen.getByText(/专业版/)).toBeInTheDocument();
  });

  it('Enterprise tier 应显示企业版', () => {
    renderWithTheme(<MemberBadge tier={MembershipTier.ENTERPRISE} />);
    expect(screen.getByText(/企业版/)).toBeInTheDocument();
  });

  it('默认 size 为 md 时应正常渲染', () => {
    const { container } = renderWithTheme(<MemberBadge tier={MembershipTier.PRO} />);
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });

  it('size=sm 应正常渲染', () => {
    const { container } = renderWithTheme(<MemberBadge tier={MembershipTier.PRO} size="sm" />);
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });

  it('size=lg 应正常渲染', () => {
    const { container } = renderWithTheme(<MemberBadge tier={MembershipTier.PRO} size="lg" />);
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });
});
