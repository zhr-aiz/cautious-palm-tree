import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthFormData } from '../../types';

/** Login form component */
interface LoginFormProps {
  onLogin: (data: Pick<AuthFormData, 'email' | 'password'>) => Promise<void>;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('请输入邮箱');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    setLoading(true);
    try {
      await onLogin({ email: email.trim(), password });
    } catch (err: any) {
      setError(err.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
        登录
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="邮箱"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required
        autoComplete="email"
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
      />

      <TextField
        fullWidth
        label="密码"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        autoComplete="current-password"
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          },
        }}
      >
        登录
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          还没有账号？{' '}
          <Button
            variant="text"
            size="small"
            onClick={onSwitchToRegister}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            注册
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
