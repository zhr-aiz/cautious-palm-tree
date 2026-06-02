import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { GalleryItem } from '../../types';
import LikeButton from './LikeButton';

/** Props for GalleryCard */
interface GalleryCardProps {
  item: GalleryItem;
  onClick?: (item: GalleryItem) => void;
}

/** Gallery card component — displays a single gallery item */
const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
  return (
    <Paper
      elevation={0}
      onClick={() => onClick?.(item)}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Media */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // 1:1 aspect ratio
          overflow: 'hidden',
          bgcolor: 'grey.100',
        }}
      >
        {item.mediaType === 'image' ? (
          <Box
            component="img"
            src={item.mediaUrl}
            alt={item.prompt}
            loading="lazy"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.200',
            }}
          >
            <Typography variant="caption" color="text.secondary">🎬 视频</Typography>
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ p: 1.25 }}>
        <Typography
          variant="caption"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.75rem',
            lineHeight: 1.4,
            mb: 0.75,
          }}
        >
          {item.prompt}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
            {item.userNickname}
          </Typography>
          <LikeButton item={item} />
        </Box>
      </Box>
    </Paper>
  );
};

export default GalleryCard;
