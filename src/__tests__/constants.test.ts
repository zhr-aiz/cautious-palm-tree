import { describe, it, expect } from 'vitest';
import {
  GENERATION_TYPE_LABELS,
  IMAGE_SIZE_OPTIONS,
  VIDEO_RESOLUTION_OPTIONS,
  STYLE_OPTIONS,
  MAX_HISTORY_RECORDS,
  DEFAULT_GENERATION_CONFIG,
  MOCK_DELAY_MIN,
  MOCK_DELAY_MAX,
  MOCK_PROGRESS_STEPS,
  ROUTES,
  STORAGE_KEYS,
  IDB_MEDIA_PREFIX,
} from '../utils/constants';

describe('常量值正确性', () => {
  describe('MAX_HISTORY_RECORDS', () => {
    it('应为200', () => {
      expect(MAX_HISTORY_RECORDS).toBe(200);
    });
  });

  describe('DEFAULT_GENERATION_CONFIG', () => {
    it('默认风格应为 realistic', () => {
      expect(DEFAULT_GENERATION_CONFIG.style).toBe('realistic');
    });

    it('默认创造力应为 0.7', () => {
      expect(DEFAULT_GENERATION_CONFIG.creativity).toBe(0.7);
    });

    it('默认步数应为 30', () => {
      expect(DEFAULT_GENERATION_CONFIG.steps).toBe(30);
    });
  });

  describe('GENERATION_TYPE_LABELS', () => {
    it('应包含4种生成类型标签', () => {
      expect(Object.keys(GENERATION_TYPE_LABELS)).toHaveLength(4);
    });

    it('TEXT_TO_IMAGE 标签应为 文生图', () => {
      expect(GENERATION_TYPE_LABELS.TEXT_TO_IMAGE).toBe('文生图');
    });

    it('TEXT_TO_VIDEO 标签应为 文生视频', () => {
      expect(GENERATION_TYPE_LABELS.TEXT_TO_VIDEO).toBe('文生视频');
    });

    it('IMAGE_TO_IMAGE 标签应为 图生图', () => {
      expect(GENERATION_TYPE_LABELS.IMAGE_TO_IMAGE).toBe('图生图');
    });

    it('IMAGE_TO_VIDEO 标签应为 图生视频', () => {
      expect(GENERATION_TYPE_LABELS.IMAGE_TO_VIDEO).toBe('图生视频');
    });
  });

  describe('IMAGE_SIZE_OPTIONS', () => {
    it('应包含3种尺寸', () => {
      expect(Object.keys(IMAGE_SIZE_OPTIONS)).toHaveLength(3);
    });

    it('SQUARE_1_1 应为 512x512', () => {
      expect(IMAGE_SIZE_OPTIONS.SQUARE_1_1).toEqual({
        label: '1:1 正方形',
        width: 512,
        height: 512,
      });
    });

    it('LANDSCAPE_16_9 应为 768x432', () => {
      expect(IMAGE_SIZE_OPTIONS.LANDSCAPE_16_9).toEqual({
        label: '16:9 横屏',
        width: 768,
        height: 432,
      });
    });

    it('PORTRAIT_9_16 应为 432x768', () => {
      expect(IMAGE_SIZE_OPTIONS.PORTRAIT_9_16).toEqual({
        label: '9:16 竖屏',
        width: 432,
        height: 768,
      });
    });
  });

  describe('VIDEO_RESOLUTION_OPTIONS', () => {
    it('应包含3种分辨率', () => {
      expect(Object.keys(VIDEO_RESOLUTION_OPTIONS)).toHaveLength(3);
    });

    it('SD_480P 应为 854x480', () => {
      expect(VIDEO_RESOLUTION_OPTIONS.SD_480P).toEqual({
        label: '480P',
        width: 854,
        height: 480,
      });
    });

    it('HD_720P 应为 1280x720', () => {
      expect(VIDEO_RESOLUTION_OPTIONS.HD_720P).toEqual({
        label: '720P',
        width: 1280,
        height: 720,
      });
    });

    it('FHD_1080P 应为 1920x1080', () => {
      expect(VIDEO_RESOLUTION_OPTIONS.FHD_1080P).toEqual({
        label: '1080P',
        width: 1920,
        height: 1080,
      });
    });
  });

  describe('STYLE_OPTIONS', () => {
    it('应包含8种风格', () => {
      expect(STYLE_OPTIONS).toHaveLength(8);
    });

    it('每个风格选项应有 id, label, preview 字段', () => {
      STYLE_OPTIONS.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('preview');
      });
    });

    it('第一个风格应为 写实', () => {
      expect(STYLE_OPTIONS[0].id).toBe('realistic');
      expect(STYLE_OPTIONS[0].label).toBe('写实');
    });
  });

  describe('MOCK_DELAY_MIN / MOCK_DELAY_MAX', () => {
    it('MOCK_DELAY_MIN 应为 2000', () => {
      expect(MOCK_DELAY_MIN).toBe(2000);
    });

    it('MOCK_DELAY_MAX 应为 5000', () => {
      expect(MOCK_DELAY_MAX).toBe(5000);
    });

    it('MIN 应小于 MAX', () => {
      expect(MOCK_DELAY_MIN).toBeLessThan(MOCK_DELAY_MAX);
    });
  });

  describe('MOCK_PROGRESS_STEPS', () => {
    it('应包含 [0, 20, 50, 80, 100]', () => {
      expect(MOCK_PROGRESS_STEPS).toEqual([0, 20, 50, 80, 100]);
    });
  });

  describe('ROUTES', () => {
    it('应定义 AUTH 路由', () => {
      expect(ROUTES.AUTH).toBe('/auth');
    });

    it('应定义 HOME 路由', () => {
      expect(ROUTES.HOME).toBe('/');
    });

    it('应定义 RESULT 路由（含参数）', () => {
      expect(ROUTES.RESULT).toBe('/result/:taskId');
    });

    it('应定义 HISTORY 路由', () => {
      expect(ROUTES.HISTORY).toBe('/history');
    });

    it('应定义 SETTINGS 路由', () => {
      expect(ROUTES.SETTINGS).toBe('/settings');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('应定义 AUTH_USER key', () => {
      expect(STORAGE_KEYS.AUTH_USER).toBe('ai_media_auth_user');
    });

    it('应定义 AUTH_TOKEN key', () => {
      expect(STORAGE_KEYS.AUTH_TOKEN).toBe('ai_media_auth_token');
    });

    it('应定义 GENERATION_TASKS key', () => {
      expect(STORAGE_KEYS.GENERATION_TASKS).toBe('ai_media_generation_tasks');
    });
  });

  describe('IDB_MEDIA_PREFIX', () => {
    it('应为 media_blob_', () => {
      expect(IDB_MEDIA_PREFIX).toBe('media_blob_');
    });
  });
});
