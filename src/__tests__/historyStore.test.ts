import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useHistoryStore } from '../stores/historyStore';
import { GenerationTask, GenerationStatus, GenerationType, GenerationResult } from '../types';
import { MAX_HISTORY_RECORDS } from '../utils/constants';

// Mock StorageService to avoid IndexedDB calls in tests
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

/** 创建测试用 GenerationTask */
function createMockTask(overrides: Partial<GenerationTask> = {}): GenerationTask {
  return {
    id: `task-${Math.random().toString(36).slice(2, 8)}`,
    userId: 'test-user',
    type: GenerationType.TEXT_TO_IMAGE,
    status: GenerationStatus.COMPLETED,
    prompt: '一只可爱的猫咪',
    config: {
      style: 'realistic',
      creativity: 0.7,
      steps: 30,
    },
    results: [],
    progress: 100,
    createdAt: new Date(),
    ...overrides,
  };
}

/** 创建测试用 GenerationResult */
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

describe('historyStore', () => {
  beforeEach(() => {
    // 重置 store
    useHistoryStore.setState({
      tasks: [],
      filter: {},
    });
  });

  describe('初始状态', () => {
    it('初始时任务列表应为空', () => {
      expect(useHistoryStore.getState().tasks).toEqual([]);
    });

    it('初始时筛选条件应为空', () => {
      expect(useHistoryStore.getState().filter).toEqual({});
    });
  });

  describe('addTask', () => {
    it('应能添加任务到历史记录', () => {
      const task = createMockTask();
      useHistoryStore.getState().addTask(task);

      const state = useHistoryStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].id).toBe(task.id);
    });

    it('新任务应添加到列表开头', () => {
      const task1 = createMockTask({ id: 'task-1' });
      const task2 = createMockTask({ id: 'task-2' });

      useHistoryStore.getState().addTask(task1);
      useHistoryStore.getState().addTask(task2);

      const state = useHistoryStore.getState();
      expect(state.tasks[0].id).toBe('task-2');
      expect(state.tasks[1].id).toBe('task-1');
    });

    it('应能添加多个任务', () => {
      for (let i = 0; i < 5; i++) {
        useHistoryStore.getState().addTask(createMockTask({ id: `task-${i}` }));
      }

      expect(useHistoryStore.getState().tasks).toHaveLength(5);
    });
  });

  describe('updateTask', () => {
    it('应能更新已存在的任务', () => {
      const task = createMockTask({ id: 'task-1', status: GenerationStatus.PENDING });
      useHistoryStore.getState().addTask(task);

      const updatedTask = { ...task, status: GenerationStatus.COMPLETED, progress: 100 };
      useHistoryStore.getState().updateTask(updatedTask);

      const state = useHistoryStore.getState();
      expect(state.tasks[0].status).toBe(GenerationStatus.COMPLETED);
    });

    it('更新不存在的任务不应影响列表', () => {
      const task = createMockTask({ id: 'task-1' });
      useHistoryStore.getState().addTask(task);

      const ghostTask = createMockTask({ id: 'ghost-task' });
      useHistoryStore.getState().updateTask(ghostTask);

      expect(useHistoryStore.getState().tasks).toHaveLength(1);
    });
  });

  describe('deleteTask', () => {
    it('应能删除指定任务', () => {
      const task1 = createMockTask({ id: 'task-1' });
      const task2 = createMockTask({ id: 'task-2' });

      useHistoryStore.getState().addTask(task1);
      useHistoryStore.getState().addTask(task2);

      useHistoryStore.getState().deleteTask('task-1');

      const state = useHistoryStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].id).toBe('task-2');
    });

    it('删除不存在的任务不应报错', () => {
      useHistoryStore.getState().addTask(createMockTask({ id: 'task-1' }));
      useHistoryStore.getState().deleteTask('non-existent');

      expect(useHistoryStore.getState().tasks).toHaveLength(1);
    });
  });

  describe('toggleFavorite', () => {
    it('应能切换收藏状态', () => {
      const result1 = createMockResult({ id: 'result-1', isFavorited: false });
      const task = createMockTask({ id: 'task-1', results: [result1] });
      useHistoryStore.getState().addTask(task);

      useHistoryStore.getState().toggleFavorite('task-1', 'result-1');

      const state = useHistoryStore.getState();
      expect(state.tasks[0].results[0].isFavorited).toBe(true);
    });

    it('再次切换应取消收藏', () => {
      const result1 = createMockResult({ id: 'result-1', isFavorited: true });
      const task = createMockTask({ id: 'task-1', results: [result1] });
      useHistoryStore.getState().addTask(task);

      useHistoryStore.getState().toggleFavorite('task-1', 'result-1');

      const state = useHistoryStore.getState();
      expect(state.tasks[0].results[0].isFavorited).toBe(false);
    });

    it('切换其他任务的收藏不应影响当前任务', () => {
      const result1 = createMockResult({ id: 'result-1', isFavorited: false });
      const result2 = createMockResult({ id: 'result-2', isFavorited: false });
      const task1 = createMockTask({ id: 'task-1', results: [result1] });
      const task2 = createMockTask({ id: 'task-2', results: [result2] });

      useHistoryStore.getState().addTask(task1);
      useHistoryStore.getState().addTask(task2);

      useHistoryStore.getState().toggleFavorite('task-1', 'result-1');

      const state = useHistoryStore.getState();
      const t1 = state.tasks.find((t) => t.id === 'task-1');
      const t2 = state.tasks.find((t) => t.id === 'task-2');
      expect(t1?.results[0].isFavorited).toBe(true);
      expect(t2?.results[0].isFavorited).toBe(false);
    });
  });

  describe('clearHistory', () => {
    it('应清空所有历史记录', () => {
      for (let i = 0; i < 5; i++) {
        useHistoryStore.getState().addTask(createMockTask({ id: `task-${i}` }));
      }

      useHistoryStore.getState().clearHistory();

      expect(useHistoryStore.getState().tasks).toEqual([]);
    });
  });

  describe('setFilter / getFilteredTasks', () => {
    beforeEach(() => {
      // 添加不同类型的任务
      useHistoryStore.getState().addTask(
        createMockTask({
          id: 'task-image',
          type: GenerationType.TEXT_TO_IMAGE,
          status: GenerationStatus.COMPLETED,
          prompt: '一只猫',
        })
      );
      useHistoryStore.getState().addTask(
        createMockTask({
          id: 'task-video',
          type: GenerationType.TEXT_TO_VIDEO,
          status: GenerationStatus.PROCESSING,
          prompt: '一段狗的视频',
        })
      );
      useHistoryStore.getState().addTask(
        createMockTask({
          id: 'task-failed',
          type: GenerationType.TEXT_TO_IMAGE,
          status: GenerationStatus.FAILED,
          prompt: '一棵树',
        })
      );
    });

    it('无筛选条件应返回全部任务', () => {
      useHistoryStore.getState().setFilter({});
      const filtered = useHistoryStore.getState().getFilteredTasks();
      expect(filtered).toHaveLength(3);
    });

    it('按类型筛选应返回对应任务', () => {
      useHistoryStore.getState().setFilter({ type: GenerationType.TEXT_TO_IMAGE });
      const filtered = useHistoryStore.getState().getFilteredTasks();
      expect(filtered).toHaveLength(2);
      filtered.forEach((t) => expect(t.type).toBe(GenerationType.TEXT_TO_IMAGE));
    });

    it('按状态筛选应返回对应任务', () => {
      useHistoryStore.getState().setFilter({ status: GenerationStatus.COMPLETED });
      const filtered = useHistoryStore.getState().getFilteredTasks();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe(GenerationStatus.COMPLETED);
    });

    it('按关键词筛选应返回匹配任务', () => {
      useHistoryStore.getState().setFilter({ keyword: '猫' });
      const filtered = useHistoryStore.getState().getFilteredTasks();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].prompt).toContain('猫');
    });

    it('关键词搜索应不区分大小写', () => {
      useHistoryStore.getState().setFilter({ keyword: '一' });
      const filtered = useHistoryStore.getState().getFilteredTasks();
      expect(filtered.length).toBeGreaterThanOrEqual(1);
    });

    it('组合筛选条件应同时满足', () => {
      useHistoryStore.getState().setFilter({
        type: GenerationType.TEXT_TO_IMAGE,
        status: GenerationStatus.COMPLETED,
      });
      const filtered = useHistoryStore.getState().getFilteredTasks();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('task-image');
    });

    it('无匹配结果应返回空数组', () => {
      useHistoryStore.getState().setFilter({ keyword: '不存在的关键词xyz' });
      const filtered = useHistoryStore.getState().getFilteredTasks();
      expect(filtered).toHaveLength(0);
    });
  });

  describe('200条上限自动清理', () => {
    it('超过200条时应自动清理旧记录', () => {
      // 添加201条记录
      for (let i = 0; i < 201; i++) {
        useHistoryStore.getState().addTask(
          createMockTask({ id: `task-${i}`, prompt: `Task ${i}` })
        );
      }

      const state = useHistoryStore.getState();
      expect(state.tasks.length).toBeLessThanOrEqual(MAX_HISTORY_RECORDS);
    });
  });
});
