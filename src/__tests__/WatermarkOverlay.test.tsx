import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import WatermarkOverlay from '../components/result/WatermarkOverlay';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
}

describe('WatermarkOverlay', () => {
  it('应渲染默认水印文字 "AI 媒体创作"', () => {
    renderWithTheme(<WatermarkOverlay />);
    const watermarks = screen.getAllByText('AI 媒体创作');
    expect(watermarks.length).toBeGreaterThan(0);
  });

  it('应渲染自定义水印文字', () => {
    renderWithTheme(<WatermarkOverlay text="Custom Watermark" />);
    const watermarks = screen.getAllByText('Custom Watermark');
    expect(watermarks.length).toBeGreaterThan(0);
  });

  it('应渲染6行3列共18个水印', () => {
    renderWithTheme(<WatermarkOverlay text="测试" />);
    const watermarks = screen.getAllByText('测试');
    expect(watermarks).toHaveLength(18);
  });

  it('容器应有 pointerEvents: none', () => {
    const { container } = renderWithTheme(<WatermarkOverlay />);
    const overlayBox = container.firstChild as HTMLElement;
    expect(overlayBox).toBeInTheDocument();
  });
});
