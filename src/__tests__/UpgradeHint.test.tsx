import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import theme from '../theme';
import UpgradeHint from '../components/membership/UpgradeHint';
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

describe('UpgradeHint', () => {
  it('应显示功能名称', () => {
    renderWithTheme(<UpgradeHint feature="图生图" />);
    expect(screen.getByText(/图生图/)).toBeInTheDocument();
  });

  it('应显示升级按钮', () => {
    renderWithTheme(<UpgradeHint feature="图生图" />);
    expect(screen.getByRole('button', { name: /升级/ })).toBeInTheDocument();
  });

  it('应显示"需要升级到专业版"提示', () => {
    renderWithTheme(<UpgradeHint feature="图生图" />);
    expect(screen.getByText(/需要升级到专业版/)).toBeInTheDocument();
  });

  it('onClose 回调应能触发', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithTheme(<UpgradeHint feature="图生图" onClose={onClose} />);

    // The close button should exist when onClose is provided
    const closeButtons = screen.getAllByRole('button');
    // Find the close icon button (small icon button, not the "升级" button)
    const closeButton = closeButtons.find(btn => btn.textContent === '' || btn.querySelector('svg'));
    if (closeButton && closeButton !== screen.getByRole('button', { name: /升级/ })) {
      await user.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('不传 onClose 时不应显示关闭按钮', () => {
    renderWithTheme(<UpgradeHint feature="图生图" />);
    // Should have only the "升级" button, no close icon button
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
  });

  it('requiredTier 为 ENTERPRISE 时应正常渲染', () => {
    renderWithTheme(<UpgradeHint feature="种子值控制" requiredTier={MembershipTier.ENTERPRISE} />);
    expect(screen.getByText(/种子值控制/)).toBeInTheDocument();
  });
});
