import { create } from 'zustand';
import { GenerationTask, GenerationConfig, GenerationType, GenerationStatus } from '../types';
import { createAIService } from '../services/mockAiService';
import StorageService from '../services/storageService';
import { useAuthStore } from './authStore';
import { useHistoryStore } from './historyStore';

/** Generation store state */
interface GenerationState {
  /** Current active task */
  currentTask: GenerationTask | null;
  /** All active tasks (in-progress or recently completed) */
  activeTasks: GenerationTask[];
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Error message if generation fails */
  error: string | null;
  /** Batch tasks for batch generation */
  batchTasks: GenerationTask[];
  /** Start a generation task */
  startGeneration: (type: GenerationType, prompt: string, config: GenerationConfig) => Promise<string>;
  /** Start batch generation (multiple tasks) */
  startBatchGeneration: (type: GenerationType, prompt: string, config: GenerationConfig, batchSize: number) => Promise<string[]>;
  /** Poll task status for updates */
  pollTaskStatus: (taskId: string) => Promise<void>;
  /** Cancel a generation task */
  cancelGeneration: (taskId: string) => void;
  /** Clear current task */
  clearCurrentTask: () => void;
  /** Clear error */
  clearError: () => void;
  /** Clear batch tasks */
  clearBatchTasks: () => void;
  /** Polling interval IDs */
  _pollingIntervals: Map<string, ReturnType<typeof setInterval>>;
}

const aiService = createAIService();

/**
 * Generation store manages the creation process for AI media.
 * Handles starting tasks, polling for progress, and storing results.
 */
export const useGenerationStore = create<GenerationState>()((set, get) => ({
  currentTask: null,
  activeTasks: [],
  isGenerating: false,
  error: null,
  batchTasks: [],
  _pollingIntervals: new Map(),

  startGeneration: async (type, prompt, config) => {
    set({ isGenerating: true, error: null });

    try {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 'anonymous';

      let task: GenerationTask;

      if (type === GenerationType.TEXT_TO_IMAGE || type === GenerationType.IMAGE_TO_IMAGE) {
        task = await aiService.generateImage(prompt, config);
      } else {
        task = await aiService.generateVideo(prompt, config);
      }

      // Override with current user
      task.userId = userId;
      task.type = type;

      set((state) => ({
        currentTask: task,
        activeTasks: [...state.activeTasks, task],
      }));

      // Start polling for status updates
      const intervalId = setInterval(async () => {
        await get().pollTaskStatus(task.id);
      }, 1000);

      const intervals = new Map(get()._pollingIntervals);
      intervals.set(task.id, intervalId);
      set({ _pollingIntervals: intervals });

      // Add to history store
      useHistoryStore.getState().addTask(task);

      return task.id;
    } catch (error: any) {
      set({
        isGenerating: false,
        error: error.message || '生成失败，请重试',
      });
      throw error;
    }
  },

  pollTaskStatus: async (taskId) => {
    try {
      const updatedTask = await aiService.getTaskStatus(taskId);

      set((state) => ({
        currentTask: state.currentTask?.id === taskId ? updatedTask : state.currentTask,
        activeTasks: state.activeTasks.map((t) =>
          t.id === taskId ? updatedTask : t
        ),
      }));

      // Update in history store
      useHistoryStore.getState().updateTask(updatedTask);

      // If task is completed or failed, stop polling and save blob
      if (
        updatedTask.status === GenerationStatus.COMPLETED ||
        updatedTask.status === GenerationStatus.FAILED
      ) {
        const intervals = new Map(get()._pollingIntervals);
        const intervalId = intervals.get(taskId);
        if (intervalId) {
          clearInterval(intervalId);
          intervals.delete(taskId);
          set({ _pollingIntervals: intervals });
        }

        // Save result blobs to IndexedDB
        for (const result of updatedTask.results) {
          if (result.mediaBlob) {
            await StorageService.saveResultWithBlob(result);
          }
        }

        set({ isGenerating: false });
      }
    } catch (error: any) {
      console.error('Polling error:', error);
    }
  },

  cancelGeneration: (taskId) => {
    const intervals = new Map(get()._pollingIntervals);
    const intervalId = intervals.get(taskId);
    if (intervalId) {
      clearInterval(intervalId);
      intervals.delete(taskId);
      set({ _pollingIntervals: intervals });
    }

    set((state) => ({
      currentTask: state.currentTask?.id === taskId ? null : state.currentTask,
      activeTasks: state.activeTasks.map((t) =>
        t.id === taskId ? { ...t, status: GenerationStatus.FAILED, progress: 0 } : t
      ),
      isGenerating: false,
    }));
  },

  clearCurrentTask: () => {
    set({ currentTask: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  startBatchGeneration: async (type, prompt, config, batchSize) => {
    set({ isGenerating: true, error: null, batchTasks: [] });

    try {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 'anonymous';

      const taskIds: string[] = [];
      const tasks: GenerationTask[] = [];

      for (let i = 0; i < batchSize; i++) {
        const aiService = createAIService();
        let task: GenerationTask;

        if (type === GenerationType.TEXT_TO_IMAGE || type === GenerationType.IMAGE_TO_IMAGE) {
          task = await aiService.generateImage(prompt, { ...config, seed: config.seed ? config.seed + i : undefined });
        } else {
          task = await aiService.generateVideo(prompt, { ...config, seed: config.seed ? config.seed + i : undefined });
        }

        task.userId = userId;
        task.type = type;

        tasks.push(task);
        taskIds.push(task.id);

        // Start polling for each task
        const intervalId = setInterval(async () => {
          await get().pollTaskStatus(task.id);
        }, 1000);

        const intervals = new Map(get()._pollingIntervals);
        intervals.set(task.id, intervalId);
        set({ _pollingIntervals: intervals });

        // Add to history store
        useHistoryStore.getState().addTask(task);
      }

      set({
        currentTask: tasks[0],
        activeTasks: [...get().activeTasks, ...tasks],
        batchTasks: tasks,
      });

      return taskIds;
    } catch (error: any) {
      set({
        isGenerating: false,
        error: error.message || '批量生成失败，请重试',
      });
      throw error;
    }
  },

  clearBatchTasks: () => {
    set({ batchTasks: [] });
  },
}));
