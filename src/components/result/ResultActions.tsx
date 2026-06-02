import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import CollectionsIcon from '@mui/icons-material/Collections';
import { GenerationResult, GenerationTask } from '../../types';
import { useHistoryStore } from '../../stores/historyStore';

/** Result actions component for interacting with a result */
interface ResultActionsProps {
  task: GenerationTask;
  result?: GenerationResult;
  onRegenerate?: () => void;
  onShareToGallery?: () => void;
}

const ResultActions: React.FC<ResultActionsProps> = ({ task, result, onRegenerate, onShareToGallery }) => {
  const toggleFavorite = useHistoryStore((state) => state.toggleFavorite);
  const deleteTask = useHistoryStore((state) => state.deleteTask);

  const handleDownload = async () => {
    if (!result) return;

    try {
      let blob: Blob | null = null;

      if (result.mediaBlob) {
        blob = result.mediaBlob;
      } else if (result.mediaType === 'image') {
        const response = await fetch(result.mediaUrl);
        blob = await response.blob();
      }

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-media-${result.id}.${result.mediaType === 'image' ? 'png' : 'webm'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleShare = async () => {
    if (!result) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI 媒体创作',
          text: task.prompt,
          url: result.mediaUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(result.mediaUrl);
      } catch (err) {
        console.error('Copy to clipboard failed:', err);
      }
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      {result && (
        <IconButton
          onClick={() => toggleFavorite(task.id, result.id)}
          color={result.isFavorited ? 'secondary' : 'default'}
        >
          {result.isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      )}

      <Tooltip title="下载">
        <IconButton onClick={handleDownload} disabled={!result}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="分享链接">
        <IconButton onClick={handleShare} disabled={!result}>
          <ShareIcon />
        </IconButton>
      </Tooltip>

      {/* Share to gallery button */}
      <Tooltip title="分享到广场">
        <IconButton
          onClick={onShareToGallery}
          disabled={!result || !!result.isShared}
          color={result?.isShared ? 'success' : 'default'}
        >
          <CollectionsIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="重新生成">
        <IconButton onClick={onRegenerate} color="primary">
          <ReplayIcon />
        </IconButton>
      </Tooltip>

      <Box sx={{ flex: 1 }} />

      <Tooltip title="删除">
        <IconButton onClick={handleDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ResultActions;
