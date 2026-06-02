import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

/** Props for ResultCompare */
interface ResultCompareProps {
  originalUrl: string;
  generatedUrl: string;
  alt?: string;
}

/** Result compare component — side-by-side or slider comparison of original vs generated */
const ResultCompare: React.FC<ResultCompareProps> = ({ originalUrl, generatedUrl, alt = '对比' }) => {
  const [mode, setMode] = useState<'side' | 'slider'>('slider');
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <Box>
      {/* Mode toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, gap: 0.5 }}>
        <Tooltip title="滑动对比">
          <IconButton
            size="small"
            onClick={() => setMode('slider')}
            color={mode === 'slider' ? 'primary' : 'default'}
          >
            <CompareArrowsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="左右对比">
          <IconButton
            size="small"
            onClick={() => setMode('side')}
            color={mode === 'side' ? 'primary' : 'default'}
          >
            <SwapHorizIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {mode === 'side' ? (
        // Side-by-side comparison
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              原图
            </Typography>
            <Box
              component="img"
              src={originalUrl}
              alt={`原图 - ${alt}`}
              sx={{ width: '100%', borderRadius: 2, objectFit: 'contain', maxHeight: 300 }}
            />
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              生成结果
            </Typography>
            <Box
              component="img"
              src={generatedUrl}
              alt={`生成 - ${alt}`}
              sx={{ width: '100%', borderRadius: 2, objectFit: 'contain', maxHeight: 300 }}
            />
          </Box>
        </Box>
      ) : (
        // Slider comparison
        <Box
          ref={containerRef}
          onMouseMove={handleSliderMove}
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            cursor: 'ew-resize',
            userSelect: 'none',
          }}
        >
          {/* Generated (full background) */}
          <Box
            component="img"
            src={generatedUrl}
            alt={`生成 - ${alt}`}
            sx={{ width: '100%', display: 'block', maxHeight: 400, objectFit: 'contain' }}
          />

          {/* Original (clipped) */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${sliderPos}%`,
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={originalUrl}
              alt={`原图 - ${alt}`}
              sx={{
                width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
                maxWidth: 'none',
                display: 'block',
                maxHeight: 400,
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* Slider line */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: `${sliderPos}%`,
              width: 3,
              height: '100%',
              bgcolor: 'white',
              boxShadow: '0 0 4px rgba(0,0,0,0.5)',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Labels */}
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: '0.65rem',
            }}
          >
            原图
          </Typography>
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: '0.65rem',
            }}
          >
            生成
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResultCompare;
