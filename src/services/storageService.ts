import { get, set, del } from 'idb-keyval';
import { GenerationResult } from '../types';
import { IDB_MEDIA_PREFIX } from '../utils/constants';

/**
 * Storage service for managing media blobs in IndexedDB and metadata in localStorage.
 */
const StorageService = {
  /** Save a media blob to IndexedDB */
  async saveMediaBlob(resultId: string, blob: Blob): Promise<void> {
    const key = `${IDB_MEDIA_PREFIX}${resultId}`;
    await set(key, blob);
  },

  /** Get a media blob from IndexedDB */
  async getMediaBlob(resultId: string): Promise<Blob | undefined> {
    const key = `${IDB_MEDIA_PREFIX}${resultId}`;
    return await get<Blob>(key);
  },

  /** Delete a media blob from IndexedDB */
  async deleteMediaBlob(resultId: string): Promise<void> {
    const key = `${IDB_MEDIA_PREFIX}${resultId}`;
    await del(key);
  },

  /** Save generation result metadata (without blob) to make it serializable */
  serializeResult(result: GenerationResult): Omit<GenerationResult, 'mediaBlob'> & { hasBlob: boolean } {
    return {
      id: result.id,
      taskId: result.taskId,
      mediaType: result.mediaType,
      mediaUrl: result.mediaUrl,
      isFavorited: result.isFavorited,
      tags: result.tags,
      createdAt: result.createdAt,
      hasBlob: !!result.mediaBlob,
    };
  },

  /** Save a result including its blob to IndexedDB */
  async saveResultWithBlob(result: GenerationResult): Promise<void> {
    if (result.mediaBlob) {
      await StorageService.saveMediaBlob(result.id, result.mediaBlob);
    }
  },

  /** Clean up old media blobs for given result IDs */
  async cleanupBlobs(resultIds: string[]): Promise<void> {
    for (const id of resultIds) {
      await StorageService.deleteMediaBlob(id);
    }
  },
};

export default StorageService;
