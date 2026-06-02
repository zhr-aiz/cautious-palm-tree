import { useCallback } from 'react';
import { useGenerationStore } from '../stores/generationStore';
import { useMembershipStore } from '../stores/membershipStore';
import { GenerationType, GenerationConfig, ImageSize, VideoResolution } from '../types';
import { DEFAULT_GENERATION_CONFIG } from '../utils/constants';

/** Hook for managing generation workflow */
export function useGeneration() {
  const currentTask = useGenerationStore((state) => state.currentTask);
  const isGenerating = useGenerationStore((state) => state.isGenerating);
  const error = useGenerationStore((state) => state.error);
  const startGeneration = useGenerationStore((state) => state.startGeneration);
  const cancelGeneration = useGenerationStore((state) => state.cancelGeneration);
  const clearCurrentTask = useGenerationStore((state) => state.clearCurrentTask);
  const clearError = useGenerationStore((state) => state.clearError);

  /** Start a new generation */
  const generate = useCallback(
    async (type: GenerationType, prompt: string, config?: Partial<GenerationConfig>) => {
      const fullConfig: GenerationConfig = {
        ...DEFAULT_GENERATION_CONFIG,
        ...config,
      };
      return await startGeneration(type, prompt, fullConfig);
    },
    [startGeneration]
  );

  /** Start text-to-image generation */
  const generateTextToImage = useCallback(
    async (prompt: string, imageSize?: ImageSize, style?: string) => {
      return await generate(GenerationType.TEXT_TO_IMAGE, prompt, {
        imageSize: imageSize || ImageSize.SQUARE_1_1,
        style: style || DEFAULT_GENERATION_CONFIG.style,
      });
    },
    [generate]
  );

  /** Start text-to-video generation */
  const generateTextToVideo = useCallback(
    async (prompt: string, resolution?: VideoResolution, style?: string) => {
      return await generate(GenerationType.TEXT_TO_VIDEO, prompt, {
        videoResolution: resolution || VideoResolution.HD_720P,
        style: style || DEFAULT_GENERATION_CONFIG.style,
      });
    },
    [generate]
  );

  /** Start image-to-image generation */
  const generateImageToImage = useCallback(
    async (prompt: string, referenceImageUrl: string, style?: string) => {
      return await generate(GenerationType.IMAGE_TO_IMAGE, prompt, {
        referenceImageUrl,
        style: style || DEFAULT_GENERATION_CONFIG.style,
      });
    },
    [generate]
  );

  /** Start image-to-video generation */
  const generateImageToVideo = useCallback(
    async (prompt: string, referenceImageUrl: string, resolution?: VideoResolution, style?: string) => {
      return await generate(GenerationType.IMAGE_TO_VIDEO, prompt, {
        referenceImageUrl,
        videoResolution: resolution || VideoResolution.HD_720P,
        style: style || DEFAULT_GENERATION_CONFIG.style,
      });
    },
    [generate]
  );

  /** Cancel current generation */
  const cancel = useCallback(
    (taskId: string) => {
      cancelGeneration(taskId);
    },
    [cancelGeneration]
  );

  /** Generate with quota check — checks quota before generating and consumes after */
  const generateWithQuotaCheck = useCallback(
    async (type: GenerationType, prompt: string, config?: Partial<GenerationConfig>) => {
      // Check quota
      const quotaResult = useMembershipStore.getState().checkQuota(type);
      if (!quotaResult.allowed) {
        throw new Error(quotaResult.suggestion || '额度不足，请升级会员');
      }

      // Generate
      const taskId = await generate(type, prompt, config);

      // Consume quota
      const isImage = type === GenerationType.TEXT_TO_IMAGE || type === GenerationType.IMAGE_TO_IMAGE;
      useMembershipStore.getState().consumeQuota(isImage ? 'image' : 'video');

      return taskId;
    },
    [generate]
  );

  return {
    currentTask,
    isGenerating,
    error,
    generate,
    generateTextToImage,
    generateTextToVideo,
    generateImageToImage,
    generateImageToVideo,
    generateWithQuotaCheck,
    cancel,
    clearCurrentTask,
    clearError,
  };
}
