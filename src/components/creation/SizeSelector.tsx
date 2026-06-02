import React from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ImageSize, VideoResolution, GenerationType } from '../../types';
import { IMAGE_SIZE_OPTIONS, VIDEO_RESOLUTION_OPTIONS } from '../../utils/constants';

/** Size selector component - shows image sizes or video resolutions based on mode */
interface SizeSelectorProps {
  generationType: GenerationType;
  imageSize?: ImageSize;
  videoResolution?: VideoResolution;
  onImageSizeChange: (size: ImageSize) => void;
  onVideoResolutionChange: (resolution: VideoResolution) => void;
  disabled?: boolean;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  generationType,
  imageSize = ImageSize.SQUARE_1_1,
  videoResolution = VideoResolution.HD_720P,
  onImageSizeChange,
  onVideoResolutionChange,
  disabled = false,
}) => {
  const isVideo =
    generationType === GenerationType.TEXT_TO_VIDEO ||
    generationType === GenerationType.IMAGE_TO_VIDEO;

  if (isVideo) {
    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          视频分辨率
        </Typography>
        <ToggleButtonGroup
          value={videoResolution}
          exclusive
          onChange={(_, val) => val && onVideoResolutionChange(val)}
          disabled={disabled}
          sx={{
            '& .MuiToggleButton-root': {
              borderRadius: 3,
              px: 2,
              py: 0.75,
              border: '1px solid',
              borderColor: 'divider',
              fontSize: '0.85rem',
              '&.Mui-selected': {
                bgcolor: 'primary.50',
                borderColor: 'primary.main',
                color: 'primary.main',
              },
            },
          }}
        >
          {Object.entries(VIDEO_RESOLUTION_OPTIONS).map(([key, option]) => (
            <ToggleButton key={key} value={key}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
        图片尺寸
      </Typography>
      <ToggleButtonGroup
        value={imageSize}
        exclusive
        onChange={(_, val) => val && onImageSizeChange(val)}
        disabled={disabled}
        sx={{
          '& .MuiToggleButton-root': {
            borderRadius: 3,
            px: 2,
            py: 0.75,
            border: '1px solid',
            borderColor: 'divider',
            fontSize: '0.85rem',
            '&.Mui-selected': {
              bgcolor: 'primary.50',
              borderColor: 'primary.main',
              color: 'primary.main',
            },
          },
        }}
      >
        {Object.entries(IMAGE_SIZE_OPTIONS).map(([key, option]) => (
          <ToggleButton key={key} value={key}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default SizeSelector;
