import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import { GenerationTask, GenerationStatus, MembershipTier } from '../../types';
import { getStatusLabel, getStatusColor, formatRelativeTime, getGenerationTypeLabel } from '../../utils/helpers';
import { useMembershipStore } from '../../stores/membershipStore';
import WatermarkOverlay from './WatermarkOverlay';

/** Result preview component for viewing a single task result in detail */
interface ResultPreviewProps {
  task: GenerationTask | null;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ task }) => {
  const tier = useMembershipStore((state) => state.quotaState.tier);
  const isFreeTier = tier === MembershipTier.FREE;

  if (!task) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          color: 'text.secondary',
        }}
      >
        <Typography variant="body1">暂无预览内容</Typography>
      </Box>
    );
  }

  const result = task.results[0];
  const isProcessing =
    task.status === GenerationStatus.PENDING || task.status === GenerationStatus.PROCESSING;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Media preview */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        {isProcessing ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 6,
            }}
          >
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" color="text.secondary">
              AI 正在创作中...
            </Typography>
            <Box sx={{ width: '80%', maxWidth: 300 }}>
              <LinearProgress
                variant="determinate"
                value={task.progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #6366F1, #EC4899)',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {task.progress}%
            </Typography>
          </Box>
        ) : result ? (
          result.mediaType === 'image' ? (
            <Box sx={{ position: 'relative', width: '100%' }}>
              <Box
                component="img"
                src={result.mediaUrl}
                alt={task.prompt}
                sx={{
                  width: '100%',
                  maxHeight: 500,
                  objectFit: 'contain',
                }}
              />
              {/* Watermark for free users */}
              {isFreeTier && <WatermarkOverlay />}
            </Box>
          ) : (
            <Box
              component="video"
              src={result.mediaUrl}
              controls
              autoPlay
              loop
              sx={{
                width: '100%',
                maxHeight: 500,
              }}
            />
          )
        ) : null}
      </Box>

      {/* Task info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={getGenerationTypeLabel(task.type)}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={getStatusLabel(task.status)}
            size="small"
            color={getStatusColor(task.status)}
          />
          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(task.createdAt)}
          </Typography>
          {result?.isShared && (
            <Chip
              label="已分享到广场"
              size="small"
              color="success"
              sx={{ fontSize: '0.65rem', height: 20 }}
            />
          )}
        </Box>

        <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
          {task.prompt}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResultPreview;
