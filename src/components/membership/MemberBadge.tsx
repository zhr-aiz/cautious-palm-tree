import React from 'react';
import Chip from '@mui/material/Chip';
import { MembershipTier } from '../../types';
import { TIER_INFO } from '../../utils/membershipConfig';

/** Props for MemberBadge */
interface MemberBadgeProps {
  tier: MembershipTier;
  size?: 'sm' | 'md' | 'lg';
}

/** Size mapping for badge */
const SIZE_MAP = {
  sm: { height: 20, fontSize: '0.65rem', iconSize: 12 },
  md: { height: 26, fontSize: '0.75rem', iconSize: 14 },
  lg: { height: 32, fontSize: '0.85rem', iconSize: 16 },
};

/** Member badge component — shows tier with color-coded chip */
const MemberBadge: React.FC<MemberBadgeProps> = ({ tier, size = 'md' }) => {
  const info = TIER_INFO[tier];
  const sizeConfig = SIZE_MAP[size];

  return (
    <Chip
      label={`${info.icon} ${info.label}`}
      size="small"
      sx={{
        height: sizeConfig.height,
        fontSize: sizeConfig.fontSize,
        fontWeight: 600,
        bgcolor: `${info.color}18`,
        color: info.color,
        border: `1px solid ${info.color}40`,
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};

export default MemberBadge;
