import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GalleryGrid from '../components/gallery/GalleryGrid';

/** Gallery page — community gallery for shared works */
const GalleryPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          作品广场
        </Typography>
        <Typography variant="body2" color="text.secondary">
          发现社区创作的精彩作品，获取灵感
        </Typography>
      </Box>

      {/* Gallery grid */}
      <GalleryGrid />
    </Container>
  );
};

export default GalleryPage;
