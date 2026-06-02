import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMembershipStore } from '../stores/membershipStore';
import { MembershipTier, PlanType, GenerationType } from '../types';
import { STORAGE_KEYS, TIER_QUOTAS } from '../utils/constants';

describe('membershipStore', () => {
  beforeEach(() => {
    // 重置 store 状态
    useMembershipStore.setState({
      quotaState: {
        daily: {
          image: { used: 0, total: TIER_QUOTAS[MembershipTier.FREE].dailyImage, resetAt: new Date().toISOString() },
          video: { used: 0, total: TIER_QUOTAS[MembershipTier.FREE].dailyVideo, resetAt: new Date().toISOString() },
        },
        credits: { balance: TIER_QUOTAS[MembershipTier.FREE].credits, expiringAt: undefined },
        tier: MembershipTier.FREE,
      },
      isUpgradeDialogOpen: false,
      upgradeDialogFeature: undefined,
      checkoutPlan: undefined,
      isPaymentProcessing: false,
      customTemplates: [],
    });
    localStorage.removeItem(STORAGE_KEYS.MEMBERSHIP);
  });

  describe('初始状态', () => {
    it('初始 tier 应为 FREE', () => {
      const state = useMembershipStore.getState();
      expect(state.quotaState.tier).toBe(MembershipTier.FREE);
    });

    it('Free tier 图片日额度应为 5', () => {
      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.image.total).toBe(5);
    });

    it('Free tier 视频日额度应为 2', () => {
      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.video.total).toBe(2);
    });

    it('Free tier 初始积分应为 0', () => {
      const state = useMembershipStore.getState();
      expect(state.quotaState.credits.balance).toBe(0);
    });

    it('初始已用额度应为 0', () => {
      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.image.used).toBe(0);
      expect(state.quotaState.daily.video.used).toBe(0);
    });

    it('升级对话框初始应关闭', () => {
      const state = useMembershipStore.getState();
      expect(state.isUpgradeDialogOpen).toBe(false);
    });

    it('自定义模板初始为空', () => {
      const state = useMembershipStore.getState();
      expect(state.customTemplates).toEqual([]);
    });
  });

  describe('checkQuota', () => {
    it('Free tier 文生图应在额度内允许', () => {
      const result = useMembershipStore.getState().checkQuota(GenerationType.TEXT_TO_IMAGE);
      expect(result.allowed).toBe(true);
    });

    it('Free tier 文生视频应在额度内允许', () => {
      const result = useMembershipStore.getState().checkQuota(GenerationType.TEXT_TO_VIDEO);
      expect(result.allowed).toBe(true);
    });

    it('Free tier 图生图应返回 tier_restricted', () => {
      const result = useMembershipStore.getState().checkQuota(GenerationType.IMAGE_TO_IMAGE);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('tier_restricted');
    });

    it('Free tier 图生视频应返回 tier_restricted', () => {
      const result = useMembershipStore.getState().checkQuota(GenerationType.IMAGE_TO_VIDEO);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('tier_restricted');
    });

    it('Pro tier 图生图应允许', () => {
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

      const result = useMembershipStore.getState().checkQuota(GenerationType.IMAGE_TO_IMAGE);
      expect(result.allowed).toBe(true);
    });

    it('日额度用完后应返回 daily_exhausted', () => {
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

      const result = useMembershipStore.getState().checkQuota(GenerationType.TEXT_TO_IMAGE);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('daily_exhausted');
    });

    it('日额度用完但有积分时仍允许', () => {
      useMembershipStore.setState({
        quotaState: {
          ...useMembershipStore.getState().quotaState,
          daily: {
            ...useMembershipStore.getState().quotaState.daily,
            image: { used: 5, total: 5, resetAt: new Date().toISOString() },
          },
          credits: { balance: 10, expiringAt: undefined },
        },
      });

      const result = useMembershipStore.getState().checkQuota(GenerationType.TEXT_TO_IMAGE);
      expect(result.allowed).toBe(true);
    });
  });

  describe('consumeQuota', () => {
    it('消费图片额度应增加 used 计数', () => {
      useMembershipStore.getState().consumeQuota('image');
      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.image.used).toBe(1);
    });

    it('消费视频额度应增加 used 计数', () => {
      useMembershipStore.getState().consumeQuota('video');
      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.video.used).toBe(1);
    });

    it('多次消费应累计计数', () => {
      useMembershipStore.getState().consumeQuota('image');
      useMembershipStore.getState().consumeQuota('image');
      useMembershipStore.getState().consumeQuota('image');
      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.image.used).toBe(3);
    });

    it('日额度用完后消费应扣减积分', () => {
      useMembershipStore.setState({
        quotaState: {
          ...useMembershipStore.getState().quotaState,
          daily: {
            ...useMembershipStore.getState().quotaState.daily,
            image: { used: 5, total: 5, resetAt: new Date().toISOString() },
          },
          credits: { balance: 10, expiringAt: undefined },
        },
      });

      useMembershipStore.getState().consumeQuota('image');
      const state = useMembershipStore.getState();
      expect(state.quotaState.credits.balance).toBe(9);
      // used should NOT increment beyond total when consuming credits
      expect(state.quotaState.daily.image.used).toBe(5);
    });

    it('日额度未用完消费应不扣积分', () => {
      useMembershipStore.setState({
        quotaState: {
          ...useMembershipStore.getState().quotaState,
          credits: { balance: 10, expiringAt: undefined },
        },
      });

      useMembershipStore.getState().consumeQuota('image');
      const state = useMembershipStore.getState();
      expect(state.quotaState.credits.balance).toBe(10);
    });
  });

  describe('subscribe', () => {
    it('订阅 Pro 月付应更新 tier 和额度', async () => {
      vi.useFakeTimers();
      const promise = useMembershipStore.getState().subscribe(MembershipTier.PRO, PlanType.MONTHLY);
      await vi.advanceTimersByTimeAsync(1500);
      await promise;

      const state = useMembershipStore.getState();
      expect(state.quotaState.tier).toBe(MembershipTier.PRO);
      expect(state.quotaState.daily.image.total).toBe(TIER_QUOTAS[MembershipTier.PRO].dailyImage);
      expect(state.quotaState.daily.video.total).toBe(TIER_QUOTAS[MembershipTier.PRO].dailyVideo);
      expect(state.quotaState.credits.balance).toBe(TIER_QUOTAS[MembershipTier.PRO].credits);
      expect(state.isPaymentProcessing).toBe(false);
      vi.useRealTimers();
    });

    it('订阅年付应有 subscription 信息', async () => {
      vi.useFakeTimers();
      const promise = useMembershipStore.getState().subscribe(MembershipTier.PRO, PlanType.YEARLY);
      await vi.advanceTimersByTimeAsync(1500);
      await promise;

      const state = useMembershipStore.getState();
      expect(state.quotaState.subscription).toBeDefined();
      expect(state.quotaState.subscription?.plan).toBe(PlanType.YEARLY);
      expect(state.quotaState.subscription?.autoRenew).toBe(true);
      vi.useRealTimers();
    });

    it('订阅过程中 isPaymentProcessing 应为 true', async () => {
      vi.useFakeTimers();
      const promise = useMembershipStore.getState().subscribe(MembershipTier.PRO, PlanType.MONTHLY);

      // Before timer fires
      expect(useMembershipStore.getState().isPaymentProcessing).toBe(true);

      await vi.advanceTimersByTimeAsync(1500);
      await promise;

      expect(useMembershipStore.getState().isPaymentProcessing).toBe(false);
      vi.useRealTimers();
    });

    it('订阅后日额度应重置为 0', async () => {
      // 先消费一些额度
      useMembershipStore.getState().consumeQuota('image');
      useMembershipStore.getState().consumeQuota('image');

      vi.useFakeTimers();
      const promise = useMembershipStore.getState().subscribe(MembershipTier.PRO, PlanType.MONTHLY);
      await vi.advanceTimersByTimeAsync(1500);
      await promise;

      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.image.used).toBe(0);
      expect(state.quotaState.daily.video.used).toBe(0);
      vi.useRealTimers();
    });
  });

  describe('purchaseCredits', () => {
    it('购买 credits-100 应增加 100 积分', async () => {
      vi.useFakeTimers();
      const promise = useMembershipStore.getState().purchaseCredits('credits-100');
      await vi.advanceTimersByTimeAsync(1500);
      await promise;

      const state = useMembershipStore.getState();
      expect(state.quotaState.credits.balance).toBe(100);
      vi.useRealTimers();
    });

    it('购买 credits-300 应增加 315 积分（含15赠送）', async () => {
      vi.useFakeTimers();
      const promise = useMembershipStore.getState().purchaseCredits('credits-300');
      await vi.advanceTimersByTimeAsync(1500);
      await promise;

      const state = useMembershipStore.getState();
      expect(state.quotaState.credits.balance).toBe(315);
      vi.useRealTimers();
    });

    it('购买 credits-500 应增加 550 积分（含50赠送）', async () => {
      vi.useFakeTimers();
      const promise = useMembershipStore.getState().purchaseCredits('credits-500');
      await vi.advanceTimersByTimeAsync(1500);
      await promise;

      const state = useMembershipStore.getState();
      expect(state.quotaState.credits.balance).toBe(550);
      vi.useRealTimers();
    });

    it('购买 credits-1000 应增加 1150 积分（含150赠送）', async () => {
      vi.useFakeTimers();
      const promise = useMembershipStore.getState().purchaseCredits('credits-1000');
      await vi.advanceTimersByTimeAsync(1500);
      await promise;

      const state = useMembershipStore.getState();
      expect(state.quotaState.credits.balance).toBe(1150);
      vi.useRealTimers();
    });

    it('无效套餐ID应抛出错误', async () => {
      vi.useFakeTimers();

      // Prevent unhandled rejection by attaching catch handler immediately
      const promise = useMembershipStore.getState().purchaseCredits('invalid-id');
      const resultPromise = promise.then(
        () => { expect.unreachable('Should have thrown'); },
        (e: any) => {
          expect(e.message).toBe('购买失败，请重试');
        }
      );

      await vi.advanceTimersByTimeAsync(2000);
      await resultPromise;

      expect(useMembershipStore.getState().isPaymentProcessing).toBe(false);
      vi.useRealTimers();
    });

    it('多次购买应累加积分', async () => {
      vi.useFakeTimers();
      const p1 = useMembershipStore.getState().purchaseCredits('credits-100');
      await vi.advanceTimersByTimeAsync(1500);
      await p1;

      const p2 = useMembershipStore.getState().purchaseCredits('credits-100');
      await vi.advanceTimersByTimeAsync(1500);
      await p2;

      expect(useMembershipStore.getState().quotaState.credits.balance).toBe(200);
      vi.useRealTimers();
    });
  });

  describe('resetDailyQuota', () => {
    it('重置后已用额度应为 0', () => {
      useMembershipStore.getState().consumeQuota('image');
      useMembershipStore.getState().consumeQuota('video');

      useMembershipStore.getState().resetDailyQuota();

      const state = useMembershipStore.getState();
      expect(state.quotaState.daily.image.used).toBe(0);
      expect(state.quotaState.daily.video.used).toBe(0);
    });

    it('重置后总额度应保持不变', () => {
      const beforeTotal = useMembershipStore.getState().quotaState.daily.image.total;

      useMembershipStore.getState().resetDailyQuota();

      const afterTotal = useMembershipStore.getState().quotaState.daily.image.total;
      expect(afterTotal).toBe(beforeTotal);
    });

    it('重置后 resetAt 应更新为明天', () => {
      useMembershipStore.getState().resetDailyQuota();

      const state = useMembershipStore.getState();
      const resetAt = new Date(state.quotaState.daily.image.resetAt);
      const now = new Date();
      expect(resetAt.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe('upgradeDialog', () => {
    it('openUpgradeDialog 应打开对话框并设置 feature', () => {
      useMembershipStore.getState().openUpgradeDialog('图生图');
      const state = useMembershipStore.getState();
      expect(state.isUpgradeDialogOpen).toBe(true);
      expect(state.upgradeDialogFeature).toBe('图生图');
    });

    it('closeUpgradeDialog 应关闭对话框并清除 feature', () => {
      useMembershipStore.getState().openUpgradeDialog('图生图');
      useMembershipStore.getState().closeUpgradeDialog();
      const state = useMembershipStore.getState();
      expect(state.isUpgradeDialogOpen).toBe(false);
      expect(state.upgradeDialogFeature).toBeUndefined();
    });
  });

  describe('checkout', () => {
    it('startCheckout 应设置 checkoutPlan', () => {
      useMembershipStore.getState().startCheckout(MembershipTier.PRO, PlanType.MONTHLY);
      const state = useMembershipStore.getState();
      expect(state.checkoutPlan).toEqual({ tier: MembershipTier.PRO, plan: PlanType.MONTHLY });
    });

    it('completeCheckout 应清除 checkoutPlan', () => {
      useMembershipStore.getState().startCheckout(MembershipTier.PRO, PlanType.MONTHLY);
      useMembershipStore.getState().completeCheckout();
      const state = useMembershipStore.getState();
      expect(state.checkoutPlan).toBeUndefined();
      expect(state.isPaymentProcessing).toBe(false);
    });

    it('cancelCheckout 应清除 checkoutPlan', () => {
      useMembershipStore.getState().startCheckout(MembershipTier.PRO, PlanType.MONTHLY);
      useMembershipStore.getState().cancelCheckout();
      const state = useMembershipStore.getState();
      expect(state.checkoutPlan).toBeUndefined();
      expect(state.isPaymentProcessing).toBe(false);
    });
  });

  describe('customTemplates', () => {
    it('addCustomTemplate 应添加模板', () => {
      const template = {
        id: 'custom-1',
        category: 'portrait' as any,
        title: '自定义模板',
        prompt: '测试 prompt',
        preview: '🎨',
        isCustom: true,
        tierRequired: MembershipTier.FREE,
      };

      useMembershipStore.getState().addCustomTemplate(template);
      const state = useMembershipStore.getState();
      expect(state.customTemplates).toHaveLength(1);
      expect(state.customTemplates[0].id).toBe('custom-1');
    });

    it('removeCustomTemplate 应删除模板', () => {
      const template1 = {
        id: 'custom-1',
        category: 'portrait' as any,
        title: '模板1',
        prompt: 'prompt1',
        preview: '🎨',
        isCustom: true,
        tierRequired: MembershipTier.FREE,
      };
      const template2 = {
        id: 'custom-2',
        category: 'landscape' as any,
        title: '模板2',
        prompt: 'prompt2',
        preview: '🏔️',
        isCustom: true,
        tierRequired: MembershipTier.PRO,
      };

      useMembershipStore.getState().addCustomTemplate(template1);
      useMembershipStore.getState().addCustomTemplate(template2);

      useMembershipStore.getState().removeCustomTemplate('custom-1');

      const state = useMembershipStore.getState();
      expect(state.customTemplates).toHaveLength(1);
      expect(state.customTemplates[0].id).toBe('custom-2');
    });

    it('删除不存在的模板不应报错', () => {
      useMembershipStore.getState().removeCustomTemplate('non-existent');
      expect(useMembershipStore.getState().customTemplates).toHaveLength(0);
    });
  });

  describe('galleryItems - shareToGallery', () => {
    it('分享结果应添加到 galleryItems', () => {
      const result = {
        id: 'result-1',
        taskId: 'task-1',
        mediaType: 'image' as const,
        mediaUrl: 'https://example.com/image.jpg',
        isFavorited: false,
        tags: [],
        createdAt: new Date(),
      };

      const task = {
        id: 'task-1',
        userId: 'user-1',
        type: GenerationType.TEXT_TO_IMAGE,
        status: 'COMPLETED' as any,
        prompt: '测试 prompt',
        config: { style: 'realistic', creativity: 0.7, steps: 30 },
        results: [result],
        progress: 100,
        createdAt: new Date(),
      };

      const initialCount = useMembershipStore.getState().galleryItems.length;
      useMembershipStore.getState().shareToGallery(result, task, '测试用户');

      const state = useMembershipStore.getState();
      expect(state.galleryItems.length).toBe(initialCount + 1);
      // New item should be at the beginning
      expect(state.galleryItems[0].userNickname).toBe('测试用户');
      expect(state.galleryItems[0].prompt).toBe('测试 prompt');
      expect(state.galleryItems[0].likeCount).toBe(0);
      expect(state.galleryItems[0].isLikedByMe).toBe(false);
    });
  });

  describe('galleryItems - toggleLike', () => {
    beforeEach(() => {
      // Set gallery items to a known state with known likeCount
      useMembershipStore.setState({
        galleryItems: [
          {
            id: 'gallery-test-1',
            resultId: 'result-test-1',
            userId: 'user-1',
            userNickname: '测试用户',
            mediaUrl: 'https://example.com/image.jpg',
            mediaType: 'image' as const,
            prompt: '测试 prompt',
            likeCount: 10,
            isLikedByMe: false,
            sharedAt: new Date().toISOString(),
          },
        ],
      });
    });

    it('点赞应增加 likeCount 并设 isLikedByMe 为 true', () => {
      useMembershipStore.getState().toggleLike('gallery-test-1');

      const updated = useMembershipStore.getState().galleryItems.find(i => i.id === 'gallery-test-1');
      expect(updated?.isLikedByMe).toBe(true);
      expect(updated?.likeCount).toBe(11);
    });

    it('取消赞应减少 likeCount 并设 isLikedByMe 为 false', () => {
      // First like
      useMembershipStore.getState().toggleLike('gallery-test-1');
      const afterLike = useMembershipStore.getState().galleryItems.find(i => i.id === 'gallery-test-1');
      expect(afterLike?.isLikedByMe).toBe(true);
      expect(afterLike?.likeCount).toBe(11);

      // Then unlike
      useMembershipStore.getState().toggleLike('gallery-test-1');
      const afterUnlike = useMembershipStore.getState().galleryItems.find(i => i.id === 'gallery-test-1');
      expect(afterUnlike?.isLikedByMe).toBe(false);
      expect(afterUnlike?.likeCount).toBe(10);
    });
  });
});
