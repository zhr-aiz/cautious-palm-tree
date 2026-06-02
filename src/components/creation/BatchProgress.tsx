import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';

/** Single batch progress item */
interface BatchProgressItem {
  id: string;
  index: number;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

/** Props for BatchProgress */
interface BatchProgressProps {
  items: BatchProgressItem[];
  total: number;
}

/** Batch progress component — shows progress for multiple generation tasks */
const BatchProgress: React.FC<BatchProgressProps> = ({ items, total }) => {
  const completedCount = items.filter((i) => i.status === 'completed').length;

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }} elevation={0}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          批量生成进度
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {completedCount}/{total} 完成
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                width: 40,
                flexShrink: 0,
                color: item.status === 'completed'
                  ? 'success.main'
                  : item.status === 'failed'
                  ? 'error.main'
                  : 'text.secondary',
              }}
            >
              #{item.index + 1}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={item.progress}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: item.status === 'failed'
                    ? 'error.main'
                    : item.status === 'completed'
                    ? 'success.main'
                    : 'primary.main',
                },
              }}
            />
            <Typography variant="caption" sx={{ width: 35, textAlign: 'right', flexShrink: 0 }}>
              {item.status === 'completed' ? '✓' : item.status === 'failed' ? '✗' : `${item.progress}%`}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default BatchProgress;
export type { BatchProgressItem };
