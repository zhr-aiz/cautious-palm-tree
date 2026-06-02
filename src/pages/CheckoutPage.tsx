import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '../hooks/useMembership';
import { useMembershipStore } from '../stores/membershipStore';
import { PlanType } from '../types';
import { TIER_INFO, PRICING_INFO } from '../utils/membershipConfig';
import { ROUTES } from '../utils/constants';

/** Checkout confirmation page with payment animation */
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { subscribe, completeCheckout, cancelCheckout } = useMembership();
  const checkoutPlan = useMembershipStore((state) => state.checkoutPlan);
  const isPaymentProcessing = useMembershipStore((state) => state.isPaymentProcessing);
  const [isCompleted, setIsCompleted] = useState(false);

  // If no plan selected, redirect to membership
  if (!checkoutPlan) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          请先选择订阅方案
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(ROUTES.MEMBERSHIP)}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          前往会员中心
        </Button>
      </Container>
    );
  }

  const { tier, plan } = checkoutPlan;
  const info = TIER_INFO[tier];
  const pricing = PRICING_INFO[tier];
  const price = plan === PlanType.MONTHLY ? pricing.monthly : pricing.yearly;

  const handlePayment = async () => {
    try {
      await subscribe(tier, plan);
      setIsCompleted(true);
      setTimeout(() => {
        completeCheckout();
        navigate(ROUTES.MEMBERSHIP);
      }, 2000);
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const handleCancel = () => {
    cancelCheckout();
    navigate(ROUTES.MEMBERSHIP);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          disabled={isPaymentProcessing}
          sx={{ textTransform: 'none' }}
        >
          返回
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          确认订单
        </Typography>
      </Box>

      {/* Order summary */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          订单详情
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">方案</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {info.icon} {info.label}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">周期</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {plan === PlanType.MONTHLY ? '月付' : '年付'}
          </Typography>
        </Box>

        {plan === PlanType.YEARLY && pricing.discount && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">优惠</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
              {pricing.discount}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>应付金额</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: info.color }}>
            ¥{price.toFixed(2)}
          </Typography>
        </Box>
      </Paper>

      {/* Payment processing / completed state */}
      {isPaymentProcessing || isCompleted ? (
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          {isCompleted ? (
            <>
              <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                支付成功！
              </Typography>
              <Typography variant="body2" color="text.secondary">
                正在跳转到会员中心...
              </Typography>
            </>
          ) : (
            <>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                处理支付中...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                请勿关闭页面
              </Typography>
            </>
          )}
        </Paper>
      ) : (
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<CreditCardIcon />}
          onClick={handlePayment}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            py: 1.5,
            bgcolor: info.color,
            '&:hover': { bgcolor: info.color, filter: 'brightness(0.9)' },
          }}
        >
          确认支付 ¥{price.toFixed(2)}
        </Button>
      )}
    </Container>
  );
};

export default CheckoutPage;
