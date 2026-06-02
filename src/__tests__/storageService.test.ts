import { describe, it, expect, vi, beforeEach } from 'vitest';
import StorageService from '../services/storageService';
import { GenerationResult } from '../types';

// Mock idb-keyval
const mockStore = new Map<string, any>();

vi.mock('idb-keyval', () => ({
  get: vi.fn((key: string) => Promise.resolve(mockStore.get(key))),
  set: vi.fn((key: string, value: any) => {
    mockStore.set(key, value);
    return Promise.resolve();
  }),
  del: vi.fn((key: string) => {
    mockStore.delete(key);
    return Promise.resolve();
  }),
}));

describe('storageService', () => {
  beforeEach(() => {
    mockStore.clear();
  });

  describe('saveMediaBlob / getMediaBlob', () => {
    it('应能保存和读取 Blob', async () => {
      const blob = new Blob(['test data'], { type: 'image/png' });
      await StorageService.saveMediaBlob('result-1', blob);

      const retrieved = await StorageService.getMediaBlob('result-1');
      expect(retrieved).toBeDefined();
    });

    it('读取不存在的 key 应返回 undefined', async () => {
      const result = await StorageService.getMediaBlob('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('deleteMediaBlob', () => {
    it('应能删除已保存的 Blob', async () => {
      const blob = new Blob(['test data'], { type: 'image/png' });
      await StorageService.saveMediaBlob('result-1', blob);

      await StorageService.deleteMediaBlob('result-1');

      const result = await StorageService.getMediaBlob('result-1');
      expect(result).toBeUndefined();
    });
  });

  describe('serializeResult', () => {
    it('应序列化结果并标记 hasBlob', () => {
      const result: GenerationResult = {
        id: 'result-1',
        taskId: 'task-1',
        mediaType: 'image',
        mediaUrl: 'https://example.com/image.jpg',
        mediaBlob: new Blob(['test'], { type: 'image/png' }),
        isFavorited: false,
        tags: ['cat'],
        createdAt: new Date(),
      };

      const serialized = StorageService.serializeResult(result);

      expect(serialized.id).toBe('result-1');
      expect(serialized.hasBlob).toBe(true);
      expect(serialized).not.toHaveProperty('mediaBlob');
    });

    it('无 Blob 时 hasBlob 应为 false', () => {
      const result: GenerationResult = {
        id: 'result-2',
        taskId: 'task-2',
        mediaType: 'image',
        mediaUrl: 'https://example.com/image.jpg',
        isFavorited: true,
        tags: [],
        createdAt: new Date(),
      };

      const serialized = StorageService.serializeResult(result);
      expect(serialized.hasBlob).toBe(false);
    });
  });

  describe('saveResultWithBlob', () => {
    it('有 Blob 时应保存', async () => {
      const blob = new Blob(['test'], { type: 'video/webm' });
      const result: GenerationResult = {
        id: 'result-3',
        taskId: 'task-3',
        mediaType: 'video',
        mediaUrl: 'blob:mock-url',
        mediaBlob: blob,
        isFavorited: false,
        tags: [],
        createdAt: new Date(),
      };

      await StorageService.saveResultWithBlob(result);
      const retrieved = await StorageService.getMediaBlob('result-3');
      expect(retrieved).toBeDefined();
    });

    it('无 Blob 时不应报错', async () => {
      const result: GenerationResult = {
        id: 'result-4',
        taskId: 'task-4',
        mediaType: 'image',
        mediaUrl: 'https://example.com/image.jpg',
        isFavorited: false,
        tags: [],
        createdAt: new Date(),
      };

      await expect(StorageService.saveResultWithBlob(result)).resolves.not.toThrow();
    });
  });

  describe('cleanupBlobs', () => {
    it('应能批量删除 Blob', async () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      await StorageService.saveMediaBlob('r-1', blob);
      await StorageService.saveMediaBlob('r-2', blob);

      await StorageService.cleanupBlobs(['r-1', 'r-2']);

      const r1 = await StorageService.getMediaBlob('r-1');
      const r2 = await StorageService.getMediaBlob('r-2');
      expect(r1).toBeUndefined();
      expect(r2).toBeUndefined();
    });
  });
});
