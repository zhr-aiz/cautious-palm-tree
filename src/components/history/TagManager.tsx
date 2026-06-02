import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import { MembershipTier } from '../../types';
import { useMembershipStore } from '../../stores/membershipStore';

/** Default tag options */
const DEFAULT_TAGS = ['人物', '风景', '动物', '建筑', '抽象', '创意', '写实', '动漫'];

/** Props for TagManager */
interface TagManagerProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

/** Tag manager component — CRUD for tags with tier-gated custom tags */
const TagManager: React.FC<TagManagerProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [customTag, setCustomTag] = useState('');
  const tier = useMembershipStore((state) => state.quotaState.tier);
  const canUseCustomTags = tier === MembershipTier.PRO || tier === MembershipTier.ENTERPRISE;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCustomTag('');
  };

  const handleAddPresetTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onAddTag(tag);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAddTag(trimmed);
      setCustomTag('');
    }
  };

  return (
    <Box>
      {/* Display existing tags */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            onDelete={() => onRemoveTag(tag)}
            sx={{ fontSize: '0.7rem', height: 22 }}
          />
        ))}
        <Chip
          icon={<AddIcon />}
          label="添加标签"
          size="small"
          variant="outlined"
          onClick={handleOpen}
          sx={{ fontSize: '0.7rem', height: 22 }}
        />
      </Box>

      {/* Tag selection popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: 280 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
            预设标签
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
            {DEFAULT_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                onClick={() => handleAddPresetTag(tag)}
                sx={{ fontSize: '0.7rem', height: 22 }}
              />
            ))}
          </Box>

          {canUseCustomTags ? (
            <>
              <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
                自定义标签
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <TextField
                  size="small"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="输入标签名..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                  sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 1, fontSize: '0.8rem' } }}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAddCustomTag}
                  disabled={!customTag.trim()}
                  sx={{ minWidth: 'auto', px: 1, borderRadius: 1 }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="caption" color="text.secondary">
              🔒 自定义标签需升级到专业版
            </Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default TagManager;
