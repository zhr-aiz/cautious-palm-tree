import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import { GenerationResult, GenerationTask } from '../../types';
import { getStatusLabel, getStatusColor, getGenerationTypeLabel } from '../../utils/helpers';

/** Result card component for displaying a single generation result */
interface ResultCardProps {
  task: GenerationTask;
  result: GenerationResult;
  onFavoriteToggle?: (taskId: string, resultId: string) => void;
  onClick?: (result: GenerationResult) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  task,
  result,
  onFavoriteToggle,
  onClick,
}) => {
  const isVideo = result.mediaType === 'video';

  return (
    <Card
      sx={{
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        },
      }}
      onClick={() => onClick?.(result)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component={isVideo ? 'video' : 'img'}
          height={200}
          src={result.mediaUrl}
          alt={task.prompt}
          sx={{
            objectFit: 'cover',
            bgcolor: 'grey.100',
          }}
          {...(isVideo ? { controls: true, muted: true } : {})}
        />

        {/* Type badge */}
        <Chip
          label={getGenerationTypeLabel(task.type)}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: 'rgba(255,255,255,0.9)',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />

        {/* Favorite button */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.(task.id, result.id);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
          }}
        >
          {result.isFavorited ? (
            <FavoriteIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 500,
          }}
        >
          {task.prompt}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Chip
            label={getStatusLabel(task.status)}
            color={getStatusColor(task.status)}
            size="small"
            sx={{ height: 20, fontSize: '0.65rem' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
