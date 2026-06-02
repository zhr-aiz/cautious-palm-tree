import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PromptTemplate, TemplateCategory } from '../../types';
import { useMembershipStore } from '../../stores/membershipStore';
import { generateId } from '../../utils/helpers';

/** Props for CustomTemplateSaveDialog */
interface CustomTemplateSaveDialogProps {
  open: boolean;
  onClose: () => void;
  currentPrompt: string;
}

/** Dialog for saving current prompt as a custom template */
const CustomTemplateSaveDialog: React.FC<CustomTemplateSaveDialogProps> = ({
  open,
  onClose,
  currentPrompt,
}) => {
  const [title, setTitle] = useState('');
  const [category] = useState<TemplateCategory>(TemplateCategory.CREATIVE);
  const addCustomTemplate = useMembershipStore((state) => state.addCustomTemplate);
  const tier = useMembershipStore((state) => state.quotaState.tier);

  const handleSave = () => {
    if (!title.trim()) return;

    const template: PromptTemplate = {
      id: `custom-${generateId()}`,
      category,
      title: title.trim(),
      prompt: currentPrompt,
      preview: '📝',
      isCustom: true,
      tierRequired: tier,
    };

    addCustomTemplate(template);
    setTitle('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>保存为自定义模板</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          将当前 Prompt 保存为模板，下次使用可一键填充
        </Typography>
        <TextField
          fullWidth
          label="模板名称"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          placeholder="为模板起个名字..."
        />
        <TextField
          fullWidth
          label="Prompt 内容"
          value={currentPrompt}
          multiline
          rows={3}
          size="small"
          disabled
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>取消</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!title.trim()}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomTemplateSaveDialog;
