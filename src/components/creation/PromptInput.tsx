import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

/** Prompt input component with character count */
interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MAX_PROMPT_LENGTH = 500;

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_PROMPT_LENGTH) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="描述你想生成的内容"
        placeholder="例如：一只在月光下奔跑的白色狐狸，雪景背景，动漫风格..."
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            fontSize: '1rem',
            lineHeight: 1.6,
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: isFocused ? 12 : 48,
          right: 14,
          fontSize: '0.75rem',
          color: value.length >= MAX_PROMPT_LENGTH * 0.9 ? 'error.main' : 'text.secondary',
          transition: 'bottom 0.2s',
        }}
      >
        {value.length}/{MAX_PROMPT_LENGTH}
      </Box>
    </Box>
  );
};

export default PromptInput;
