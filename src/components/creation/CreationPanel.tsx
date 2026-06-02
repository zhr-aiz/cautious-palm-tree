import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PromptInput from './PromptInput';
import ModeSelector from './ModeSelector';
import StylePicker from './StylePicker';
import SizeSelector from './SizeSelector';
import GenerateButton from './GenerateButton';
import ImageUpload from './ImageUpload';
import ReferenceSlider from './ReferenceSlider';
import PromptTemplateDrawer from './PromptTemplateDrawer';
import AdvancedSettingsPanel from './AdvancedSettingsPanel';
import BatchGenerateToggle from './BatchGenerateToggle';
import CustomTemplateSaveDialog from './CustomTemplateSaveDialog';
import { GenerationType, ImageSize, VideoResolution, PromptTemplate } from '../../types';
import { useGeneration } from '../../hooks/useGeneration';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { useQuotaGuard } from '../../hooks/useQuotaGuard';

/** Main creation panel that combines all generation controls */
const CreationPanel: React.FC = () => {
  const navigate = useNavigate();
  const { generate, isGenerating, currentTask, error, clearError } = useGeneration();
  const { guard, consume } = useQuotaGuard();

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<GenerationType>(GenerationType.TEXT_TO_IMAGE);
  const [style, setStyle] = useState('realistic');
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.SQUARE_1_1);
  const [videoResolution, setVideoResolution] = useState<VideoResolution>(VideoResolution.HD_720P);
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [referenceStrength, setReferenceStrength] = useState(0.7);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seed, setSeed] = useState(0);
  const [batchSize, setBatchSize] = useState(1);
  const [creativity, setCreativity] = useState(0.7);
  const [steps, setSteps] = useState(30);
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);

  const needsReference =
    mode === GenerationType.IMAGE_TO_IMAGE || mode === GenerationType.IMAGE_TO_VIDEO;

  const canGenerate =
    prompt.trim().length > 0 &&
    (!needsReference || referenceImageUrl.trim().length > 0) &&
    !isGenerating;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    // Check quota
    const quotaResult = guard(mode);
    if (!quotaResult.allowed) {
      return;
    }

    try {
      const config = {
        style,
        creativity,
        steps,
        ...(mode === GenerationType.TEXT_TO_IMAGE || mode === GenerationType.IMAGE_TO_IMAGE
          ? { imageSize }
          : { videoResolution }),
        ...(needsReference ? { referenceImageUrl, referenceStrength } : {}),
        ...(negativePrompt ? { negativePrompt } : {}),
        ...(seed > 0 ? { seed } : {}),
        ...(batchSize > 1 ? { batchSize } : {}),
      };

      const taskId = await generate(mode, prompt.trim(), config);

      // Consume quota after successful generation start
      consume(mode);

      navigate(`${ROUTES.RESULT.replace(':taskId', taskId)}`);
    } catch (err) {
      // Error is handled in the store
    }
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    setPrompt(template.prompt);
    setTemplateDrawerOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: 600,
        mx: 'auto',
        py: 3,
        px: 2,
        position: 'relative',
      }}
    >
      <ModeSelector value={mode} onChange={setMode} disabled={isGenerating} />

      {/* Prompt input with template drawer trigger */}
      <Box sx={{ position: 'relative' }}>
        <PromptInput value={prompt} onChange={setPrompt} disabled={isGenerating} />
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
          <Tooltip title="Prompt 模板">
            <IconButton
              size="small"
              onClick={() => setTemplateDrawerOpen(true)}
              sx={{ color: 'primary.main' }}
            >
              <BookmarkIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="保存为模板">
            <IconButton
              size="small"
              onClick={() => setSaveTemplateDialogOpen(true)}
              disabled={!prompt.trim()}
              sx={{ color: 'text.secondary' }}
            >
              <BookmarkIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Image upload + reference slider for image-to-* modes */}
      {needsReference && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ImageUpload
            value={referenceImageUrl}
            onChange={setReferenceImageUrl}
            disabled={isGenerating}
          />
          {referenceImageUrl && (
            <ReferenceSlider
              value={referenceStrength}
              onChange={setReferenceStrength}
              disabled={isGenerating}
            />
          )}
        </Box>
      )}

      <StylePicker value={style} onChange={setStyle} disabled={isGenerating} />

      <SizeSelector
        generationType={mode}
        imageSize={imageSize}
        videoResolution={videoResolution}
        onImageSizeChange={setImageSize}
        onVideoResolutionChange={setVideoResolution}
        disabled={isGenerating}
      />

      {/* Advanced settings */}
      <AdvancedSettingsPanel
        creativity={creativity}
        steps={steps}
        negativePrompt={negativePrompt}
        seed={seed}
        onCreativityChange={setCreativity}
        onStepsChange={setSteps}
        onNegativePromptChange={setNegativePrompt}
        onSeedChange={setSeed}
        disabled={isGenerating}
      />

      {/* Batch generate toggle */}
      <BatchGenerateToggle
        value={batchSize}
        onChange={setBatchSize}
        disabled={isGenerating}
      />

      <Divider />

      <GenerateButton
        onClick={handleGenerate}
        disabled={!canGenerate}
        isGenerating={isGenerating}
        progress={currentTask?.progress || 0}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={clearError} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Template drawer */}
      <PromptTemplateDrawer
        open={templateDrawerOpen}
        onClose={() => setTemplateDrawerOpen(false)}
        onSelect={handleTemplateSelect}
      />

      {/* Save template dialog */}
      <CustomTemplateSaveDialog
        open={saveTemplateDialogOpen}
        onClose={() => setSaveTemplateDialogOpen(false)}
        currentPrompt={prompt}
      />
    </Box>
  );
};

export default CreationPanel;
