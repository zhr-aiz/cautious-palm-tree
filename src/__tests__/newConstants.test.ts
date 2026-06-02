import { describe, it, expect } from 'vitest';
import {
  TIER_QUOTAS,
  PROMPT_TEMPLATES,
  CREDIT_PACKAGES,
  BATCH_SIZE_OPTIONS,
  MAX_FAVORITES,
  TEMPLATE_CATEGORY_LABELS,
  STORAGE_KEYS,
  ROUTES,
} from '../utils/constants';
import { MembershipTier, TemplateCategory } from '../types';

describe('新增常量验证', () => {
  describe('TIER_QUOTAS', () => {
    it('应包含3个 tier 配置', () => {
      expect(Object.keys(TIER_QUOTAS)).toHaveLength(3);
    });

    it('FREE 图片日额度应为 5', () => {
      expect(TIER_QUOTAS[MembershipTier.FREE].dailyImage).toBe(5);
    });

    it('FREE 视频日额度应为 2', () => {
      expect(TIER_QUOTAS[MembershipTier.FREE].dailyVideo).toBe(2);
    });

    it('FREE 积分应为 0', () => {
      expect(TIER_QUOTAS[MembershipTier.FREE].credits).toBe(0);
    });

    it('FREE features 应只有 text_to_image 和 text_to_video', () => {
      expect(TIER_QUOTAS[MembershipTier.FREE].features).toContain('text_to_image');
      expect(TIER_QUOTAS[MembershipTier.FREE].features).toContain('text_to_video');
      expect(TIER_QUOTAS[MembershipTier.FREE].features).not.toContain('image_to_image');
    });

    it('FREE batchSizeOptions 应为 [1]', () => {
      expect(TIER_QUOTAS[MembershipTier.FREE].batchSizeOptions).toEqual([1]);
    });

    it('PRO 图片日额度应为 50', () => {
      expect(TIER_QUOTAS[MembershipTier.PRO].dailyImage).toBe(50);
    });

    it('PRO 视频日额度应为 20', () => {
      expect(TIER_QUOTAS[MembershipTier.PRO].dailyVideo).toBe(20);
    });

    it('PRO 积分应为 100', () => {
      expect(TIER_QUOTAS[MembershipTier.PRO].credits).toBe(100);
    });

    it('PRO features 应包含 image_to_image', () => {
      expect(TIER_QUOTAS[MembershipTier.PRO].features).toContain('image_to_image');
      expect(TIER_QUOTAS[MembershipTier.PRO].features).toContain('image_to_video');
    });

    it('PRO batchSizeOptions 应为 [1, 2, 4]', () => {
      expect(TIER_QUOTAS[MembershipTier.PRO].batchSizeOptions).toEqual([1, 2, 4]);
    });

    it('ENTERPRISE 积分应为 500', () => {
      expect(TIER_QUOTAS[MembershipTier.ENTERPRISE].credits).toBe(500);
    });

    it('ENTERPRISE batchSizeOptions 应为 [1, 2, 4, 8]', () => {
      expect(TIER_QUOTAS[MembershipTier.ENTERPRISE].batchSizeOptions).toEqual([1, 2, 4, 8]);
    });

    it('FREE 最大视频时长应为 3 秒', () => {
      expect(TIER_QUOTAS[MembershipTier.FREE].maxVideoDuration).toBe(3);
    });

    it('PRO 最大视频时长应为 5 秒', () => {
      expect(TIER_QUOTAS[MembershipTier.PRO].maxVideoDuration).toBe(5);
    });

    it('ENTERPRISE 最大视频时长应为 10 秒', () => {
      expect(TIER_QUOTAS[MembershipTier.ENTERPRISE].maxVideoDuration).toBe(10);
    });

    it('FREE 不支持自定义标签', () => {
      expect(TIER_QUOTAS[MembershipTier.FREE].customTags).toBe(false);
    });

    it('PRO 支持自定义标签', () => {
      expect(TIER_QUOTAS[MembershipTier.PRO].customTags).toBe(true);
    });

    it('FREE 不支持负面提示词', () => {
      expect(TIER_QUOTAS[MembershipTier.FREE].negativePrompt).toBe(false);
    });

    it('PRO 支持负面提示词', () => {
      expect(TIER_QUOTAS[MembershipTier.PRO].negativePrompt).toBe(true);
    });

    it('只有 ENTERPRISE 支持 seed', () => {
      expect(TIER_QUOTAS[MembershipTier.FREE].seed).toBe(false);
      expect(TIER_QUOTAS[MembershipTier.PRO].seed).toBe(false);
      expect(TIER_QUOTAS[MembershipTier.ENTERPRISE].seed).toBe(true);
    });
  });

  describe('PROMPT_TEMPLATES', () => {
    it('应有 24 个模板', () => {
      expect(PROMPT_TEMPLATES).toHaveLength(24);
    });

    it('每个模板应有必需字段', () => {
      PROMPT_TEMPLATES.forEach((template) => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('category');
        expect(template).toHaveProperty('title');
        expect(template).toHaveProperty('prompt');
        expect(template).toHaveProperty('preview');
        expect(template).toHaveProperty('isCustom');
        expect(template).toHaveProperty('tierRequired');
      });
    });

    it('所有模板 isCustom 应为 false（预置模板）', () => {
      PROMPT_TEMPLATES.forEach((template) => {
        expect(template.isCustom).toBe(false);
      });
    });

    it('应包含6个分类各4个模板', () => {
      const categories = Object.values(TemplateCategory);
      categories.forEach((cat) => {
        const catTemplates = PROMPT_TEMPLATES.filter(t => t.category === cat);
        expect(catTemplates).toHaveLength(4);
      });
    });
  });

  describe('CREDIT_PACKAGES', () => {
    it('应有4个积分套餐', () => {
      expect(CREDIT_PACKAGES).toHaveLength(4);
    });

    it('每个套餐应有 id, name, credits, price, bonus 字段', () => {
      CREDIT_PACKAGES.forEach((pkg) => {
        expect(pkg).toHaveProperty('id');
        expect(pkg).toHaveProperty('name');
        expect(pkg).toHaveProperty('credits');
        expect(pkg).toHaveProperty('price');
        expect(pkg).toHaveProperty('bonus');
      });
    });

    it('应有 credits-100 到 credits-1000 的套餐', () => {
      const ids = CREDIT_PACKAGES.map(p => p.id);
      expect(ids).toContain('credits-100');
      expect(ids).toContain('credits-300');
      expect(ids).toContain('credits-500');
      expect(ids).toContain('credits-1000');
    });

    it('credits-500 应为 popular', () => {
      const pkg500 = CREDIT_PACKAGES.find(p => p.id === 'credits-500');
      expect(pkg500?.popular).toBe(true);
    });
  });

  describe('BATCH_SIZE_OPTIONS', () => {
    it('FREE 应为 [1]', () => {
      expect(BATCH_SIZE_OPTIONS[MembershipTier.FREE]).toEqual([1]);
    });

    it('PRO 应为 [1, 2, 4]', () => {
      expect(BATCH_SIZE_OPTIONS[MembershipTier.PRO]).toEqual([1, 2, 4]);
    });

    it('ENTERPRISE 应为 [1, 2, 4, 8]', () => {
      expect(BATCH_SIZE_OPTIONS[MembershipTier.ENTERPRISE]).toEqual([1, 2, 4, 8]);
    });
  });

  describe('MAX_FAVORITES', () => {
    it('应为 50', () => {
      expect(MAX_FAVORITES).toBe(50);
    });
  });

  describe('TEMPLATE_CATEGORY_LABELS', () => {
    it('应包含6个分类标签', () => {
      expect(Object.keys(TEMPLATE_CATEGORY_LABELS)).toHaveLength(6);
    });

    it('PORTRAIT 标签应为 人像', () => {
      expect(TEMPLATE_CATEGORY_LABELS[TemplateCategory.PORTRAIT]).toBe('人像');
    });

    it('LANDSCAPE 标签应为 风景', () => {
      expect(TEMPLATE_CATEGORY_LABELS[TemplateCategory.LANDSCAPE]).toBe('风景');
    });
  });

  describe('新增 STORAGE_KEYS', () => {
    it('应定义 MEMBERSHIP key', () => {
      expect(STORAGE_KEYS.MEMBERSHIP).toBe('ai_media_membership');
    });
  });

  describe('新增 ROUTES', () => {
    it('应定义 MEMBERSHIP 路由', () => {
      expect(ROUTES.MEMBERSHIP).toBe('/membership');
    });

    it('应定义 CREDITS 路由', () => {
      expect(ROUTES.CREDITS).toBe('/membership/credits');
    });

    it('应定义 CHECKOUT 路由', () => {
      expect(ROUTES.CHECKOUT).toBe('/membership/checkout');
    });

    it('应定义 GALLERY 路由', () => {
      expect(ROUTES.GALLERY).toBe('/gallery');
    });
  });
});
