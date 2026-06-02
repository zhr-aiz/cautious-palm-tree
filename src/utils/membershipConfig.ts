/** Membership configuration — tier comparison table, pricing, quota settings */

import { MembershipTier, PlanType } from '../types';
import { TIER_QUOTAS } from './constants';

/** Tier display information */
export const TIER_INFO: Record<MembershipTier, {
  label: string;
  description: string;
  color: string;
  icon: string;
}> = {
  [MembershipTier.FREE]: {
    label: '免费版',
    description: '体验基础 AI 创作能力',
    color: '#9E9E9E',
    icon: '🆓',
  },
  [MembershipTier.PRO]: {
    label: '专业版',
    description: '解锁全部创作功能，大幅提升额度',
    color: '#FFB800',
    icon: '⭐',
  },
  [MembershipTier.ENTERPRISE]: {
    label: '企业版',
    description: '无限额度，优先队列，专属客服',
    color: '#7C3AED',
    icon: '👑',
  },
};

/** Pricing info */
export const PRICING_INFO: Record<MembershipTier, {
  monthly: number;
  yearly: number;
  yearlyMonthlyEquiv: number;
  discount: string;
}> = {
  [MembershipTier.FREE]: {
    monthly: 0,
    yearly: 0,
    yearlyMonthlyEquiv: 0,
    discount: '',
  },
  [MembershipTier.PRO]: {
    monthly: 29.9,
    yearly: 243.6,
    yearlyMonthlyEquiv: 20.3,
    discount: '6.8折',
  },
  [MembershipTier.ENTERPRISE]: {
    monthly: 99.9,
    yearly: 815.2,
    yearlyMonthlyEquiv: 67.9,
    discount: '6.8折',
  },
};

/** Feature comparison table rows */
export const FEATURE_COMPARISON = [
  { feature: '文生图', free: true, pro: true, enterprise: true },
  { feature: '文生视频', free: true, pro: true, enterprise: true },
  { feature: '图生图', free: false, pro: true, enterprise: true },
  { feature: '图生视频', free: false, pro: true, enterprise: true },
  { feature: '每日图片额度', free: `${TIER_QUOTAS[MembershipTier.FREE].dailyImage}张`, pro: `${TIER_QUOTAS[MembershipTier.PRO].dailyImage}张`, enterprise: '无限制' },
  { feature: '每日视频额度', free: `${TIER_QUOTAS[MembershipTier.FREE].dailyVideo}个`, pro: `${TIER_QUOTAS[MembershipTier.PRO].dailyVideo}个`, enterprise: '无限制' },
  { feature: '批量生成', free: '不支持', pro: '2/4张', enterprise: '2/4/8张' },
  { feature: '负面提示词', free: false, pro: true, enterprise: true },
  { feature: '种子值控制', free: false, pro: false, enterprise: true },
  { feature: '自定义标签', free: false, pro: true, enterprise: true },
  { feature: '视频时长', free: '3秒', pro: '5秒', enterprise: '10秒' },
  { feature: '水印', free: '有', pro: '无', enterprise: '无' },
  { feature: '优先队列', free: false, pro: false, enterprise: true },
  { feature: '赠送积分', free: '0', pro: '100', enterprise: '500' },
];

/** Get the price for a given tier and plan */
export function getPrice(tier: MembershipTier, plan: PlanType): number {
  const info = PRICING_INFO[tier];
  return plan === PlanType.MONTHLY ? info.monthly : info.yearly;
}

/** Get tier color */
export function getTierColor(tier: MembershipTier): string {
  return TIER_INFO[tier].color;
}

/** Get tier label */
export function getTierLabel(tier: MembershipTier): string {
  return TIER_INFO[tier].label;
}
