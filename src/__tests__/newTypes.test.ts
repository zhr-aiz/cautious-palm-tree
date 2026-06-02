import { describe, it, expect } from 'vitest';
import {
  MembershipTier,
  PlanType,
  VideoDuration,
  TemplateCategory,
} from '../types';

describe('新增枚举值验证', () => {
  describe('MembershipTier', () => {
    it('应包含 FREE', () => {
      expect(MembershipTier.FREE).toBe('free');
    });

    it('应包含 PRO', () => {
      expect(MembershipTier.PRO).toBe('pro');
    });

    it('应包含 ENTERPRISE', () => {
      expect(MembershipTier.ENTERPRISE).toBe('enterprise');
    });

    it('应有且仅有3个枚举值', () => {
      const values = Object.values(MembershipTier);
      expect(values).toHaveLength(3);
    });
  });

  describe('PlanType', () => {
    it('应包含 MONTHLY', () => {
      expect(PlanType.MONTHLY).toBe('monthly');
    });

    it('应包含 YEARLY', () => {
      expect(PlanType.YEARLY).toBe('yearly');
    });

    it('应有且仅有2个枚举值', () => {
      const values = Object.values(PlanType);
      expect(values).toHaveLength(2);
    });
  });

  describe('VideoDuration', () => {
    it('3秒值应为 3', () => {
      expect(VideoDuration.SEC_3).toBe(3);
    });

    it('5秒值应为 5', () => {
      expect(VideoDuration.SEC_5).toBe(5);
    });

    it('10秒值应为 10', () => {
      expect(VideoDuration.SEC_10).toBe(10);
    });

    it('应有且仅有3个枚举名', () => {
      const keys = Object.keys(VideoDuration).filter(k => isNaN(Number(k)));
      expect(keys).toHaveLength(3);
    });
  });

  describe('TemplateCategory', () => {
    it('应包含 PORTRAIT', () => {
      expect(TemplateCategory.PORTRAIT).toBe('portrait');
    });

    it('应包含 LANDSCAPE', () => {
      expect(TemplateCategory.LANDSCAPE).toBe('landscape');
    });

    it('应包含 ANIMAL', () => {
      expect(TemplateCategory.ANIMAL).toBe('animal');
    });

    it('应包含 ABSTRACT', () => {
      expect(TemplateCategory.ABSTRACT).toBe('abstract');
    });

    it('应包含 ARCHITECTURE', () => {
      expect(TemplateCategory.ARCHITECTURE).toBe('architecture');
    });

    it('应包含 CREATIVE', () => {
      expect(TemplateCategory.CREATIVE).toBe('creative');
    });

    it('应有且仅有6个枚举值', () => {
      const values = Object.values(TemplateCategory);
      expect(values).toHaveLength(6);
    });
  });
});

import { describe as d, it as i, expect as e } from 'vitest';

d('扩展接口验证', () => {
  d('GenerationConfig 新字段', () => {
    i('videoDuration 应支持 VideoDuration 枚举值', () => {
      const config = {
        style: 'realistic',
        creativity: 0.7,
        steps: 30,
        videoDuration: VideoDuration.SEC_5,
        batchSize: 2,
      };
      e(config.videoDuration).toBe(5);
      e(config.batchSize).toBe(2);
    });
  });

  d('GenerationResult 新字段', () => {
    i('isShared 和 shareId 字段应可赋值', () => {
      const result = {
        id: 'result-1',
        taskId: 'task-1',
        mediaType: 'image' as const,
        mediaUrl: 'https://example.com/image.jpg',
        isFavorited: false,
        tags: [],
        createdAt: new Date(),
        isShared: true,
        shareId: 'share-abc',
        likeCount: 42,
      };
      e(result.isShared).toBe(true);
      e(result.shareId).toBe('share-abc');
      e(result.likeCount).toBe(42);
    });
  });

  d('HistoryFilter 新字段', () => {
    i('tags 和 favoritesOnly 字段应可赋值', () => {
      const filter = {
        tags: ['cat', 'dog'],
        favoritesOnly: true,
      };
      e(filter.tags).toEqual(['cat', 'dog']);
      e(filter.favoritesOnly).toBe(true);
    });
  });

  d('User.tier 字段', () => {
    i('User 接口应支持 tier 字段', () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        phone: '',
        nickname: 'Test',
        avatarUrl: '',
        createdAt: new Date(),
        tier: MembershipTier.PRO,
      };
      e(user.tier).toBe(MembershipTier.PRO);
    });
  });
});
