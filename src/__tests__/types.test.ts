import { describe, it, expect } from 'vitest';
import {
  GenerationType,
  GenerationStatus,
  ImageSize,
  VideoResolution,
} from '../types';

describe('枚举值正确性', () => {
  describe('GenerationType', () => {
    it('应包含 TEXT_TO_IMAGE', () => {
      expect(GenerationType.TEXT_TO_IMAGE).toBe('TEXT_TO_IMAGE');
    });

    it('应包含 TEXT_TO_VIDEO', () => {
      expect(GenerationType.TEXT_TO_VIDEO).toBe('TEXT_TO_VIDEO');
    });

    it('应包含 IMAGE_TO_IMAGE', () => {
      expect(GenerationType.IMAGE_TO_IMAGE).toBe('IMAGE_TO_IMAGE');
    });

    it('应包含 IMAGE_TO_VIDEO', () => {
      expect(GenerationType.IMAGE_TO_VIDEO).toBe('IMAGE_TO_VIDEO');
    });

    it('应有且仅有4个枚举值', () => {
      const values = Object.values(GenerationType);
      expect(values).toHaveLength(4);
    });
  });

  describe('GenerationStatus', () => {
    it('应包含 PENDING', () => {
      expect(GenerationStatus.PENDING).toBe('PENDING');
    });

    it('应包含 PROCESSING', () => {
      expect(GenerationStatus.PROCESSING).toBe('PROCESSING');
    });

    it('应包含 COMPLETED', () => {
      expect(GenerationStatus.COMPLETED).toBe('COMPLETED');
    });

    it('应包含 FAILED', () => {
      expect(GenerationStatus.FAILED).toBe('FAILED');
    });

    it('应有且仅有4个枚举值', () => {
      const values = Object.values(GenerationStatus);
      expect(values).toHaveLength(4);
    });
  });

  describe('ImageSize', () => {
    it('应包含 SQUARE_1_1', () => {
      expect(ImageSize.SQUARE_1_1).toBe('SQUARE_1_1');
    });

    it('应包含 LANDSCAPE_16_9', () => {
      expect(ImageSize.LANDSCAPE_16_9).toBe('LANDSCAPE_16_9');
    });

    it('应包含 PORTRAIT_9_16', () => {
      expect(ImageSize.PORTRAIT_9_16).toBe('PORTRAIT_9_16');
    });
  });

  describe('VideoResolution', () => {
    it('应包含 SD_480P', () => {
      expect(VideoResolution.SD_480P).toBe('SD_480P');
    });

    it('应包含 HD_720P', () => {
      expect(VideoResolution.HD_720P).toBe('HD_720P');
    });

    it('应包含 FHD_1080P', () => {
      expect(VideoResolution.FHD_1080P).toBe('FHD_1080P');
    });
  });
});
