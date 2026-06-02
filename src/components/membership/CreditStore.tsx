import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { CREDIT_PACKAGES } from '../../utils/constants';
import { useMembershipStore } from '../../stores/membershipStore';

/** Credit store component — shows credit packages for purchase */
const CreditStore: React.FC = () => {
  const purchaseCredits = useMembershipStore((state) => state.purchaseCredits);
  const isPaymentProcessing = useMembershipStore((state) => state.isPaymentProcessing);
  const creditBalance = useMembershipStore((state) => state.quotaState.credits.balance);

  const handlePurchase = async (packageId: string) => {
    try {
      await purchaseCredits(packageId);
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  return (
    <Box>
      {/* Current balance */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <AccountBalanceWalletIcon sx={{ color: 'primary.main' }} />
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          当前积分：{creditBalance}
        </Typography>
      </Box>

      {/* Package grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
        {CREDIT_PACKAGES.map((pkg) => (
          <Paper
            key={pkg.id}
            elevation={pkg.popular ? 2 : 0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: pkg.popular ? 'primary.main' : 'divider',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            {pkg.popular && (
              <Chip
                label="热门"
                size="small"
                color="primary"
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: 16,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                }}
              />
            )}

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {pkg.name}
            </Typography>

            {pkg.bonus > 0 && (
              <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>
                赠送 {pkg.bonus} 积分
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 1 }}>
              <Typography variant="caption" color="text.secondary">¥</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {pkg.price}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant={pkg.popular ? 'contained' : 'outlined'}
              size="small"
              disabled={isPaymentProcessing}
              onClick={() => handlePurchase(pkg.id)}
              sx={{
                mt: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.8rem',
              }}
            >
              购买
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default CreditStore;
