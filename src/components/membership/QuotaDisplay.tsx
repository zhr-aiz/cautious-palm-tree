import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';
import { QuotaState } from '../../types';
import { ROUTES } from '../../utils/constants';
import { getTierColor } from '../../utils/membershipConfig';

/** Props for QuotaDisplay */
interface QuotaDisplayProps {
  quotaState: QuotaState;
  compact?: boolean;
}

/** Single quota bar component */
const QuotaBar: React.FC<{
  icon: React.ReactNode;
  label: string;
  used: number;
  total: number;
  color: string;
}> = ({ icon, label, used, total, color }) => {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const isExhausted = used >= total;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', color: isExhausted ? 'error.main' : color, flexShrink: 0 }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
          <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
            {label}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, fontSize: '0.7rem', color: isExhausted ? 'error.main' : 'text.secondary' }}
          >
            {used}/{total === 999 ? '∞' : total}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              bgcolor: isExhausted ? 'error.main' : color,
            },
          }}
        />
      </Box>
    </Box>
  );
};

/** Quota display component — shows daily quota and credits */
const QuotaDisplay: React.FC<QuotaDisplayProps> = ({ quotaState, compact = false }) => {
  const navigate = useNavigate();
  const tierColor = getTierColor(quotaState.tier);

  const handleClick = () => {
    navigate(ROUTES.MEMBERSHIP);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 1.5 : 2,
        px: compact ? 1 : 2,
        py: compact ? 0.75 : 1,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: tierColor,
          boxShadow: `0 0 0 1px ${tierColor}30`,
        },
      }}
    >
      <QuotaBar
        icon={<ImageIcon sx={{ fontSize: 16 }} />}
        label="图片"
        used={quotaState.daily.image.used}
        total={quotaState.daily.image.total}
        color={tierColor}
      />

      <QuotaBar
        icon={<VideocamIcon sx={{ fontSize: 16 }} />}
        label="视频"
        used={quotaState.daily.video.used}
        total={quotaState.daily.video.total}
        color={tierColor}
      />

      <Tooltip title="积分余额">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: 1.5,
            bgcolor: `${tierColor}12`,
            flexShrink: 0,
          }}
        >
          <AccountBalanceWalletIcon sx={{ fontSize: 14, color: tierColor }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: tierColor, fontSize: '0.7rem' }}>
            {quotaState.credits.balance}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default QuotaDisplay;
