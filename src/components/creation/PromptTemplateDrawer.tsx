import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LockIcon from '@mui/icons-material/Lock';
import { PromptTemplate, TemplateCategory, MembershipTier } from '../../types';
import { PROMPT_TEMPLATES, TEMPLATE_CATEGORY_LABELS } from '../../utils/constants';
import { useMembershipStore } from '../../stores/membershipStore';
import { getTierColor } from '../../utils/membershipConfig';

/** Props for TemplateCard */
interface TemplateCardProps {
  template: PromptTemplate;
  onSelect: (template: PromptTemplate) => void;
}

/** Single template card */
const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const tier = useMembershipStore((state) => state.quotaState.tier);
  const isLocked = template.tierRequired === MembershipTier.PRO && tier === MembershipTier.FREE;
  const isEnterpriseLocked = template.tierRequired === MembershipTier.ENTERPRISE && tier !== MembershipTier.ENTERPRISE;
  const locked = isLocked || isEnterpriseLocked;

  const handleClick = () => {
    if (!locked) {
      onSelect(template);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.6 : 1,
        position: 'relative',
        transition: 'all 0.2s',
        '&:hover': locked
          ? {}
          : {
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
            },
      }}
    >
      {locked && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
          }}
        >
          <LockIcon sx={{ fontSize: 12, color: getTierColor(template.tierRequired) }} />
        </Box>
      )}
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        {template.preview}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
        {template.title}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontSize: '0.65rem',
          lineHeight: 1.3,
        }}
      >
        {template.prompt}
      </Typography>
    </Box>
  );
};

/** Props for PromptTemplateDrawer */
interface PromptTemplateDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: PromptTemplate) => void;
}

/** Prompt template drawer — 6-category tabs with 24 preset templates */
const PromptTemplateDrawer: React.FC<PromptTemplateDrawerProps> = ({ open, onClose, onSelect }) => {
  const [activeCategory, setActiveCategory] = React.useState<TemplateCategory>(TemplateCategory.PORTRAIT);
  const customTemplates = useMembershipStore((state) => state.customTemplates);
  const tier = useMembershipStore((state) => state.quotaState.tier);

  const categories = Object.values(TemplateCategory);
  const filteredTemplates = PROMPT_TEMPLATES.filter((t) => t.category === activeCategory);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: { xs: '100%', sm: 380 },
        height: '100%',
        bgcolor: 'background.paper',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.25s ease-out',
        '@keyframes slideInRight': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Prompt 模板
        </Typography>
        <Typography
          variant="body2"
          onClick={onClose}
          sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 500 }}
        >
          关闭
        </Typography>
      </Box>

      {/* Category tabs */}
      <Box sx={{ display: 'flex', gap: 0.5, p: 1.5, overflowX: 'auto', flexWrap: 'nowrap' }}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={TEMPLATE_CATEGORY_LABELS[cat]}
            size="small"
            variant={activeCategory === cat ? 'filled' : 'outlined'}
            color={activeCategory === cat ? 'primary' : 'default'}
            onClick={() => setActiveCategory(cat)}
            sx={{ borderRadius: 2, fontSize: '0.75rem', flexShrink: 0 }}
          />
        ))}
      </Box>

      {/* Templates grid */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} onSelect={onSelect} />
          ))}
        </Box>

        {/* Custom templates */}
        {customTemplates.length > 0 && (
          <>
            <Typography variant="caption" sx={{ fontWeight: 600, mt: 2, mb: 1, display: 'block', color: 'text.secondary' }}>
              我的自定义模板
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              {customTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} onSelect={onSelect} />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Free tier hint */}
      {tier === MembershipTier.FREE && (
        <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
            🔒 升级专业版解锁更多模板
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PromptTemplateDrawer;
export { TemplateCard };
