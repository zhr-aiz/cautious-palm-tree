import React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { MembershipTier } from '../../types';
import { useMembershipStore } from '../../stores/membershipStore';
import { BATCH_SIZE_OPTIONS } from '../../utils/constants';

/** Props for BatchGenerateToggle */
interface BatchGenerateToggleProps {
  value: number;
  onChange: (batchSize: number) => void;
  disabled?: boolean;
}

/** Batch generation toggle — Pro 2/4, Enterprise 2/4/8 */
const BatchGenerateToggle: React.FC<BatchGenerateToggleProps> = ({ value, onChange, disabled = false }) => {
  const tier = useMembershipStore((state) => state.quotaState.tier);
  const options = BATCH_SIZE_OPTIONS[tier];

  const isFreeTier = tier === MembershipTier.FREE;

  if (isFreeTier) {
    return null; // Free users don't see batch options
  }

  const handleChange = (_: React.MouseEvent<HTMLElement>, newSize: number | null) => {
    if (newSize !== null) {
      onChange(newSize);
    }
  };

  return (
    <Box>
      <Typography variant="caption" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>
        批量生成数量
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        size="small"
        disabled={disabled}
        sx={{
          '& .MuiToggleButton-root': {
            borderRadius: '8px !important',
            px: 2,
            py: 0.5,
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 500,
            border: '1px solid',
            borderColor: 'divider',
            '&.Mui-selected': {
              bgcolor: 'primary.50',
              color: 'primary.main',
              borderColor: 'primary.main',
            },
          },
        }}
      >
        {options.map((size) => (
          <ToggleButton key={size} value={size}>
            {size}张
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default BatchGenerateToggle;
