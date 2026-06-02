import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditStore from '../components/membership/CreditStore';
import { useMembership } from '../hooks/useMembership';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

/** Credits center page */
const CreditsPage: React.FC = () => {
  const navigate = useNavigate();
  const { quotaState } = useMembership();

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTES.MEMBERSHIP)}
          sx={{ textTransform: 'none' }}
        >
          返回
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          积分中心
        </Typography>
      </Box>

      {/* Balance card */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #6366F1, #EC4899)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AccountBalanceWalletIcon sx={{ color: 'white' }} />
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            当前积分余额
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
          {quotaState.credits.balance}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5, display: 'block' }}>
          积分可在额度用完后继续生成，每消耗1积分可生成1次
        </Typography>
      </Paper>

      {/* Credit store */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        购买积分
      </Typography>
      <CreditStore />
    </Container>
  );
};

export default CreditsPage;
