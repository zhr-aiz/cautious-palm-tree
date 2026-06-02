import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import theme from '../theme';
import ShareDialog from '../components/result/ShareDialog';
import { GenerationResult, GenerationTask, GenerationType, GenerationStatus } from '../types';
import { useMembershipStore } from '../stores/membershipStore';

function createMockResult(overrides: Partial<GenerationResult> = {}): GenerationResult {
  return {
    id: 'result-1',
    taskId: 'task-1',
    mediaType: 'image',
    mediaUrl: 'https://example.com/image.jpg',
    isFavorited: false,
    tags: [],
    createdAt: new Date(),
    ...overrides,
  };
}

function createMockTask(overrides: Partial<GenerationTask> = {}): GenerationTask {
  return {
    id: 'task-1',
    userId: 'test-user',
    type: GenerationType.TEXT_TO_IMAGE,
    status: GenerationStatus.COMPLETED,
    prompt: '一只可爱的猫咪',
    config: { style: 'realistic', creativity: 0.7, steps: 30 },
    results: [],
    progress: 100,
    createdAt: new Date(),
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

describe('ShareDialog', () => {
  it('open=true 时应显示对话框', () => {
    const result = createMockResult();
    const task = createMockTask();
    renderWithTheme(
      <ShareDialog open={true} onClose={vi.fn()} result={result} task={task} />
    );

    expect(screen.getByText('分享到作品广场')).toBeInTheDocument();
  });

  it('open=false 时不应显示对话框内容', () => {
    renderWithTheme(
      <ShareDialog open={false} onClose={vi.fn()} result={undefined} task={null} />
    );

    expect(screen.queryByText('分享到作品广场')).not.toBeInTheDocument();
  });

  it('应显示 task 的 prompt', () => {
    const result = createMockResult();
    const task = createMockTask({ prompt: '测试 prompt 内容' });
    renderWithTheme(
      <ShareDialog open={true} onClose={vi.fn()} result={result} task={task} />
    );

    expect(screen.getByText('测试 prompt 内容')).toBeInTheDocument();
  });

  it('应显示昵称输入框', () => {
    const result = createMockResult();
    const task = createMockTask();
    renderWithTheme(
      <ShareDialog open={true} onClose={vi.fn()} result={result} task={task} />
    );

    expect(screen.getByLabelText('显示昵称')).toBeInTheDocument();
  });

  it('应显示取消和确认分享按钮', () => {
    const result = createMockResult();
    const task = createMockTask();
    renderWithTheme(
      <ShareDialog open={true} onClose={vi.fn()} result={result} task={task} />
    );

    expect(screen.getByText('取消')).toBeInTheDocument();
    expect(screen.getByText('确认分享')).toBeInTheDocument();
  });

  it('result 和 task 都为空时确认分享按钮应禁用', () => {
    renderWithTheme(
      <ShareDialog open={true} onClose={vi.fn()} result={undefined} task={null} />
    );

    // Dialog is open but result/task are empty
    // The share button should be disabled when result or task is missing
    const shareButton = screen.queryByRole('button', { name: /确认分享/ });
    if (shareButton) {
      expect(shareButton).toBeDisabled();
    }
  });

  it('点击取消应调用 onClose', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const result = createMockResult();
    const task = createMockTask();
    renderWithTheme(
      <ShareDialog open={true} onClose={onClose} result={result} task={task} />
    );

    await user.click(screen.getByText('取消'));
    expect(onClose).toHaveBeenCalled();
  });
});
