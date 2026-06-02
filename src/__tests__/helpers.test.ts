import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateId,
  formatDate,
  formatRelativeTime,
  getGenerationTypeLabel,
  getImageSizeDimensions,
  getVideoResolutionDimensions,
  getStatusColor,
  getStatusLabel,
  truncateText,
  sleep,
  randomInt,
} from '../utils/helpers';
import { GenerationType, GenerationStatus, ImageSize, VideoResolution } from '../types';

describe('helpers 工具函数', () => {
  describe('generateId', () => {
    it('应返回字符串', () => {
      expect(typeof generateId()).toBe('string');
    });

    it('应返回非空字符串', () => {
      expect(generateId().length).toBeGreaterThan(0);
    });

    it('每次调用应返回不同的ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('formatDate', () => {
    it('应格式化 Date 对象', () => {
      const date = new Date(2024, 0, 15, 10, 30); // 2024-01-15 10:30
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('01');
      expect(result).toContain('15');
    });

    it('应格式化日期字符串', () => {
      const result = formatDate('2024-06-01T10:30:00');
      expect(result).toContain('2024');
    });

    it('格式化结果应包含时间', () => {
      const date = new Date(2024, 0, 15, 10, 30);
      const result = formatDate(date);
      expect(result).toContain('10');
      expect(result).toContain('30');
    });
  });

  describe('formatRelativeTime', () => {
    it('应返回相对时间字符串', () => {
      const now = new Date();
      const result = formatRelativeTime(now);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('刚刚的时间应包含"前"字', () => {
      const justNow = new Date();
      const result = formatRelativeTime(justNow);
      expect(result).toContain('前');
    });
  });

  describe('getGenerationTypeLabel', () => {
    it('TEXT_TO_IMAGE 应返回 文生图', () => {
      expect(getGenerationTypeLabel(GenerationType.TEXT_TO_IMAGE)).toBe('文生图');
    });

    it('TEXT_TO_VIDEO 应返回 文生视频', () => {
      expect(getGenerationTypeLabel(GenerationType.TEXT_TO_VIDEO)).toBe('文生视频');
    });

    it('IMAGE_TO_IMAGE 应返回 图生图', () => {
      expect(getGenerationTypeLabel(GenerationType.IMAGE_TO_IMAGE)).toBe('图生图');
    });

    it('IMAGE_TO_VIDEO 应返回 图生视频', () => {
      expect(getGenerationTypeLabel(GenerationType.IMAGE_TO_VIDEO)).toBe('图生视频');
    });
  });

  describe('getImageSizeDimensions', () => {
    it('SQUARE_1_1 应返回 512x512', () => {
      expect(getImageSizeDimensions(ImageSize.SQUARE_1_1)).toEqual({
        width: 512,
        height: 512,
      });
    });

    it('LANDSCAPE_16_9 应返回 768x432', () => {
      expect(getImageSizeDimensions(ImageSize.LANDSCAPE_16_9)).toEqual({
        width: 768,
        height: 432,
      });
    });

    it('PORTRAIT_9_16 应返回 432x768', () => {
      expect(getImageSizeDimensions(ImageSize.PORTRAIT_9_16)).toEqual({
        width: 432,
        height: 768,
      });
    });

    it('未知尺寸应返回默认 512x512', () => {
      expect(getImageSizeDimensions('UNKNOWN' as ImageSize)).toEqual({
        width: 512,
        height: 512,
      });
    });
  });

  describe('getVideoResolutionDimensions', () => {
    it('SD_480P 应返回 854x480', () => {
      expect(getVideoResolutionDimensions(VideoResolution.SD_480P)).toEqual({
        width: 854,
        height: 480,
      });
    });

    it('HD_720P 应返回 1280x720', () => {
      expect(getVideoResolutionDimensions(VideoResolution.HD_720P)).toEqual({
        width: 1280,
        height: 720,
      });
    });

    it('FHD_1080P 应返回 1920x1080', () => {
      expect(getVideoResolutionDimensions(VideoResolution.FHD_1080P)).toEqual({
        width: 1920,
        height: 1080,
      });
    });

    it('未知分辨率应返回默认 854x480', () => {
      expect(getVideoResolutionDimensions('UNKNOWN' as VideoResolution)).toEqual({
        width: 854,
        height: 480,
      });
    });
  });

  describe('getStatusColor', () => {
    it('PENDING 应返回 default', () => {
      expect(getStatusColor(GenerationStatus.PENDING)).toBe('default');
    });

    it('PROCESSING 应返回 primary', () => {
      expect(getStatusColor(GenerationStatus.PROCESSING)).toBe('primary');
    });

    it('COMPLETED 应返回 success', () => {
      expect(getStatusColor(GenerationStatus.COMPLETED)).toBe('success');
    });

    it('FAILED 应返回 error', () => {
      expect(getStatusColor(GenerationStatus.FAILED)).toBe('error');
    });
  });

  describe('getStatusLabel', () => {
    it('PENDING 应返回 等待中', () => {
      expect(getStatusLabel(GenerationStatus.PENDING)).toBe('等待中');
    });

    it('PROCESSING 应返回 生成中', () => {
      expect(getStatusLabel(GenerationStatus.PROCESSING)).toBe('生成中');
    });

    it('COMPLETED 应返回 已完成', () => {
      expect(getStatusLabel(GenerationStatus.COMPLETED)).toBe('已完成');
    });

    it('FAILED 应返回 失败', () => {
      expect(getStatusLabel(GenerationStatus.FAILED)).toBe('失败');
    });
  });

  describe('truncateText', () => {
    it('短文本不应截断', () => {
      expect(truncateText('hello', 10)).toBe('hello');
    });

    it('超长文本应截断并加省略号', () => {
      expect(truncateText('这是一个很长的文本', 5)).toBe('这是一个很...');
    });

    it('刚好等于最大长度不应截断', () => {
      expect(truncateText('hello', 5)).toBe('hello');
    });

    it('空字符串应原样返回', () => {
      expect(truncateText('', 5)).toBe('');
    });
  });

  describe('sleep', () => {
    it('应在指定时间后 resolve', async () => {
      const start = Date.now();
      await sleep(50);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(40); // 允许少量误差
    });
  });

  describe('randomInt', () => {
    it('应返回指定范围内的整数', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('min === max 时应返回该值', () => {
      expect(randomInt(5, 5)).toBe(5);
    });
  });
});
