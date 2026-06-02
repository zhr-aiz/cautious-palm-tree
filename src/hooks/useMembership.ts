/** Hook for accessing membership state and actions */

import { useMembershipStore } from '../stores/membershipStore';
import { MembershipTier, QuotaState, PromptTemplate, GalleryItem } from '../types';

/** Membership hook return type */
interface UseMembershipReturn {
  /** Current quota state */
  quotaState: QuotaState;
  /** Current tier */
  tier: MembershipTier;
  /** Whether user is on free tier */
  isFree: boolean;
  /** Whether user is on pro tier */
  isPro: boolean;
  /** Whether user is on enterprise tier */
  isEnterprise: boolean;
  /** Subscribe to a plan */
  subscribe: (tier: MembershipTier, plan: import('../types').PlanType) => Promise<void>;
  /** Purchase credits */
  purchaseCredits: (packageId: string) => Promise<void>;
  /** Open upgrade dialog */
  openUpgradeDialog: (feature: string) => void;
  /** Close upgrade dialog */
  closeUpgradeDialog: () => void;
  /** Start checkout */
  startCheckout: (tier: MembershipTier, plan: import('../types').PlanType) => void;
  /** Complete checkout */
  completeCheckout: () => void;
  /** Cancel checkout */
  cancelCheckout: () => void;
  /** Custom templates */
  customTemplates: PromptTemplate[];
  /** Add custom template */
  addCustomTemplate: (template: PromptTemplate) => void;
  /** Remove custom template */
  removeCustomTemplate: (id: string) => void;
  /** Gallery items */
  galleryItems: GalleryItem[];
  /** Share to gallery */
  shareToGallery: (result: import('../types').GenerationResult, task: import('../types').GenerationTask, nickname: string) => void;
  /** Toggle like */
  toggleLike: (itemId: string) => void;
}

/** Hook for accessing membership state and actions */
export function useMembership(): UseMembershipReturn {
  const quotaState = useMembershipStore((state) => state.quotaState);
  const subscribe = useMembershipStore((state) => state.subscribe);
  const purchaseCredits = useMembershipStore((state) => state.purchaseCredits);
  const openUpgradeDialog = useMembershipStore((state) => state.openUpgradeDialog);
  const closeUpgradeDialog = useMembershipStore((state) => state.closeUpgradeDialog);
  const startCheckout = useMembershipStore((state) => state.startCheckout);
  const completeCheckout = useMembershipStore((state) => state.completeCheckout);
  const cancelCheckout = useMembershipStore((state) => state.cancelCheckout);
  const customTemplates = useMembershipStore((state) => state.customTemplates);
  const addCustomTemplate = useMembershipStore((state) => state.addCustomTemplate);
  const removeCustomTemplate = useMembershipStore((state) => state.removeCustomTemplate);
  const galleryItems = useMembershipStore((state) => state.galleryItems);
  const shareToGallery = useMembershipStore((state) => state.shareToGallery);
  const toggleLike = useMembershipStore((state) => state.toggleLike);

  const tier = quotaState.tier;
  const isFree = tier === MembershipTier.FREE;
  const isPro = tier === MembershipTier.PRO;
  const isEnterprise = tier === MembershipTier.ENTERPRISE;

  return {
    quotaState,
    tier,
    isFree,
    isPro,
    isEnterprise,
    subscribe,
    purchaseCredits,
    openUpgradeDialog,
    closeUpgradeDialog,
    startCheckout,
    completeCheckout,
    cancelCheckout,
    customTemplates,
    addCustomTemplate,
    removeCustomTemplate,
    galleryItems,
    shareToGallery,
    toggleLike,
  };
}
