import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

/** App layout with responsive sidebar/bottom navigation */
const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isDesktop && <Sidebar />}

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          pb: isDesktop ? 0 : '56px', // Space for bottom nav
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>

      {!isDesktop && <BottomNav />}
    </Box>
  );
};

export default AppLayout;
