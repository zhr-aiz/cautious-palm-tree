import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/** Props for WatermarkOverlay */
interface WatermarkOverlayProps {
  text?: string;
}

/** Watermark overlay component — semi-transparent watermark for free users */
const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({ text = 'AI 媒体创作' }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Diagonal repeated watermarks */}
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <Typography
            key={`${row}-${col}`}
            sx={{
              position: 'absolute',
              top: `${15 + row * 16}%`,
              left: `${10 + col * 30}%`,
              transform: 'rotate(-25deg)',
              color: 'rgba(255,255,255,0.15)',
              fontSize: { xs: '0.7rem', sm: '0.85rem' },
              fontWeight: 700,
              whiteSpace: 'nowrap',
              userSelect: 'none',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {text}
          </Typography>
        ))
      )}
    </Box>
  );
};

export default WatermarkOverlay;
