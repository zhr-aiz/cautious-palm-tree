import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GenerationType, GenerationStatus, HistoryFilter } from '../../types';
import { GENERATION_TYPE_LABELS } from '../../utils/constants';

/** History filter component */
interface HistoryFilterProps {
  filter: HistoryFilter;
  onFilterChange: (filter: HistoryFilter) => void;
}

const HistoryFilterBar: React.FC<HistoryFilterProps> = ({ filter, onFilterChange }) => {
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, keyword: e.target.value || undefined });
  };

  const handleFavoritesOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, favoritesOnly: e.target.checked || undefined });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="搜索历史记录..."
        value={filter.keyword || ''}
        onChange={handleKeywordChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
          },
        }}
      />

      {/* Type filter using Chips */}
      <Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          <Chip
            label="全部"
            variant={!filter.type ? 'filled' : 'outlined'}
            color={!filter.type ? 'primary' : 'default'}
            onClick={() => onFilterChange({ ...filter, type: undefined })}
            size="small"
            sx={{ borderRadius: 2 }}
          />
          {Object.entries(GENERATION_TYPE_LABELS).map(([key, label]) => (
            <Chip
              key={key}
              label={label}
              variant={filter.type === key ? 'filled' : 'outlined'}
              color={filter.type === key ? 'primary' : 'default'}
              onClick={() => onFilterChange({ ...filter, type: key as GenerationType })}
              size="small"
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </Box>

      {/* Status filter using Chips */}
      <Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          <Chip
            label="全部状态"
            variant={!filter.status ? 'filled' : 'outlined'}
            color={!filter.status ? 'primary' : 'default'}
            onClick={() => onFilterChange({ ...filter, status: undefined })}
            size="small"
            sx={{ borderRadius: 2 }}
          />
          <Chip
            label="已完成"
            variant={filter.status === GenerationStatus.COMPLETED ? 'filled' : 'outlined'}
            color={filter.status === GenerationStatus.COMPLETED ? 'primary' : 'default'}
            onClick={() => onFilterChange({ ...filter, status: GenerationStatus.COMPLETED })}
            size="small"
            sx={{ borderRadius: 2 }}
          />
          <Chip
            label="生成中"
            variant={filter.status === GenerationStatus.PROCESSING ? 'filled' : 'outlined'}
            color={filter.status === GenerationStatus.PROCESSING ? 'primary' : 'default'}
            onClick={() => onFilterChange({ ...filter, status: GenerationStatus.PROCESSING })}
            size="small"
            sx={{ borderRadius: 2 }}
          />
          <Chip
            label="失败"
            variant={filter.status === GenerationStatus.FAILED ? 'filled' : 'outlined'}
            color={filter.status === GenerationStatus.FAILED ? 'primary' : 'default'}
            onClick={() => onFilterChange({ ...filter, status: GenerationStatus.FAILED })}
            size="small"
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>

      {/* Favorites only filter */}
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={!!filter.favoritesOnly}
              onChange={handleFavoritesOnlyChange}
              icon={<FavoriteIcon sx={{ fontSize: 18 }} />}
              checkedIcon={<FavoriteIcon sx={{ fontSize: 18, color: 'secondary.main' }} />}
              size="small"
            />
          }
          label="仅显示收藏"
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
        />
      </Box>
    </Box>
  );
};

export default HistoryFilterBar;
