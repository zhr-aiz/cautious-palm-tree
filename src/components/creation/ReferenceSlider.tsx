import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

/** Props for ReferenceSlider */
interface ReferenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

/** Reference strength slider component — controls how much the reference image influences generation */
const ReferenceSlider: React.FC<ReferenceSliderProps> = ({ value, onChange, disabled = false }) => {
  const handleChange = (_: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  const getLabel = (val: number): string => {
    if (val <= 0.4) return '弱参考';
    if (val <= 0.7) return '中等参考';
    return '强参考';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          参考强度
        </Typography>
        <Tooltip title={getLabel(value)}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {value.toFixed(1)}
          </Typography>
        </Tooltip>
      </Box>
      <Slider
        value={value}
        onChange={handleChange}
        min={0.3}
        max={1.0}
        step={0.1}
        disabled={disabled}
        marks={[
          { value: 0.3, label: '0.3' },
          { value: 0.65, label: '' },
          { value: 1.0, label: '1.0' },
        ]}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => v.toFixed(1)}
        sx={{
          color: 'primary.main',
          '& .MuiSlider-mark': {
            bgcolor: 'primary.main',
          },
        }}
      />
    </Box>
  );
};

export default ReferenceSlider;
