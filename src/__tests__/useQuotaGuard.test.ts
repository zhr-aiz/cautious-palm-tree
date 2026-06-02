import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuotaGuard } from '../hooks/useQuotaGuard';
import { useMembershipStore } from '../stores/membershipStore';
import { MembershipTier, GenerationType } from '../types';
import { STORAGE_KEYS, TIER_QUOTAS } from '../utils/constants';

describe('useQuotaGuard', () => {
  beforeEach(() => {
    useMembershipStore.setState({
      quotaState: {
        daily: {
          image: { used: 0, total: TIER_QUOTAS[MembershipTier.FREE].dailyImage, resetAt: new Date().toISOString() },
          video: { used: 0, total: TIER_QUOTAS[MembershipTier.FREE].dailyVideo, resetAt: new Date().toISOString() },
        },
        credits: { balance: 0, expiringAt: undefined },
        tier: MembershipTier.FREE,
      },
      isUpgradeDialogOpen: false,
      upgradeDialogFeature: undefined,
    });
    localStorage.removeItem(STORAGE_KEYS.MEMBERSHIP);
  });

  describe('guard', () => {
    it('Free tier 文生图应允许', () => {
      const { result } = renderHook(() => useQuotaGuard());
      const checkResult = result.current.guard(GenerationType.TEXT_TO_IMAGE, false);
      expect(checkResult.allowed).toBe(true);
    });

    it('Free tier 图生图应拒绝（tier_restricted）', () => {
      const { result } = renderHook(() => useQuotaGuard());
      const checkResult = result.current.guard(GenerationType.IMAGE_TO_IMAGE, false);
      expect(checkResult.allowed).toBe(false);
      expect(checkResult.reason).toBe('tier_restricted');
    });

    it('被拒绝且 showDialog=true 时应打开升级对话框', () => {
      const { result } = renderHook(() => useQuotaGuard());
      result.current.guard(GenerationType.IMAGE_TO_IMAGE, true);

      const state = useMembershipStore.getState();
      expect(state.isUpgradeDialogOpen).toBe(true);
    });

    it('被拒绝且 showDialog=false 时不应打开升级对话框', () => {
      const { result } = renderHook(() => useQuotaGuard());
      result.current.guard(GenerationType.IMAGE_TO_IMAGE, false);

      const state = useMembershipStore.getState();
      expect(state.isUpgradeDialogOpen).toBe(false);
    });

    it('额度用完时应返回 daily_exhausted', () => {
      useMembershipStore.setState({
        quotaState: {
          ...useMembershipStore.getState().quotaState,
          daily: {
            ...useMembershipStore.getState().quotaState.daily,
            image: { used: 5, total: 5, resetAt: new Date().toISOString() },
          },
          credits: { balance: 0, expiringAt: undefined },
        },
      });

      const { result } = renderHook(() => useQuotaGuard());
      const checkResult = result.current.guard(GenerationType.TEXT_TO_IMAGE, false);
      expect(checkResult.allowed).toBe(false);
      expect(checkResult.reason).toBe('daily_exhausted');
    });
  });

  describe('consume', () => {
    it('消费文生图应消费图片额度', () => {
      const { result } = renderHook(() => useQuotaGuard());
      act(() => {
        result.current.consume(GenerationType.TEXT_TO_IMAGE);
      });

      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.image.used).toBe(1);
    });

    it('消费文生视频应消费视频额度', () => {
      const { result } = renderHook(() => useQuotaGuard());
      act(() => {
        result.current.consume(GenerationType.TEXT_TO_VIDEO);
      });

      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.video.used).toBe(1);
    });

    it('消费图生图应消费图片额度', () => {
      useMembershipStore.setState({
        quotaState: {
          ...useMembershipStore.getState().quotaState,
          tier: MembershipTier.PRO,
          daily: {
            image: { used: 0, total: TIER_QUOTAS[MembershipTier.PRO].dailyImage, resetAt: new Date().toISOString() },
            video: { used: 0, total: TIER_QUOTAS[MembershipTier.PRO].dailyVideo, resetAt: new Date().toISOString() },
          },
          credits: { balance: TIER_QUOTAS[MembershipTier.PRO].credits, expiringAt: undefined },
        },
      });

      const { result } = renderHook(() => useQuotaGuard());
      act(() => {
        result.current.consume(GenerationType.IMAGE_TO_IMAGE);
      });

      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.image.used).toBe(1);
    });

    it('消费图生视频应消费视频额度', () => {
      useMembershipStore.setState({
        quotaState: {
          ...useMembershipStore.getState().quotaState,
          tier: MembershipTier.PRO,
          daily: {
            image: { used: 0, total: TIER_QUOTAS[MembershipTier.PRO].dailyImage, resetAt: new Date().toISOString() },
            video: { used: 0, total: TIER_QUOTAS[MembershipTier.PRO].dailyVideo, resetAt: new Date().toISOString() },
          },
          credits: { balance: TIER_QUOTAS[MembershipTier.PRO].credits, expiringAt: undefined },
        },
      });

      const { result } = renderHook(() => useQuotaGuard());
      act(() => {
        result.current.consume(GenerationType.IMAGE_TO_VIDEO);
      });

      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.video.used).toBe(1);
    });
  });
});
