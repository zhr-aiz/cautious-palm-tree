import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ResultCard from './ResultCard';
import { GenerationTask, GenerationResult } from '../../types';
import { useHistoryStore } from '../../stores/historyStore';

/** Result grid component for displaying multiple results */
interface ResultGridProps {
  tasks: GenerationTask[];
  onResultClick?: (result: GenerationResult) => void;
}

const ResultGrid: React.FC<ResultGridProps> = ({ tasks, onResultClick }) => {
  const toggleFavorite = useHistoryStore((state) => state.toggleFavorite);

  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          color: 'text.secondary',
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          暂无生成结果
        </Typography>
        <Typography variant="body2">
          开始创作，你的作品将在这里展示
        </Typography>
      </Box>
    );
  }

  // Flatten tasks to get all results with their parent task
  const items: { task: GenerationTask; result: GenerationResult }[] = [];
  for (const task of tasks) {
    for (const result of task.results) {
      items.push({ task, result });
    }
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2,
        p: 1,
      }}
    >
      {items.map(({ task, result }) => (
        <ResultCard
          key={result.id}
          task={task}
          result={result}
          onFavoriteToggle={toggleFavorite}
          onClick={onResultClick}
        />
      ))}
    </Box>
  );
};

export default ResultGrid;
