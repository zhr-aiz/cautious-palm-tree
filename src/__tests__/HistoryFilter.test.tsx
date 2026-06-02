import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import HistoryFilterBar from '../components/history/HistoryFilter';
import { GenerationType, GenerationStatus } from '../types';
import type { HistoryFilter } from '../types';

/** 包裹 MUI 主题的渲染辅助函数 */
function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('HistoryFilterBar', () => {
  const mockOnFilterChange = vi.fn();
  const defaultFilter: HistoryFilter = {};

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('应渲染搜索框', () => {
    renderWithTheme(
      <HistoryFilterBar filter={defaultFilter} onFilterChange={mockOnFilterChange} />
    );

    const searchInput = screen.getByPlaceholderText('搜索历史记录...');
    expect(searchInput).toBeInTheDocument();
  });

  it('应渲染"全部"类型筛选 Chip', () => {
    renderWithTheme(
      <HistoryFilterBar filter={defaultFilter} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByText('全部')).toBeInTheDocument();
  });

  it('应渲染所有生成类型标签', () => {
    renderWithTheme(
      <HistoryFilterBar filter={defaultFilter} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByText('文生图')).toBeInTheDocument();
    expect(screen.getByText('文生视频')).toBeInTheDocument();
    expect(screen.getByText('图生图')).toBeInTheDocument();
    expect(screen.getByText('图生视频')).toBeInTheDocument();
  });

  it('应渲染状态筛选 Chips', () => {
    renderWithTheme(
      <HistoryFilterBar filter={defaultFilter} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByText('全部状态')).toBeInTheDocument();
    expect(screen.getByText('已完成')).toBeInTheDocument();
    expect(screen.getByText('生成中')).toBeInTheDocument();
    expect(screen.getByText('失败')).toBeInTheDocument();
  });

  it('点击类型 Chip 应调用 onFilterChange', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <HistoryFilterBar filter={defaultFilter} onFilterChange={mockOnFilterChange} />
    );

    await user.click(screen.getByText('文生图'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ type: GenerationType.TEXT_TO_IMAGE })
    );
  });

  it('点击状态 Chip 应调用 onFilterChange', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <HistoryFilterBar filter={defaultFilter} onFilterChange={mockOnFilterChange} />
    );

    await user.click(screen.getByText('已完成'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: GenerationStatus.COMPLETED })
    );
  });

  it('点击"全部"应清除类型筛选', async () => {
    const user = userEvent.setup();
    const filterWithType: HistoryFilter = { type: GenerationType.TEXT_TO_IMAGE };
    renderWithTheme(
      <HistoryFilterBar filter={filterWithType} onFilterChange={mockOnFilterChange} />
    );

    await user.click(screen.getByText('全部'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ type: undefined })
    );
  });

  it('输入搜索关键词应调用 onFilterChange', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <HistoryFilterBar filter={defaultFilter} onFilterChange={mockOnFilterChange} />
    );

    const searchInput = screen.getByPlaceholderText('搜索历史记录...');
    await user.type(searchInput, '猫');

    expect(mockOnFilterChange).toHaveBeenCalled();
    const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1];
    expect(lastCall[0].keyword).toContain('猫');
  });
});
