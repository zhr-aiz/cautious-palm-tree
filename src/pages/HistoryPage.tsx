import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HistoryFilterBar from '../components/history/HistoryFilter';
import HistoryList from '../components/history/HistoryList';
import { useHistoryStore } from '../stores/historyStore';
import { HistoryFilter, MembershipTier } from '../types';
import { useMembershipStore } from '../stores/membershipStore';
import { MAX_FAVORITES } from '../utils/constants';

/** History page */
const HistoryPage: React.FC = () => {
  const filter = useHistoryStore((state) => state.filter);
  const setFilter = useHistoryStore((state) => state.setFilter);
  const getFilteredTasks = useHistoryStore((state) => state.getFilteredTasks);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const tasks = useHistoryStore((state) => state.tasks);
  const deleteTasks = useHistoryStore((state) => state.deleteTasks);
  const getFavoriteCount = useHistoryStore((state) => state.getFavoriteCount);
  const tier = useMembershipStore((state) => state.quotaState.tier);

  const filteredTasks = getFilteredTasks();
  const favoriteCount = getFavoriteCount();

  const handleFilterChange = (newFilter: HistoryFilter) => {
    setFilter(newFilter);
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      clearHistory();
    }
  };

  const handleDeleteFailed = () => {
    const failedTaskIds = tasks
      .filter((t) => t.status === 'FAILED')
      .map((t) => t.id);
    if (failedTaskIds.length === 0) return;
    if (window.confirm(`确定要删除 ${failedTaskIds.length} 条失败的记录吗？`)) {
      deleteTasks(failedTaskIds);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          历史记录
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {tasks.some((t) => t.status === 'FAILED') && (
            <Button
              variant="outlined"
              size="small"
              color="warning"
              onClick={handleDeleteFailed}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              清除失败记录
            </Button>
          )}
          {tasks.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={handleClearHistory}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              清空
            </Button>
          )}
        </Box>
      </Box>

      {/* Favorite count hint */}
      {favoriteCount > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            已收藏 {favoriteCount}/{MAX_FAVORITES} 条
            {favoriteCount >= MAX_FAVORITES && tier === MembershipTier.FREE && ' （免费用户上限）'}
          </Typography>
        </Box>
      )}

      {/* Filter */}
      <Box sx={{ mb: 3 }}>
        <HistoryFilterBar filter={filter} onFilterChange={handleFilterChange} />
      </Box>

      {/* Results count */}
      {filteredTasks.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          共 {filteredTasks.length} 条记录
        </Typography>
      )}

      {/* List */}
      <HistoryList tasks={filteredTasks} />
    </Container>
  );
};

export default HistoryPage;
