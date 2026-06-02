import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useHistoryStore } from '../stores/historyStore';
import { GenerationTask, GenerationResult, GenerationType, GenerationStatus } from '../types';
import { MAX_FAVORITES } from '../utils/constants';

// Mock StorageService
vi.mock('../services/storageService', () => ({
  default: {
    cleanupBlobs: vi.fn().mockResolvedValue(undefined),
    saveMediaBlob: vi.fn().mockResolvedValue(undefined),
    getMediaBlob: vi.fn().mockResolvedValue(undefined),
    deleteMediaBlob: vi.fn().mockResolvedValue(undefined),
    saveResultWithBlob: vi.fn().mockResolvedValue(undefined),
    serializeResult: vi.fn(),
  },
}));

function createMockTask(overrides: Partial<GenerationTask> = {}): GenerationTask {
  return {
    id: `task-${Math.random().toString(36).slice(2, 8)}`,
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

function createMockResult(overrides: Partial<GenerationResult> = {}): GenerationResult {
  return {
    id: `result-${Math.random().toString(36).slice(2, 8)}`,
    taskId: 'task-1',
    mediaType: 'image',
    mediaUrl: 'https://example.com/image.jpg',
    isFavorited: false,
    tags: [],
    createdAt: new Date(),
    ...overrides,
  };
}

describe('historyStore 新增方法', () => {
  beforeEach(() => {
    useHistoryStore.setState({ tasks: [], filter: {} });
  });

  describe('addTag', () => {
    it('应能添加标签到结果', () => {
      const result = createMockResult({ id: 'result-1', tags: [] });
      const task = createMockTask({ id: 'task-1', results: [result] });
      useHistoryStore.getState().addTask(task);

      useHistoryStore.getState().addTag('task-1', 'result-1', '风景');

      const state = useHistoryStore.getState();
      expect(state.tasks[0].results[0].tags).toContain('风景');
    });

    it('重复添加相同标签不应重复', () => {
      const result = createMockResult({ id: 'result-1', tags: ['风景'] });
      const task = createMockTask({ id: 'task-1', results: [result] });
      useHistoryStore.getState().addTask(task);

      useHistoryStore.getState().addTag('task-1', 'result-1', '风景');

      const state = useHistoryStore.getState();
      expect(state.tasks[0].results[0].tags).toHaveLength(1);
    });

    it('添加标签不应影响其他结果', () => {
      const result1 = createMockResult({ id: 'result-1', tags: [] });
      const result2 = createMockResult({ id: 'result-2', tags: [] });
      const task = createMockTask({ id: 'task-1', results: [result1, result2] });
      useHistoryStore.getState().addTask(task);

      useHistoryStore.getState().addTag('task-1', 'result-1', '风景');

      const state = useHistoryStore.getState();
      expect(state.tasks[0].results[0].tags).toContain('风景');
      expect(state.tasks[0].results[1].tags).toHaveLength(0);
    });
  });

  describe('removeTag', () => {
    it('应能移除标签', () => {
      const result = createMockResult({ id: 'result-1', tags: ['风景', '动物'] });
      const task = createMockTask({ id: 'task-1', results: [result] });
      useHistoryStore.getState().addTask(task);

      useHistoryStore.getState().removeTag('task-1', 'result-1', '风景');

      const state = useHistoryStore.getState();
      expect(state.tasks[0].results[0].tags).not.toContain('风景');
      expect(state.tasks[0].results[0].tags).toContain('动物');
    });

    it('移除不存在的标签不应报错', () => {
      const result = createMockResult({ id: 'result-1', tags: ['风景'] });
      const task = createMockTask({ id: 'task-1', results: [result] });
      useHistoryStore.getState().addTask(task);

      useHistoryStore.getState().removeTag('task-1', 'result-1', '不存在');

      const state = useHistoryStore.getState();
      expect(state.tasks[0].results[0].tags).toEqual(['风景']);
    });
  });

  describe('getFavoriteCount', () => {
    it('无收藏应返回 0', () => {
      expect(useHistoryStore.getState().getFavoriteCount()).toBe(0);
    });

    it('应正确计算收藏数量', () => {
      const result1 = createMockResult({ id: 'result-1', isFavorited: true });
      const result2 = createMockResult({ id: 'result-2', isFavorited: false });
      const result3 = createMockResult({ id: 'result-3', isFavorited: true });
      const task1 = createMockTask({ id: 'task-1', results: [result1, result2] });
      const task2 = createMockTask({ id: 'task-2', results: [result3] });

      useHistoryStore.getState().addTask(task1);
      useHistoryStore.getState().addTask(task2);

      expect(useHistoryStore.getState().getFavoriteCount()).toBe(2);
    });
  });

  describe('deleteTasks', () => {
    it('应能批量删除任务', () => {
      const task1 = createMockTask({ id: 'task-1' });
      const task2 = createMockTask({ id: 'task-2' });
      const task3 = createMockTask({ id: 'task-3' });

      useHistoryStore.getState().addTask(task1);
      useHistoryStore.getState().addTask(task2);
      useHistoryStore.getState().addTask(task3);

      useHistoryStore.getState().deleteTasks(['task-1', 'task-3']);

      const state = useHistoryStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].id).toBe('task-2');
    });

    it('删除空数组不应影响列表', () => {
      const task = createMockTask({ id: 'task-1' });
      useHistoryStore.getState().addTask(task);

      useHistoryStore.getState().deleteTasks([]);

      expect(useHistoryStore.getState().tasks).toHaveLength(1);
    });
  });

  describe('收藏上限逻辑', () => {
    it('收藏数达到 MAX_FAVORITES 后不应再添加', () => {
      // 创建 MAX_FAVORITES 个已收藏结果
      const results: GenerationResult[] = [];
      for (let i = 0; i < MAX_FAVORITES; i++) {
        results.push(createMockResult({ id: `fav-result-${i}`, isFavorited: true }));
      }

      // 分配到任务中（每个任务10个结果）
      const chunkSize = 10;
      for (let i = 0; i < results.length; i += chunkSize) {
        const chunk = results.slice(i, i + chunkSize);
        const task = createMockTask({
          id: `fav-task-${i / chunkSize}`,
          results: chunk,
        });
        useHistoryStore.getState().addTask(task);
      }

      // 尝试添加新的收藏
      const newResult = createMockResult({ id: 'new-result', isFavorited: false });
      const newTask = createMockTask({ id: 'new-task', results: [newResult] });
      useHistoryStore.getState().addTask(newTask);

      useHistoryStore.getState().toggleFavorite('new-task', 'new-result');

      // 新结果不应被收藏
      const state = useHistoryStore.getState();
      const newResultTask = state.tasks.find(t => t.id === 'new-task');
      expect(newResultTask?.results[0].isFavorited).toBe(false);
    });

    it('取消收藏后应能添加新收藏', () => {
      // Fill to max
      const results: GenerationResult[] = [];
      for (let i = 0; i < MAX_FAVORITES; i++) {
        results.push(createMockResult({ id: `fav-result-${i}`, isFavorited: true }));
      }
      const task1 = createMockTask({ id: 'task-full', results });
      useHistoryStore.getState().addTask(task1);

      // Add new unfavorite result
      const newResult = createMockResult({ id: 'new-result', isFavorited: false });
      const task2 = createMockTask({ id: 'task-new', results: [newResult] });
      useHistoryStore.getState().addTask(task2);

      // Try to favorite - should fail
      useHistoryStore.getState().toggleFavorite('task-new', 'new-result');
      expect(useHistoryStore.getState().getFavoriteCount()).toBe(MAX_FAVORITES);

      // Unfavorite one
      useHistoryStore.getState().toggleFavorite('task-full', 'fav-result-0');
      expect(useHistoryStore.getState().getFavoriteCount()).toBe(MAX_FAVORITES - 1);

      // Now try to favorite again - should succeed
      useHistoryStore.getState().toggleFavorite('task-new', 'new-result');
      expect(useHistoryStore.getState().getFavoriteCount()).toBe(MAX_FAVORITES);
    });
  });

  describe('标签筛选', () => {
    it('按标签筛选应返回匹配任务', () => {
      const result1 = createMockResult({ id: 'r-1', tags: ['风景', '山'] });
      const result2 = createMockResult({ id: 'r-2', tags: ['动物', '猫'] });
      const task1 = createMockTask({ id: 't-1', results: [result1], prompt: '风景' });
      const task2 = createMockTask({ id: 't-2', results: [result2], prompt: '动物' });

      useHistoryStore.getState().addTask(task1);
      useHistoryStore.getState().addTask(task2);

      useHistoryStore.getState().setFilter({ tags: ['风景'] });
      const filtered = useHistoryStore.getState().getFilteredTasks();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('t-1');
    });

    it('仅收藏筛选应只返回有收藏的任务', () => {
      const result1 = createMockResult({ id: 'r-1', isFavorited: true });
      const result2 = createMockResult({ id: 'r-2', isFavorited: false });
      const task1 = createMockTask({ id: 't-1', results: [result1] });
      const task2 = createMockTask({ id: 't-2', results: [result2] });

      useHistoryStore.getState().addTask(task1);
      useHistoryStore.getState().addTask(task2);

      useHistoryStore.getState().setFilter({ favoritesOnly: true });
      const filtered = useHistoryStore.getState().getFilteredTasks();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('t-1');
    });
  });
});
