import React from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import TransformIcon from '@mui/icons-material/Transform';
import { GenerationType } from '../../types';
import { GENERATION_TYPE_LABELS } from '../../utils/constants';

/** Mode selector for choosing generation type */
interface ModeSelectorProps {
  value: GenerationType;
  onChange: (value: GenerationType) => void;
  disabled?: boolean;
}

const MODE_OPTIONS: { value: GenerationType; icon: React.ReactElement; label: string }[] = [
  { value: GenerationType.TEXT_TO_IMAGE, icon: <ImageIcon />, label: GENERATION_TYPE_LABELS[GenerationType.TEXT_TO_IMAGE] },
  { value: GenerationType.TEXT_TO_VIDEO, icon: <VideocamIcon />, label: GENERATION_TYPE_LABELS[GenerationType.TEXT_TO_VIDEO] },
  { value: GenerationType.IMAGE_TO_IMAGE, icon: <TransformIcon />, label: GENERATION_TYPE_LABELS[GenerationType.IMAGE_TO_IMAGE] },
  { value: GenerationType.IMAGE_TO_VIDEO, icon: <VideocamIcon />, label: GENERATION_TYPE_LABELS[GenerationType.IMAGE_TO_VIDEO] },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ value, onChange, disabled = false }) => {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: GenerationType | null) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
        创作模式
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        disabled={disabled}
        sx={{
          width: '100%',
          '& .MuiToggleButton-root': {
            flex: 1,
            py: 1,
            px: 1,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            fontSize: '0.75rem',
            '&.Mui-selected': {
              bgcolor: 'primary.50',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.100',
              },
            },
          },
        }}
      >
        {MODE_OPTIONS.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.icon}
            <span>{option.label}</span>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default ModeSelector;
