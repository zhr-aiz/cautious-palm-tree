import React, { useState } from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { MembershipTier, PlanType } from '../../types';
import { PRICING_INFO, TIER_INFO } from '../../utils/membershipConfig';

/** Props for PlanSelector */
interface PlanSelectorProps {
  tier: MembershipTier;
  onPlanChange?: (plan: PlanType) => void;
}

/** Plan selector component — monthly/yearly toggle with tier selection */
const PlanSelector: React.FC<PlanSelectorProps> = ({ tier, onPlanChange }) => {
  const [plan, setPlan] = useState<PlanType>(PlanType.MONTHLY);
  const pricing = PRICING_INFO[tier];
  const info = TIER_INFO[tier];

  const handlePlanToggle = (_: React.MouseEvent<HTMLElement>, newPlan: PlanType | null) => {
    if (newPlan !== null) {
      setPlan(newPlan);
      onPlanChange?.(newPlan);
    }
  };

  const monthlyEquiv = plan === PlanType.YEARLY ? pricing.yearlyMonthlyEquiv : pricing.monthly;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Plan toggle */}
      <ToggleButtonGroup
        value={plan}
        exclusive
        onChange={handlePlanToggle}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            borderRadius: '8px !important',
            px: 3,
            py: 0.75,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.85rem',
            border: '1px solid',
            borderColor: 'divider',
            '&.Mui-selected': {
              bgcolor: `${info.color}15`,
              color: info.color,
              borderColor: info.color,
              '&:hover': {
                bgcolor: `${info.color}25`,
              },
            },
          },
        }}
      >
        <ToggleButton value={PlanType.MONTHLY}>月付</ToggleButton>
        <ToggleButton value={PlanType.YEARLY}>
          年付
          {pricing.discount && (
            <Chip
              label={pricing.discount}
              size="small"
              sx={{
                ml: 0.5,
                height: 18,
                fontSize: '0.6rem',
                bgcolor: '#FF4D4F',
                color: 'white',
                fontWeight: 700,
              }}
            />
          )}
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Price display */}
      {pricing.monthly > 0 && (
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">¥</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: info.color }}>
              {plan === PlanType.MONTHLY ? pricing.monthly : pricing.yearly}
            </Typography>
          </Box>
          {plan === PlanType.YEARLY && (
            <Typography variant="caption" color="text.secondary">
              折合 ¥{monthlyEquiv}/月
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PlanSelector;
