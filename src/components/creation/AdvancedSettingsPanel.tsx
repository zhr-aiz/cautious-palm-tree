import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { MembershipTier } from '../../types';
import { useMembershipStore } from '../../stores/membershipStore';

/** Props for AdvancedSettingsPanel */
interface AdvancedSettingsPanelProps {
  creativity: number;
  steps: number;
  negativePrompt: string;
  seed: number;
  onCreativityChange: (v: number) => void;
  onStepsChange: (v: number) => void;
  onNegativePromptChange: (v: string) => void;
  onSeedChange: (v: number) => void;
  disabled?: boolean;
}

/** Advanced settings panel — collapsible with tier-gated features */
const AdvancedSettingsPanel: React.FC<AdvancedSettingsPanelProps> = ({
  creativity,
  steps,
  negativePrompt,
  seed,
  onCreativityChange,
  onStepsChange,
  onNegativePromptChange,
  onSeedChange,
  disabled = false,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const tier = useMembershipStore((state) => state.quotaState.tier);
  const openUpgradeDialog = useMembershipStore((state) => state.openUpgradeDialog);

  const canUseNegativePrompt = tier === MembershipTier.PRO || tier === MembershipTier.ENTERPRISE;
  const canUseSeed = tier === MembershipTier.ENTERPRISE;

  const handleNegativePromptClick = () => {
    if (!canUseNegativePrompt) {
      openUpgradeDialog('负面提示词');
    }
  };

  const handleSeedClick = () => {
    if (!canUseSeed) {
      openUpgradeDialog('种子值控制');
    }
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      {/* Toggle header */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          高级设置
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Creativity slider */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>创意度</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>{creativity.toFixed(1)}</Typography>
            </Box>
            <Slider
              value={creativity}
              onChange={(_, v) => onCreativityChange(v as number)}
              min={0}
              max={1}
              step={0.1}
              disabled={disabled}
              size="small"
              sx={{ color: 'primary.main' }}
            />
          </Box>

          {/* Steps slider */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>迭代步数</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>{steps}</Typography>
            </Box>
            <Slider
              value={steps}
              onChange={(_, v) => onStepsChange(v as number)}
              min={10}
              max={50}
              step={5}
              disabled={disabled}
              size="small"
              sx={{ color: 'primary.main' }}
            />
          </Box>

          {/* Negative prompt (Pro+) */}
          <Box onClick={handleNegativePromptClick}>
            <TextField
              fullWidth
              label={canUseNegativePrompt ? '负面提示词' : '🔒 负面提示词（Pro+）'}
              value={negativePrompt}
              onChange={(e) => canUseNegativePrompt && onNegativePromptChange(e.target.value)}
              size="small"
              disabled={disabled || !canUseNegativePrompt}
              placeholder="输入不想出现的内容..."
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                cursor: !canUseNegativePrompt ? 'pointer' : 'text',
              }}
            />
          </Box>

          {/* Seed (Enterprise) */}
          <Box onClick={handleSeedClick}>
            <TextField
              fullWidth
              label={canUseSeed ? '种子值' : '🔒 种子值（Enterprise）'}
              type="number"
              value={seed || ''}
              onChange={(e) => canUseSeed && onSeedChange(Number(e.target.value))}
              size="small"
              disabled={disabled || !canUseSeed}
              placeholder="输入种子值以复现结果..."
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                cursor: !canUseSeed ? 'pointer' : 'text',
              }}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AdvancedSettingsPanel;
