import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { getTierColor } from '../../utils/membershipConfig';
import { MembershipTier } from '../../types';

/** Props for UpgradeHint */
interface UpgradeHintProps {
  feature: string;
  requiredTier?: MembershipTier;
  onClose?: () => void;
}

/** Upgrade hint component — inline banner suggesting upgrade */
const UpgradeHint: React.FC<UpgradeHintProps> = ({ feature, requiredTier = MembershipTier.PRO, onClose }) => {
  const navigate = useNavigate();
  const color = getTierColor(requiredTier);

  const handleUpgrade = () => {
    navigate(ROUTES.MEMBERSHIP);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: `${color}10`,
        border: `1px solid ${color}30`,
      }}
    >
      <UpgradeIcon sx={{ fontSize: 20, color, flexShrink: 0 }} />
      <Typography variant="body2" sx={{ flex: 1, color: `${color}`, fontWeight: 500, fontSize: '0.85rem' }}>
        「{feature}」需要升级到专业版
      </Typography>
      <Button
        size="small"
        variant="contained"
        onClick={handleUpgrade}
        sx={{
          bgcolor: color,
          textTransform: 'none',
          fontSize: '0.75rem',
          borderRadius: 1.5,
          py: 0.3,
          px: 1.5,
          '&:hover': { bgcolor: color, filter: 'brightness(0.9)' },
        }}
      >
        升级
      </Button>
      {onClose && (
        <IconButton size="small" onClick={onClose} sx={{ color: `${color}`, p: 0.25 }}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  );
};

export default UpgradeHint;
