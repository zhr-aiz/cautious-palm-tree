import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { STYLE_OPTIONS } from '../../utils/constants';
import { StyleOption } from '../../types';

/** Style picker component */
interface StylePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const StylePicker: React.FC<StylePickerProps> = ({ value, onChange, disabled = false }) => {
  const handleSelect = (styleId: string) => {
    if (!disabled) {
      onChange(styleId);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
        风格
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {STYLE_OPTIONS.map((option: StyleOption) => (
          <Chip
            key={option.id}
            label={`${option.preview} ${option.label}`}
            onClick={() => handleSelect(option.id)}
            variant={value === option.id ? 'filled' : 'outlined'}
            color={value === option.id ? 'primary' : 'default'}
            disabled={disabled}
            sx={{
              borderRadius: 3,
              px: 0.5,
              fontSize: '0.85rem',
              '&.MuiChip-filled': {
                fontWeight: 600,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default StylePicker;
