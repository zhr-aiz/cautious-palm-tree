import { describe, it, expect } from 'vitest';
import { getPrice, getTierColor, getTierLabel, TIER_INFO, PRICING_INFO, FEATURE_COMPARISON } from '../utils/membershipConfig';
import { MembershipTier, PlanType } from '../types';

describe('membershipConfig', () => {
  describe('getPrice', () => {
    it('Free 月付应为 0', () => {
      expect(getPrice(MembershipTier.FREE, PlanType.MONTHLY)).toBe(0);
    });

    it('Free 年付应为 0', () => {
      expect(getPrice(MembershipTier.FREE, PlanType.YEARLY)).toBe(0);
    });

    it('Pro 月付应为 29.9', () => {
      expect(getPrice(MembershipTier.PRO, PlanType.MONTHLY)).toBe(29.9);
    });

    it('Pro 年付应为 243.6', () => {
      expect(getPrice(MembershipTier.PRO, PlanType.YEARLY)).toBe(243.6);
    });

    it('Enterprise 月付应为 99.9', () => {
      expect(getPrice(MembershipTier.ENTERPRISE, PlanType.MONTHLY)).toBe(99.9);
    });

    it('Enterprise 年付应为 815.2', () => {
      expect(getPrice(MembershipTier.ENTERPRISE, PlanType.YEARLY)).toBe(815.2);
    });
  });

  describe('getTierColor', () => {
    it('Free 应返回灰色', () => {
      expect(getTierColor(MembershipTier.FREE)).toBe('#9E9E9E');
    });

    it('Pro 应返回金色', () => {
      expect(getTierColor(MembershipTier.PRO)).toBe('#FFB800');
    });

    it('Enterprise 应返回紫色', () => {
      expect(getTierColor(MembershipTier.ENTERPRISE)).toBe('#7C3AED');
    });
  });

  describe('getTierLabel', () => {
    it('Free 应返回 免费版', () => {
      expect(getTierLabel(MembershipTier.FREE)).toBe('免费版');
    });

    it('Pro 应返回 专业版', () => {
      expect(getTierLabel(MembershipTier.PRO)).toBe('专业版');
    });

    it('Enterprise 应返回 企业版', () => {
      expect(getTierLabel(MembershipTier.ENTERPRISE)).toBe('企业版');
    });
  });

  describe('TIER_INFO', () => {
    it('应包含3个 tier 的信息', () => {
      expect(Object.keys(TIER_INFO)).toHaveLength(3);
    });

    it('每个 tier 应有 label, description, color, icon 字段', () => {
      Object.values(TIER_INFO).forEach((info) => {
        expect(info).toHaveProperty('label');
        expect(info).toHaveProperty('description');
        expect(info).toHaveProperty('color');
        expect(info).toHaveProperty('icon');
      });
    });
  });

  describe('PRICING_INFO', () => {
    it('Pro 年付月均价应为 20.3', () => {
      expect(PRICING_INFO[MembershipTier.PRO].yearlyMonthlyEquiv).toBe(20.3);
    });

    it('Enterprise 年付月均价应为 67.9', () => {
      expect(PRICING_INFO[MembershipTier.ENTERPRISE].yearlyMonthlyEquiv).toBe(67.9);
    });

    it('Pro 应有折扣信息', () => {
      expect(PRICING_INFO[MembershipTier.PRO].discount).toBeTruthy();
    });
  });

  describe('FEATURE_COMPARISON', () => {
    it('应包含功能对比行', () => {
      expect(FEATURE_COMPARISON.length).toBeGreaterThan(0);
    });

    it('图生图对 Free 应不可用', () => {
      const imageToImage = FEATURE_COMPARISON.find(f => f.feature === '图生图');
      expect(imageToImage?.free).toBe(false);
    });

    it('图生图对 Pro 应可用', () => {
      const imageToImage = FEATURE_COMPARISON.find(f => f.feature === '图生图');
      expect(imageToImage?.pro).toBe(true);
    });
  });
});
