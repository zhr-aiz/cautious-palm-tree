import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GenerationTask, HistoryFilter } from '../types';
import { MAX_HISTORY_RECORDS, MAX_FAVORITES, STORAGE_KEYS } from '../utils/constants';
import StorageService from '../services/storageService';

/** History store state */
interface HistoryState {
  /** All generation tasks (history) */
  tasks: GenerationTask[];
  /** Current filter */
  filter: HistoryFilter;
  /** Set the history filter */
  setFilter: (filter: HistoryFilter) => void;
  /** Add a task to history */
  addTask: (task: GenerationTask) => void;
  /** Update an existing task in history */
  updateTask: (task: GenerationTask) => void;
  /** Delete a task from history */
  deleteTask: (taskId: string) => void;
  /** Delete multiple tasks */
  deleteTasks: (taskIds: string[]) => void;
  /** Toggle favorite on a task's results */
  toggleFavorite: (taskId: string, resultId: string) => void;
  /** Get favorite count */
  getFavoriteCount: () => number;
  /** Add tag to a result */
  addTag: (taskId: string, resultId: string, tag: string) => void;
  /** Remove tag from a result */
  removeTag: (taskId: string, resultId: string, tag: string) => void;
  /** Clear all history */
  clearHistory: () => void;
  /** Get filtered tasks */
  getFilteredTasks: () => GenerationTask[];
  /** Enforce max history records limit */
  _enforceLimit: () => void;
}

/**
 * History store with localStorage persistence.
 * Manages generation history with auto-cleanup at 200 records.
 */
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: {},

      setFilter: (filter) => {
        set({ filter });
      },

      addTask: (task) => {
        set((state) => {
          const newTasks = [task, ...state.tasks];
          return { tasks: newTasks };
        });
        get()._enforceLimit();
      },

      updateTask: (task) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        }));
      },

      deleteTask: (taskId) => {
        set((state) => {
          const taskToDelete = state.tasks.find((t) => t.id === taskId);
          // Clean up blobs for deleted task
          if (taskToDelete) {
            const resultIds = taskToDelete.results.map((r) => r.id);
            StorageService.cleanupBlobs(resultIds);
          }
          return {
            tasks: state.tasks.filter((t) => t.id !== taskId),
          };
        });
      },

      deleteTasks: (taskIds) => {
        set((state) => {
          const tasksToDelete = state.tasks.filter((t) => taskIds.includes(t.id));
          // Clean up blobs for deleted tasks
          const resultIds = tasksToDelete.flatMap((t) => t.results.map((r) => r.id));
          StorageService.cleanupBlobs(resultIds);
          return {
            tasks: state.tasks.filter((t) => !taskIds.includes(t.id)),
          };
        });
      },

      toggleFavorite: (taskId, resultId) => {
        const { tasks } = get();
        // Check favorites limit before adding
        const currentFavorites = tasks.reduce(
          (count, t) => count + t.results.filter((r) => r.isFavorited).length,
          0
        );
        const targetResult = tasks
          .find((t) => t.id === taskId)
          ?.results.find((r) => r.id === resultId);
        const isCurrentlyFavorited = targetResult?.isFavorited ?? false;

        // If adding a favorite and we're at the limit, don't allow it
        if (!isCurrentlyFavorited && currentFavorites >= MAX_FAVORITES) {
          return;
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  results: t.results.map((r) =>
                    r.id === resultId ? { ...r, isFavorited: !r.isFavorited } : r
                  ),
                }
              : t
          ),
        }));
      },

      getFavoriteCount: () => {
        const { tasks } = get();
        return tasks.reduce(
          (count, t) => count + t.results.filter((r) => r.isFavorited).length,
          0
        );
      },

      addTag: (taskId, resultId, tag) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  results: t.results.map((r) =>
                    r.id === resultId && !r.tags.includes(tag)
                      ? { ...r, tags: [...r.tags, tag] }
                      : r
                  ),
                }
              : t
          ),
        }));
      },

      removeTag: (taskId, resultId, tag) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  results: t.results.map((r) =>
                    r.id === resultId
                      ? { ...r, tags: r.tags.filter((t) => t !== tag) }
                      : r
                  ),
                }
              : t
          ),
        }));
      },

      clearHistory: () => {
        // Clean up all blobs
        const allResultIds = get().tasks.flatMap((t) => t.results.map((r) => r.id));
        StorageService.cleanupBlobs(allResultIds);
        set({ tasks: [] });
      },

      getFilteredTasks: () => {
        const { tasks, filter } = get();
        let filtered = [...tasks];

        if (filter.type) {
          filtered = filtered.filter((t) => t.type === filter.type);
        }

        if (filter.status) {
          filtered = filtered.filter((t) => t.status === filter.status);
        }

        if (filter.keyword) {
          const keyword = filter.keyword.toLowerCase();
          filtered = filtered.filter((t) =>
            t.prompt.toLowerCase().includes(keyword)
          );
        }

        if (filter.dateRange) {
          filtered = filtered.filter((t) => {
            const created = new Date(t.createdAt).getTime();
            return (
              created >= filter.dateRange!.start.getTime() &&
              created <= filter.dateRange!.end.getTime()
            );
          });
        }

        if (filter.tags && filter.tags.length > 0) {
          filtered = filtered.filter((t) =>
            t.results.some((r) =>
              filter.tags!.some((ft) => r.tags.includes(ft))
            )
          );
        }

        if (filter.favoritesOnly) {
          filtered = filtered.filter((t) =>
            t.results.some((r) => r.isFavorited)
          );
        }

        return filtered;
      },

      _enforceLimit: () => {
        set((state) => {
          if (state.tasks.length > MAX_HISTORY_RECORDS) {
            const excess = state.tasks.length - MAX_HISTORY_RECORDS;
            const removedTasks = state.tasks.slice(-excess);
            // Clean up blobs for removed tasks
            const removedResultIds = removedTasks.flatMap((t) =>
              t.results.map((r) => r.id)
            );
            StorageService.cleanupBlobs(removedResultIds);
            return { tasks: state.tasks.slice(0, MAX_HISTORY_RECORDS) };
          }
          return state;
        });
      },
    }),
    {
      name: STORAGE_KEYS.GENERATION_TASKS,
      partialize: (state) => ({
        tasks: state.tasks,
        filter: state.filter,
      }),
    }
  )
);
