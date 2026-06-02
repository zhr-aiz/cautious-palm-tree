import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import theme from '../theme';
import QuotaDisplay from '../components/membership/QuotaDisplay';
import { MembershipTier, QuotaState } from '../types';
import { TIER_QUOTAS } from '../utils/constants';

function createQuotaState(tier: MembershipTier, overrides: Partial<QuotaState> = {}): QuotaState {
  const config = TIER_QUOTAS[tier];
  return {
    daily: {
      image: { used: 0, total: config.dailyImage, resetAt: new Date().toISOString() },
      video: { used: 0, total: config.dailyVideo, resetAt: new Date().toISOString() },
    },
    credits: { balance: config.credits, expiringAt: undefined },
    tier,
    ...overrides,
  };
}

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('QuotaDisplay', () => {
  it('应渲染图片额度标签', () => {
    renderWithTheme(<QuotaDisplay quotaState={createQuotaState(MembershipTier.FREE)} />);
    expect(screen.getByText('图片')).toBeInTheDocument();
  });

  it('应渲染视频额度标签', () => {
    renderWithTheme(<QuotaDisplay quotaState={createQuotaState(MembershipTier.FREE)} />);
    expect(screen.getByText('视频')).toBeInTheDocument();
  });

  it('应显示 Free tier 的已用/总额度', () => {
    renderWithTheme(<QuotaDisplay quotaState={createQuotaState(MembershipTier.FREE)} />);
    // Free: 0/5 图片, 0/2 视频
    expect(screen.getByText('0/5')).toBeInTheDocument();
    expect(screen.getByText('0/2')).toBeInTheDocument();
  });

  it('应显示积分余额', () => {
    renderWithTheme(<QuotaDisplay quotaState={createQuotaState(MembershipTier.PRO)} />);
    // Pro credits: 100
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('Enterprise 999 总量应显示为 ∞', () => {
    renderWithTheme(<QuotaDisplay quotaState={createQuotaState(MembershipTier.ENTERPRISE)} />);
    // Enterprise has 999 for both image and video, both show ∞
    const infinityElements = screen.getAllByText(/∞/);
    expect(infinityElements.length).toBeGreaterThanOrEqual(2);
  });

  it('compact 模式应正常渲染', () => {
    const { container } = renderWithTheme(
      <QuotaDisplay quotaState={createQuotaState(MembershipTier.FREE)} compact />
    );
    expect(container.querySelector('[class*="MuiBox-root"]')).toBeInTheDocument();
  });

  it('部分使用额度应正确显示', () => {
    const partialState = createQuotaState(MembershipTier.FREE, {
      daily: {
        image: { used: 3, total: 5, resetAt: new Date().toISOString() },
        video: { used: 1, total: 2, resetAt: new Date().toISOString() },
      },
    });
    renderWithTheme(<QuotaDisplay quotaState={partialState} />);
    expect(screen.getByText('3/5')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });
});
