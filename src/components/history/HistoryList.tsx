import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GenerationTask } from '../../types';
import HistoryItem from './HistoryItem';

/** History list component */
interface HistoryListProps {
  tasks: GenerationTask[];
  emptyMessage?: string;
}

const HistoryList: React.FC<HistoryListProps> = ({
  tasks,
  emptyMessage = '暂无历史记录',
}) => {
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
          {emptyMessage}
        </Typography>
        <Typography variant="body2">
          开始创作，你的历史记录将在这里展示
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {tasks.map((task) => (
        <HistoryItem key={task.id} task={task} />
      ))}
    </Box>
  );
};

export default HistoryList;
