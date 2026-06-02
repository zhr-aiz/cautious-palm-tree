import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from 'react-router-dom';
import MemberBadge from '../components/membership/MemberBadge';
import QuotaDisplay from '../components/membership/QuotaDisplay';
import PricingTable from '../components/membership/PricingTable';
import UpgradeHint from '../components/membership/UpgradeHint';
import { useMembership } from '../hooks/useMembership';
import { useMembershipStore } from '../stores/membershipStore';
import { MembershipTier, PlanType } from '../types';
import { TIER_INFO } from '../utils/membershipConfig';
import { ROUTES } from '../utils/constants';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

/** Membership center page */
const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const { quotaState, tier, isFree, closeUpgradeDialog, startCheckout } = useMembership();
  const isUpgradeDialogOpen = useMembershipStore((state) => state.isUpgradeDialogOpen);
  const upgradeDialogFeature = useMembershipStore((state) => state.upgradeDialogFeature);

  const info = TIER_INFO[tier];

  const handleSelectPlan = (selectedTier: MembershipTier, plan: PlanType) => {
    startCheckout(selectedTier, plan);
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          会员中心
        </Typography>
        <MemberBadge tier={tier} size="lg" />
      </Box>

      {/* Current plan card */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, borderLeft: `4px solid ${info.color}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: info.color, mb: 0.5 }}>
              {info.icon} {info.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {info.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={() => navigate(ROUTES.CREDITS)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              积分中心
            </Button>
          </Box>
        </Box>

        {/* Quota display */}
        <Box sx={{ mt: 2 }}>
          <QuotaDisplay quotaState={quotaState} />
        </Box>

        {/* Upgrade hints for free users */}
        {isFree && (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <UpgradeHint feature="图生图/图生视频" requiredTier={MembershipTier.PRO} />
            <UpgradeHint feature="批量生成" requiredTier={MembershipTier.PRO} />
          </Box>
        )}
      </Paper>

      {/* Pricing table */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        方案对比
      </Typography>
      <PricingTable onSelectPlan={handleSelectPlan} />

      {/* Upgrade dialog */}
      <Dialog
        open={isUpgradeDialogOpen}
        onClose={closeUpgradeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          功能升级提示
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {upgradeDialogFeature || '该功能需要升级会员才能使用'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            升级到专业版，解锁图生图、图生视频、批量生成等高级功能
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpgradeDialog} sx={{ textTransform: 'none' }}>
            稍后再说
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              closeUpgradeDialog();
              startCheckout(MembershipTier.PRO, PlanType.MONTHLY);
              navigate(ROUTES.CHECKOUT);
            }}
            sx={{ textTransform: 'none' }}
          >
            立即升级
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MembershipPage;
