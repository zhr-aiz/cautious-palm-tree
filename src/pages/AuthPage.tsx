import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { AuthFormData } from '../types';

/** Authentication page with login/register toggle */
const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();

  const handleLogin = async (data: Pick<AuthFormData, 'email' | 'password'>) => {
    await login(data);
  };

  const handleRegister = async (data: AuthFormData) => {
    await register(data);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #FDF2F8 50%, #ECFDF5 100%)',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 480,
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366F1, #EC4899)',
              mb: 2,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 36, color: 'white' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            AI 媒体创作
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            释放你的创造力
          </Typography>
        </Box>

        {isLogin ? (
          <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </Paper>
    </Box>
  );
};

export default AuthPage;
