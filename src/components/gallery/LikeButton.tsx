import React from 'react';
import Chip from '@mui/material/Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { GalleryItem } from '../../types';
import { useMembershipStore } from '../../stores/membershipStore';

/** Props for LikeButton */
interface LikeButtonProps {
  item: GalleryItem;
}

/** Like button component for gallery items */
const LikeButton: React.FC<LikeButtonProps> = ({ item }) => {
  const toggleLike = useMembershipStore((state) => state.toggleLike);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(item.id);
  };

  return (
    <Chip
      icon={item.isLikedByMe ? <FavoriteIcon sx={{ fontSize: 14 }} /> : <FavoriteBorderIcon sx={{ fontSize: 14 }} />}
      label={item.likeCount}
      size="small"
      onClick={handleClick}
      sx={{
        fontSize: '0.7rem',
        height: 24,
        bgcolor: item.isLikedByMe ? 'rgba(233, 30, 99, 0.1)' : 'rgba(0,0,0,0.04)',
        color: item.isLikedByMe ? 'secondary.main' : 'text.secondary',
        '& .MuiChip-icon': {
          color: item.isLikedByMe ? 'secondary.main' : 'text.secondary',
        },
        '&:hover': {
          bgcolor: item.isLikedByMe ? 'rgba(233, 30, 99, 0.18)' : 'rgba(0,0,0,0.08)',
        },
      }}
    />
  );
};

export default LikeButton;
