import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import CreateIcon from '@mui/icons-material/Create';
import HistoryIcon from '@mui/icons-material/History';
import CollectionsIcon from '@mui/icons-material/Collections';
import SettingsIcon from '@mui/icons-material/Settings';
import { ROUTES } from '../../utils/constants';

/** Bottom navigation component for mobile — 4-tab layout */
const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (): number => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/history')) return 1;
    if (location.pathname.startsWith('/gallery')) return 2;
    if (location.pathname.startsWith('/settings') || location.pathname.startsWith('/membership')) return 3;
    return 0;
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const paths = [ROUTES.HOME, ROUTES.HISTORY, ROUTES.GALLERY, ROUTES.SETTINGS];
    navigate(paths[newValue]);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
    >
      <BottomNavigation
        value={getActiveTab()}
        onChange={handleChange}
        showLabels
        sx={{
          height: 56,
          '& .Mui-selected': {
            color: 'primary.main',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.7rem',
            '&.Mui-selected': {
              fontSize: '0.75rem',
            },
          },
        }}
      >
        <BottomNavigationAction label="创作" icon={<CreateIcon />} />
        <BottomNavigationAction label="历史" icon={<HistoryIcon />} />
        <BottomNavigationAction label="广场" icon={<CollectionsIcon />} />
        <BottomNavigationAction label="我的" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
