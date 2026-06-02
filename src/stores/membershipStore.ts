import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MembershipTier,
  PlanType,
  GenerationType,
  QuotaState,
  QuotaCheckResult,
  PromptTemplate,
  GalleryItem,
  GenerationResult,
  GenerationTask,
} from '../types';
import { STORAGE_KEYS, TIER_QUOTAS } from '../utils/constants';
import { generateId } from '../utils/helpers';

/** Membership store state */
interface MembershipState {
  /** Current quota state */
  quotaState: QuotaState;
  /** Upgrade dialog state */
  isUpgradeDialogOpen: boolean;
  upgradeDialogFeature?: string;
  /** Checkout state */
  checkoutPlan?: { tier: MembershipTier; plan: PlanType };
  isPaymentProcessing: boolean;
  /** Custom templates */
  customTemplates: PromptTemplate[];
  /** Gallery items */
  galleryItems: GalleryItem[];
  /** Subscribe to a plan */
  subscribe: (tier: MembershipTier, plan: PlanType) => Promise<void>;
  /** Check quota for a generation type */
  checkQuota: (type: GenerationType) => QuotaCheckResult;
  /** Consume quota after generation */
  consumeQuota: (type: 'image' | 'video') => void;
  /** Purchase credits */
  purchaseCredits: (packageId: string) => Promise<void>;
  /** Reset daily quota (called at midnight) */
  resetDailyQuota: () => void;
  /** Open upgrade dialog */
  openUpgradeDialog: (feature: string) => void;
  /** Close upgrade dialog */
  closeUpgradeDialog: () => void;
  /** Start checkout */
  startCheckout: (tier: MembershipTier, plan: PlanType) => void;
  /** Complete checkout */
  completeCheckout: () => void;
  /** Cancel checkout */
  cancelCheckout: () => void;
  /** Add a custom template */
  addCustomTemplate: (template: PromptTemplate) => void;
  /** Remove a custom template */
  removeCustomTemplate: (id: string) => void;
  /** Share a result to gallery */
  shareToGallery: (result: GenerationResult, task: GenerationTask, nickname: string) => void;
  /** Toggle like on a gallery item */
  toggleLike: (itemId: string) => void;
}

/** Create default quota state for a tier */
function createDefaultQuotaState(tier: MembershipTier): QuotaState {
  const config = TIER_QUOTAS[tier];
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return {
    daily: {
      image: { used: 0, total: config.dailyImage, resetAt: tomorrow.toISOString() },
      video: { used: 0, total: config.dailyVideo, resetAt: tomorrow.toISOString() },
    },
    credits: { balance: config.credits, expiringAt: undefined },
    tier,
  };
}

