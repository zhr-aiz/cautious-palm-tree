import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CreationPanel from '../components/creation/CreationPanel';
import QuotaDisplay from '../components/membership/QuotaDisplay';
import { useMembershipStore } from '../stores/membershipStore';

/** Main creation page */
const CreationPage: React.FC = () => {
  const quotaState = useMembershipStore((state) => state.quotaState);

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #6366F1, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI 媒体创作
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          描述你的创意，让 AI 为你实现
        </Typography>
      </Box>

      {/* Quota display bar */}
      <Box sx={{ mb: 2 }}>
        <QuotaDisplay quotaState={quotaState} compact />
      </Box>

      <CreationPanel />
    </Container>
  );
};

export default CreationPage;
