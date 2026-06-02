import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import GalleryCard from './GalleryCard';
import { useMembershipStore } from '../../stores/membershipStore';

/** Gallery grid component — CSS Grid waterfall layout with mock data */
const GalleryGrid: React.FC = () => {
  const galleryItems = useMembershipStore((state) => state.galleryItems);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const filteredItems = useMemo(() => {
    let items = [...galleryItems];

    if (search.trim()) {
      const keyword = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.prompt.toLowerCase().includes(keyword) ||
          item.userNickname.toLowerCase().includes(keyword)
      );
    }

    if (sortBy === 'popular') {
      items.sort((a, b) => b.likeCount - a.likeCount);
    } else {
      items.sort((a, b) => new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime());
    }

    return items;
  }, [galleryItems, search, sortBy]);

  return (
    <Box>
      {/* Search and sort */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="搜索作品..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />

        <Box sx={{ display: 'flex', gap: 0.75 }}>
          <Chip
            label="最新"
            size="small"
            variant={sortBy === 'latest' ? 'filled' : 'outlined'}
            color={sortBy === 'latest' ? 'primary' : 'default'}
            onClick={() => setSortBy('latest')}
            sx={{ borderRadius: 2 }}
          />
          <Chip
            label="最热"
            size="small"
            variant={sortBy === 'popular' ? 'filled' : 'outlined'}
            color={sortBy === 'popular' ? 'primary' : 'default'}
            onClick={() => setSortBy('popular')}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body1" color="text.secondary">
            暂无作品
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 1.5,
          }}
        >
          {filteredItems.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GalleryGrid;