/** Initialize gallery with mock data */
function createMockGalleryItems(): GalleryItem[] {
  const mockItems: GalleryItem[] = [];
  const prompts = [
    '一位优雅的女性，穿着传统汉服，背景是古典园林',
    '壮丽的日出山景，金色阳光洒在雪山之巅',
    '一只可爱的橘猫，慵懒地躺在窗台上',
    '流体艺术，绚丽色彩交织，金色与深蓝色碰撞',
    '未来主义建筑，流线型白色结构',
    '蒸汽朋克风格的飞艇，黄铜齿轮',
    '梦幻柔光人像，背景是星空和极光',
    '赛博朋克城市夜景，霓虹灯光',
    '微距摄影下的蝴蝶翅膀，极致细节',
    '中国水墨画风格，山水之间',
    '外星星球表面风景，紫色天空双月',
    '古典油画风格的人物肖像',
    '被自然重新占领的废弃建筑',
    '微缩世界，小人在巨大的咖啡杯上生活',
    '水母在深海中发光，梦幻水族馆',
    '向日葵田，蓝天白云，印象派风格',
    '雪中的日本神社，鸟居，宁静',
    '宇航员在太空中漂浮，地球为背景',
    '魔法森林，发光的蘑菇，萤火虫',
    '水上城市，贡多拉，威尼斯黄昏',
    '北极光倒映在湖面，雪山',
    '古堡中的图书馆，螺旋楼梯',
    '热带雨林中的瀑布，彩虹',
    '机械臂制作咖啡，工业美学',
    '沙漠中的绿洲，星空银河',
    '可爱的柴犬穿着圣诞 sweater',
    '薰衣草田，法国普罗旺斯',
    '暴风雨中的灯塔，巨浪',
    '未来城市中的飞行汽车',
    '竹林中的禅意茶室',
  ];

  const nicknames = ['创作达人', '艺术爱好者', 'AI画师', '梦幻创作者', '像素大师', '光影行者', '灵感收集者', '视觉诗人'];

  for (let i = 0; i < 30; i++) {
    const seed = 100 + i * 7;
    mockItems.push({
      id: `gallery-${i + 1}`,
      resultId: `result-mock-${i + 1}`,
      userId: `user-${(i % 8) + 1}`,
      userNickname: nicknames[i % nicknames.length],
      mediaUrl: `https://picsum.photos/seed/${seed}/400/400`,
      mediaType: i % 5 === 0 ? 'video' : 'image',
      prompt: prompts[i % prompts.length],
      likeCount: Math.floor(Math.random() * 200) + 5,
      isLikedByMe: false,
      sharedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return mockItems;
}

/**
 * Membership store with localStorage persistence.
 * Manages quota, subscription, templates, and gallery.
 */
export const useMembershipStore = create<MembershipState>()(
  persist(
    (set, get) => ({
      quotaState: createDefaultQuotaState(MembershipTier.FREE),
      isUpgradeDialogOpen: false,
      upgradeDialogFeature: undefined,
      checkoutPlan: undefined,
      isPaymentProcessing: false,
      customTemplates: [],
      galleryItems: createMockGalleryItems(),

      subscribe: async (tier, plan) => {
        set({ isPaymentProcessing: true });

        try {
          // Simulate payment processing
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const now = new Date();
          const expiresAt = new Date(now);
          if (plan === PlanType.MONTHLY) {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
          } else {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          }

          const config = TIER_QUOTAS[tier];
          const newQuotaState: QuotaState = {
            daily: {
              image: { used: 0, total: config.dailyImage, resetAt: expiresAt.toISOString() },
              video: { used: 0, total: config.dailyVideo, resetAt: expiresAt.toISOString() },
            },
            credits: { balance: config.credits, expiringAt: undefined },
            tier,
            subscription: {
              plan,
              startedAt: now.toISOString(),
              expiresAt: expiresAt.toISOString(),
              autoRenew: true,
            },
          };

          set({ quotaState: newQuotaState, isPaymentProcessing: false });
        } catch {
          set({ isPaymentProcessing: false });
          throw new Error('订阅失败，请重试');
        }
      },

      checkQuota: (type) => {
        const { quotaState } = get();

        // Check if tier allows this generation type
        const config = TIER_QUOTAS[quotaState.tier];
        if (
          (type === GenerationType.IMAGE_TO_IMAGE || type === GenerationType.IMAGE_TO_VIDEO) &&
          !config.features.includes('image_to_image')
        ) {
          return {
            allowed: false,
            reason: 'tier_restricted',
            suggestion: '升级到专业版解锁图生图/图生视频功能',
          };
        }

        // Check daily quota
        const isImage = type === GenerationType.TEXT_TO_IMAGE || type === GenerationType.IMAGE_TO_IMAGE;
        const quotaItem = isImage ? quotaState.daily.image : quotaState.daily.video;

        if (quotaItem.used >= quotaItem.total) {
          // Check if we have credits
          if (quotaState.credits.balance > 0) {
            return { allowed: true };
          }
          return {
            allowed: false,
            reason: 'daily_exhausted',
            suggestion: isImage
              ? `今日图片额度已用完（${quotaItem.used}/${quotaItem.total}），升级会员获取更多额度`
              : `今日视频额度已用完（${quotaItem.used}/${quotaItem.total}），升级会员获取更多额度`,
          };
        }

        return { allowed: true };
      },

      consumeQuota: (type) => {
        set((state) => {
          const isImage = type === 'image';
          const quotaKey = isImage ? 'image' : 'video';
          const quotaItem = state.quotaState.daily[quotaKey];

          // If daily quota exhausted, consume credits
          if (quotaItem.used >= quotaItem.total && state.quotaState.credits.balance > 0) {
            return {
              quotaState: {
                ...state.quotaState,
                credits: {
                  ...state.quotaState.credits,
                  balance: state.quotaState.credits.balance - 1,
                },
              },
            };
          }

          return {
            quotaState: {
              ...state.quotaState,
              daily: {
                ...state.quotaState.daily,
                [quotaKey]: {
                  ...quotaItem,
                  used: quotaItem.used + 1,
                },
              },
            },
          };
        });
      },

      purchaseCredits: async (packageId) => {
        set({ isPaymentProcessing: true });

        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Map packageId to credits (simplified)
          const creditMap: Record<string, { credits: number; bonus: number }> = {
            'credits-100': { credits: 100, bonus: 0 },
            'credits-300': { credits: 300, bonus: 15 },
            'credits-500': { credits: 500, bonus: 50 },
            'credits-1000': { credits: 1000, bonus: 150 },
          };

          const pkg = creditMap[packageId];
          if (!pkg) {
            throw new Error('无效的积分套餐');
          }

          set((state) => ({
            quotaState: {
              ...state.quotaState,
              credits: {
                ...state.quotaState.credits,
                balance: state.quotaState.credits.balance + pkg.credits + pkg.bonus,
              },
            },
            isPaymentProcessing: false,
          }));
        } catch {
          set({ isPaymentProcessing: false });
          throw new Error('购买失败，请重试');
        }
      },

      resetDailyQuota: () => {
        set((state) => {
          const config = TIER_QUOTAS[state.quotaState.tier];
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);

          return {
            quotaState: {
              ...state.quotaState,
              daily: {
                image: { used: 0, total: config.dailyImage, resetAt: tomorrow.toISOString() },
                video: { used: 0, total: config.dailyVideo, resetAt: tomorrow.toISOString() },
              },
            },
          };
        });
      },

      openUpgradeDialog: (feature) => {
        set({ isUpgradeDialogOpen: true, upgradeDialogFeature: feature });
      },

      closeUpgradeDialog: () => {
        set({ isUpgradeDialogOpen: false, upgradeDialogFeature: undefined });
      },

      startCheckout: (tier, plan) => {
        set({ checkoutPlan: { tier, plan } });
      },

      completeCheckout: () => {
        set({ checkoutPlan: undefined, isPaymentProcessing: false });
      },

      cancelCheckout: () => {
        set({ checkoutPlan: undefined, isPaymentProcessing: false });
      },

      addCustomTemplate: (template) => {
        set((state) => ({
          customTemplates: [...state.customTemplates, template],
        }));
      },

      removeCustomTemplate: (id) => {
        set((state) => ({
          customTemplates: state.customTemplates.filter((t) => t.id !== id),
        }));
      },

      shareToGallery: (result, task, nickname) => {
        const newItem: GalleryItem = {
          id: generateId(),
          resultId: result.id,
          userId: task.userId,
          userNickname: nickname,
          mediaUrl: result.mediaUrl,
          mediaType: result.mediaType,
          prompt: task.prompt,
          likeCount: 0,
          isLikedByMe: false,
          sharedAt: new Date().toISOString(),
        };

        set((state) => ({
          galleryItems: [newItem, ...state.galleryItems],
        }));
      },

      toggleLike: (itemId) => {
        set((state) => ({
          galleryItems: state.galleryItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  isLikedByMe: !item.isLikedByMe,
                  likeCount: item.isLikedByMe ? item.likeCount - 1 : item.likeCount + 1,
                }
              : item
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.MEMBERSHIP,
      partialize: (state) => ({
        quotaState: state.quotaState,
        customTemplates: state.customTemplates,
        galleryItems: state.galleryItems,
      }),
    }
  )
);
