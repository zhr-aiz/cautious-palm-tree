import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CreateIcon from '@mui/icons-material/Create';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CollectionsIcon from '@mui/icons-material/Collections';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import MemberBadge from '../membership/MemberBadge';
import QuotaDisplay from '../membership/QuotaDisplay';
import { useMembershipStore } from '../../stores/membershipStore';

const DRAWER_WIDTH = 240;

/** Sidebar navigation component for desktop */
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const quotaState = useMembershipStore((state) => state.quotaState);

  const menuItems = [
    { label: '创作', icon: <CreateIcon />, path: ROUTES.HOME },
    { label: '历史记录', icon: <HistoryIcon />, path: ROUTES.HISTORY },
    { label: '会员中心', icon: <CardMembershipIcon />, path: ROUTES.MEMBERSHIP },
    { label: '作品广场', icon: <CollectionsIcon />, path: ROUTES.GALLERY },
    { label: '设置', icon: <SettingsIcon />, path: ROUTES.SETTINGS },
  ];

  const isActive = (path: string): boolean => {
    if (path === ROUTES.HOME) {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #6366F1, #EC4899)',
          }}
        >
          <AutoAwesomeIcon sx={{ color: 'white', fontSize: 22 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          AI 媒体创作
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 3,
                py: 1.2,
                '&.Mui-selected': {
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.100',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flex: 1 }} />

      {/* Quota display */}
      <Box sx={{ px: 2, pb: 1 }}>
        <QuotaDisplay quotaState={quotaState} compact />
      </Box>

      <Divider />

      {/* User section */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar
            src={user?.avatarUrl}
            alt={user?.nickname}
            sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
          >
            {user?.nickname?.[0] || 'U'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.nickname || '用户'}
              </Typography>
              <MemberBadge tier={quotaState.tier} size="sm" />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {user?.email || ''}
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2, py: 0.75, color: 'error.main' }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="退出登录" primaryTypographyProps={{ fontSize: '0.85rem' }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
