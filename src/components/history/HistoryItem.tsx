import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Popover from '@mui/material/Popover';
import { useNavigate } from 'react-router-dom';
import { GenerationTask, GenerationResult } from '../../types';
import { getGenerationTypeLabel, getStatusLabel, getStatusColor, formatRelativeTime, truncateText } from '../../utils/helpers';
import { useHistoryStore } from '../../stores/historyStore';
import { ROUTES } from '../../utils/constants';
import TagManager from './TagManager';

/** History item component for displaying a single history entry */
interface HistoryItemProps {
  task: GenerationTask;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ task }) => {
  const navigate = useNavigate();
  const toggleFavorite = useHistoryStore((state) => state.toggleFavorite);
  const deleteTask = useHistoryStore((state) => state.deleteTask);
  const addTag = useHistoryStore((state) => state.addTag);
  const removeTag = useHistoryStore((state) => state.removeTag);

  const [tagAnchorEl, setTagAnchorEl] = useState<HTMLElement | null>(null);
  const result: GenerationResult | undefined = task.results[0];

  const handleClick = () => {
    navigate(`${ROUTES.RESULT.replace(':taskId', task.id)}`);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result) {
      toggleFavorite(task.id, result.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTagAnchorEl(e.currentTarget as HTMLElement);
  };

  const handleAddTag = (tag: string) => {
    if (result) {
      addTag(task.id, result.id, tag);
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (result) {
      removeTag(task.id, result.id, tag);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 2,
          overflow: 'hidden',
          flexShrink: 0,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {result?.mediaType === 'image' && result.mediaUrl ? (
          <Box
            component="img"
            src={result.mediaUrl}
            alt={task.prompt}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : result?.mediaType === 'video' ? (
          <Box
            component="video"
            src={result.mediaUrl}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
          />
        ) : (
          <Typography variant="caption" color="text.secondary">
            无预览
          </Typography>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {truncateText(task.prompt, 40)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label={getGenerationTypeLabel(task.type)}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.65rem' }}
          />
          <Chip
            label={getStatusLabel(task.status)}
            size="small"
            color={getStatusColor(task.status)}
            sx={{ height: 20, fontSize: '0.65rem' }}
          />
        </Box>

        {/* Tags */}
        {result && result.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, mt: 0.5 }}>
            {result.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'grey.100' }}
              />
            ))}
            {result.tags.length > 3 && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                +{result.tags.length - 3}
              </Typography>
            )}
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {formatRelativeTime(task.createdAt)}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
        <IconButton size="small" onClick={handleFavoriteToggle}>
          {result?.isFavorited ? (
            <FavoriteIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
        <IconButton size="small" onClick={handleTagClick}>
          <LocalOfferIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton size="small" onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Tag manager popover */}
      <Popover
        open={Boolean(tagAnchorEl)}
        anchorEl={tagAnchorEl}
        onClose={() => setTagAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 1.5, maxWidth: 280 }}>
          <TagManager
            tags={result?.tags || []}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default HistoryItem;
