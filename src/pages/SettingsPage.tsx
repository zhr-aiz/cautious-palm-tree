import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useMembershipStore } from '../stores/membershipStore';
import MemberBadge from '../components/membership/MemberBadge';
import QuotaDisplay from '../components/membership/QuotaDisplay';

/** Settings page */
const SettingsPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const quotaState = useMembershipStore((state) => state.quotaState);

  const [nickname, setNickname] = useState(user?.nickname || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [useMockService, setUseMockService] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      updateProfile({ nickname: nickname.trim(), phone: phone.trim() });
      setSnackbarMessage('设置已保存');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('保存失败');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        设置
      </Typography>

      {/* Membership center entry card */}
      <Paper
        onClick={() => navigate(ROUTES.MEMBERSHIP)}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #6366F1, #EC4899)',
          color: 'white',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CardMembershipIcon sx={{ fontSize: 28 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  会员中心
                </Typography>
                <MemberBadge tier={quotaState.tier} size="sm" />
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                管理订阅、额度和积分
              </Typography>
            </Box>
          </Box>
          <ChevronRightIcon />
        </Box>
        <Box sx={{ mt: 1.5 }}>
          <QuotaDisplay quotaState={quotaState} compact />
        </Box>
      </Paper>

      {/* Profile section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={user?.avatarUrl}
            sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem' }}
          >
            {user?.nickname?.[0] || <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user?.nickname || '用户'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            label="手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ borderRadius: 2, textTransform: 'none', alignSelf: 'flex-start' }}
          >
            保存
          </Button>
        </Box>
      </Paper>

      {/* Service settings */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          服务设置
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={useMockService}
              onChange={(e) => setUseMockService(e.target.checked)}
              color="primary"
            />
          }
          label="使用模拟服务（Demo 模式）"
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          开启后将使用模拟 AI 服务生成示例内容，无需真实 API
        </Typography>
      </Paper>

      {/* Danger zone */}
      <Paper sx={{ p: 3, borderRadius: 3, borderColor: 'error.main', border: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'error.main' }}>
          危险操作
        </Typography>

        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          退出登录
        </Button>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes('失败') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;
