import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ResultPreview from '../components/result/ResultPreview';
import ResultActions from '../components/result/ResultActions';
import ResultCompare from '../components/result/ResultCompare';
import ShareDialog from '../components/result/ShareDialog';
import { useHistoryStore } from '../stores/historyStore';
import { useGenerationStore } from '../stores/generationStore';
import { GenerationTask, GenerationStatus, GenerationType } from '../types';
import { ROUTES } from '../utils/constants';

/** Result page for viewing a specific generation result */
const ResultPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Try to find task in active tasks first, then in history
  const activeTask = useGenerationStore((state) =>
    state.activeTasks.find((t) => t.id === taskId)
  );
  const historyTask = useHistoryStore((state) =>
    state.tasks.find((t) => t.id === taskId)
  );

  const task: GenerationTask | null = activeTask || historyTask || null;

  const handleRegenerate = () => {
    navigate(ROUTES.HOME);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!task) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            未找到该生成任务
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.HOME)}
            startIcon={<ArrowBackIcon />}
          >
            返回创作
          </Button>
        </Box>
      </Container>
    );
  }

  const result = task.results[0] || undefined;
  const needsCompare =
    (task.type === GenerationType.IMAGE_TO_IMAGE || task.type === GenerationType.IMAGE_TO_VIDEO) &&
    task.config.referenceImageUrl &&
    result?.mediaType === 'image';

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ textTransform: 'none' }}
        >
          返回
        </Button>
      </Box>

      {/* Comparison view for image-to-image results */}
      {needsCompare && task.config.referenceImageUrl && result && (
        <Box sx={{ mb: 2 }}>
          <ResultCompare
            originalUrl={task.config.referenceImageUrl}
            generatedUrl={result.mediaUrl}
            alt={task.prompt}
          />
        </Box>
      )}

      {/* Normal preview (shown when not in compare mode or not applicable) */}
      {!needsCompare && <ResultPreview task={task} />}

      {task.status === GenerationStatus.COMPLETED && (
        <Box sx={{ mt: 2 }}>
          <ResultActions
            task={task}
            result={result}
            onRegenerate={handleRegenerate}
            onShareToGallery={() => setShareDialogOpen(true)}
          />
        </Box>
      )}

      {/* Share dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        result={result}
        task={task}
      />
    </Container>
  );
};

export default ResultPage;
