import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

/** Props for ParameterSlider */
interface ParameterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  formatValue?: (v: number) => string;
}

/** Generic parameter slider component */
const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.1,
  disabled = false,
  formatValue,
}) => {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {displayValue}
        </Typography>
      </Box>
      <Slider
        value={value}
        onChange={(_, v) => onChange(v as number)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        size="small"
        sx={{ color: 'primary.main' }}
      />
    </Box>
  );
};

export default ParameterSlider;
