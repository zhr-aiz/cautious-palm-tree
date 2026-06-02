import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

/** Generate button component */
interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  progress?: number;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  disabled = false,
  isGenerating = false,
  progress = 0,
}) => {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      onClick={onClick}
      disabled={disabled || isGenerating}
      startIcon={
        isGenerating ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <AutoAwesomeIcon />
        )
      }
      sx={{
        py: 1.5,
        fontSize: '1.1rem',
        fontWeight: 700,
        borderRadius: 3,
        textTransform: 'none',
        background: isGenerating
          ? undefined
          : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
        boxShadow: isGenerating
          ? undefined
          : '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: isGenerating
            ? undefined
            : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #DB2777 100%)',
          boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.5)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      }}
    >
      {isGenerating ? `生成中... ${progress}%` : '开始生成'}
    </Button>
  );
};

export default GenerateButton;
