import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ShareIcon from '@mui/icons-material/Share';
import { GenerationResult, GenerationTask } from '../../types';
import { useMembershipStore } from '../../stores/membershipStore';
import { useAuthStore } from '../../stores/authStore';

/** Props for ShareDialog */
interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  result: GenerationResult | undefined;
  task: GenerationTask | null;
}

/** Share to gallery confirmation dialog */
const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, result, task }) => {
  const [nickname, setNickname] = useState('');
  const shareToGallery = useMembershipStore((state) => state.shareToGallery);
  const user = useAuthStore((state) => state.user);

  const handleShare = () => {
    if (!result || !task) return;

    shareToGallery(result, task, nickname || user?.nickname || '匿名用户');

    // Update result as shared
    result.isShared = true;

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShareIcon sx={{ color: 'primary.main' }} />
        分享到作品广场
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          分享你的作品，让更多人看到你的创意！分享后其他用户可以查看和点赞。
        </Typography>

        {task && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, bgcolor: 'grey.50' }}>
            <Typography variant="caption" color="text.secondary">Prompt</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {task.prompt}
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          label="显示昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          size="small"
          placeholder={user?.nickname || '匿名用户'}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>取消</Button>
        <Button
          variant="contained"
          onClick={handleShare}
          disabled={!result || !task}
          startIcon={<ShareIcon />}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          确认分享
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
