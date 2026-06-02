import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { MembershipTier, PlanType } from '../../types';
import { TIER_INFO, PRICING_INFO, FEATURE_COMPARISON } from '../../utils/membershipConfig';
import { useMembershipStore } from '../../stores/membershipStore';

/** Props for PricingTable */
interface PricingTableProps {
  onSelectPlan?: (tier: MembershipTier, plan: PlanType) => void;
}

/** Pricing table component — three-column tier comparison */
const PricingTable: React.FC<PricingTableProps> = ({ onSelectPlan }) => {
  const currentTier = useMembershipStore((state) => state.quotaState.tier);

  const tiers = [MembershipTier.FREE, MembershipTier.PRO, MembershipTier.ENTERPRISE];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
      {tiers.map((tier) => {
        const info = TIER_INFO[tier];
        const pricing = PRICING_INFO[tier];
        const isCurrentTier = currentTier === tier;
        const isPro = tier === MembershipTier.PRO;

        return (
          <Paper
            key={tier}
            elevation={isPro ? 3 : 1}
            sx={{
              p: 3,
              borderRadius: 3,
              position: 'relative',
              border: isCurrentTier ? `2px solid ${info.color}` : '1px solid',
              borderColor: isCurrentTier ? info.color : 'divider',
              overflow: 'visible',
            }}
          >
            {/* Popular badge */}
            {isPro && (
              <Chip
                label="最受欢迎"
                size="small"
                sx={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: info.color,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}

            {/* Tier info */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {info.icon}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: info.color }}>
                {info.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {info.description}
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              {pricing.monthly === 0 ? (
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  免费
                </Typography>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      ¥
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: info.color }}>
                      {pricing.monthly}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      /月
                    </Typography>
                  </Box>
                  {pricing.discount && (
                    <Chip
                      label={`年付 ${pricing.discount} ¥${pricing.yearlyMonthlyEquiv}/月`}
                      size="small"
                      sx={{
                        mt: 0.5,
                        bgcolor: `${info.color}15`,
                        color: info.color,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </>
              )}
            </Box>

            {/* Features list */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {FEATURE_COMPARISON.map((row) => {
                const value = row[tier as keyof typeof row];
                const isAvailable = value === true;
                const isUnavailable = value === false;
                const isText = typeof value === 'string';

                return (
                  <Box key={row.feature} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {isAvailable && <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                    {isUnavailable && <CancelIcon sx={{ fontSize: 16, color: 'grey.400' }} />}
                    {isText && <CheckCircleIcon sx={{ fontSize: 16, color: info.color }} />}
                    <Typography
                      variant="caption"
                      sx={{
                        color: isUnavailable ? 'text.disabled' : 'text.primary',
                        fontSize: '0.75rem',
                      }}
                    >
                      {isText ? `${row.feature}: ${value}` : row.feature}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Action button */}
            {tier !== MembershipTier.FREE && (
              <Button
                fullWidth
                variant={isCurrentTier ? 'outlined' : 'contained'}
                disabled={isCurrentTier}
                onClick={() => onSelectPlan?.(tier, PlanType.MONTHLY)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  bgcolor: isCurrentTier ? 'transparent' : info.color,
                  color: isCurrentTier ? info.color : 'white',
                  borderColor: info.color,
                  '&:hover': {
                    bgcolor: isCurrentTier ? `${info.color}10` : info.color,
                    filter: isCurrentTier ? 'none' : 'brightness(0.9)',
                  },
                }}
              >
                {isCurrentTier ? '当前方案' : '立即订阅'}
              </Button>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default PricingTable;
