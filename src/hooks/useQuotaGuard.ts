/** Hook for quota guard — checks quota before generation */

import { useCallback } from 'react';
import { useMembershipStore } from '../stores/membershipStore';
import { GenerationType, QuotaCheckResult } from '../types';

/** Hook for quota guard functionality */
export function useQuotaGuard() {
  const checkQuota = useMembershipStore((state) => state.checkQuota);
  const openUpgradeDialog = useMembershipStore((state) => state.openUpgradeDialog);
  const consumeQuota = useMembershipStore((state) => state.consumeQuota);

  /** Check if generation is allowed, and optionally show upgrade dialog */
  const guard = useCallback(
    (type: GenerationType, showDialog: boolean = true): QuotaCheckResult => {
      const result = checkQuota(type);
      if (!result.allowed && showDialog) {
        openUpgradeDialog(
          result.reason === 'tier_restricted'
            ? '该功能需要升级会员'
            : result.reason === 'daily_exhausted'
            ? '今日额度已用完'
            : '积分不足'
        );
      }
      return result;
    },
    [checkQuota, openUpgradeDialog]
  );

  /** Consume quota after successful generation */
  const consume = useCallback(
    (type: GenerationType) => {
      const isImage = type === GenerationType.TEXT_TO_IMAGE || type === GenerationType.IMAGE_TO_IMAGE;
      consumeQuota(isImage ? 'image' : 'video');
    },
    [consumeQuota]
  );

  return { guard, consume };
}
