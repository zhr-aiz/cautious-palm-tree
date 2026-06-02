import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import theme from '../theme';
import CreationPanel from '../components/creation/CreationPanel';
import { useGenerationStore } from '../stores/generationStore';
import { useAuthStore } from '../stores/authStore';
import { useHistoryStore } from '../stores/historyStore';

// Mock the mockAiService to avoid canvas/MediaRecorder issues
// Use string literals instead of enum values to avoid circular dependency in vi.mock
vi.mock('../services/mockAiService', () => {
  return {
    createAIService: () => ({
      generateImage: vi.fn().mockResolvedValue({
        id: 'mock-task-id',
        userId: 'test-user',
        type: 'TEXT_TO_IMAGE',
        status: 'PENDING',
        prompt: 'test',
        config: { style: 'realistic', creativity: 0.7, steps: 30 },
        results: [],
        progress: 0,
        createdAt: new Date(),
      }),
      generateVideo: vi.fn().mockResolvedValue({
        id: 'mock-task-id',
        userId: 'test-user',
        type: 'TEXT_TO_VIDEO',
        status: 'PENDING',
        prompt: 'test',
        config: { style: 'realistic', creativity: 0.7, steps: 30 },
        results: [],
        progress: 0,
        createdAt: new Date(),
      }),
      getTaskStatus: vi.fn().mockResolvedValue({
        id: 'mock-task-id',
        userId: 'test-user',
        type: 'TEXT_TO_IMAGE',
        status: 'COMPLETED',
        prompt: 'test',
        config: { style: 'realistic', creativity: 0.7, steps: 30 },
        results: [],
        progress: 100,
        createdAt: new Date(),
        completedAt: new Date(),
      }),
      getTaskResult: vi.fn().mockResolvedValue({
        id: 'mock-result-id',
        taskId: 'mock-task-id',
        mediaType: 'image',
        mediaUrl: 'https://picsum.photos/512/512',
        isFavorited: false,
        tags: [],
        createdAt: new Date(),
      }),
    }),
  };
});

// Mock StorageService
vi.mock('../services/storageService', () => ({
  default: {
    cleanupBlobs: vi.fn().mockResolvedValue(undefined),
    saveResultWithBlob: vi.fn().mockResolvedValue(undefined),
    saveMediaBlob: vi.fn().mockResolvedValue(undefined),
    getMediaBlob: vi.fn().mockResolvedValue(undefined),
    deleteMediaBlob: vi.fn().mockResolvedValue(undefined),
    serializeResult: vi.fn(),
  },
}));

/** 渲染辅助函数 */
function renderCreationPanel() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CreationPanel />} />
          <Route path="/result/:taskId" element={<div data-testid="result-page">结果页</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('CreationPanel', () => {
  beforeEach(() => {
    // 重置 stores
    useGenerationStore.setState({
      currentTask: null,
      activeTasks: [],
      isGenerating: false,
      error: null,
      _pollingIntervals: new Map(),
    });
    useAuthStore.setState({
      user: { id: 'test-user', email: 'test@test.com', phone: '', nickname: 'Test', avatarUrl: '', createdAt: new Date() },
      isAuthenticated: true,
    });
    useHistoryStore.setState({
      tasks: [],
      filter: {},
    });
  });

  it('应渲染提示词输入框', () => {
    renderCreationPanel();
    const input = screen.getByPlaceholderText(/例如/i);
    expect(input).toBeInTheDocument();
  });

  it('应渲染生成按钮', () => {
    renderCreationPanel();
    const button = screen.getByRole('button', { name: /生成/i });
    expect(button).toBeInTheDocument();
  });

  it('空提示词时生成按钮应被禁用', () => {
    renderCreationPanel();
    const button = screen.getByRole('button', { name: /生成/i });
    expect(button).toBeDisabled();
  });

  it('输入提示词后生成按钮应可用', async () => {
    const user = userEvent.setup();
    renderCreationPanel();

    const input = screen.getByPlaceholderText(/例如/i);
    await user.type(input, '一只可爱的猫咪');

    const button = screen.getByRole('button', { name: /生成/i });
    expect(button).not.toBeDisabled();
  });

  it('应渲染风格选择器', () => {
    renderCreationPanel();
    // StylePicker renders labels with emoji prefix like "📷 写实"
    expect(screen.getByText(/写实/)).toBeInTheDocument();
  });

  it('应渲染模式选择器', () => {
    renderCreationPanel();
    expect(screen.getByText('文生图')).toBeInTheDocument();
  });

  it('切换模式为图生图时应显示图片上传区域', async () => {
    const user = userEvent.setup();
    renderCreationPanel();

    await user.click(screen.getByText('图生图'));

    // CreationPanel uses ImageUpload component which shows upload text
    expect(screen.getByText(/上传参考图片/i)).toBeInTheDocument();
  });
});
