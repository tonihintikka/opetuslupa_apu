import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LearningStage, Lesson } from '../../../services/db';
import { useProgressCalculation } from '../../../hooks/useProgressCalculation';

interface ProgressMatrixProps {
  lessons: Lesson[];
  studentId?: number;
}

// Define sorting options
type SortField = 'label' | 'stage' | 'completed' | 'remaining' | 'progress';
type SortDirection = 'asc' | 'desc';

const ProgressMatrix: React.FC<ProgressMatrixProps> = ({ lessons, studentId }) => {
  const { t } = useTranslation(['common', 'lessons']);
  const { topicProgress, getProgressByStage, getOverallProgress } = useProgressCalculation(
    studentId ? lessons.filter(l => l.studentId === studentId) : lessons,
  );

  // State for filters and sort
  const [stageFilter, setStageFilter] = useState<LearningStage | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'progress',
    direction: 'asc',
  });

  // Filter and sort data
  const filteredTopics = useMemo(() => {
    let filtered = [...topicProgress];

    // Apply stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(topic => topic.stage === stageFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        topic => topic.topicLabel.toLowerCase().includes(term) || topic.topicId.includes(term),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case 'label':
          comparison = a.topicLabel.localeCompare(b.topicLabel);
          break;
        case 'stage':
          comparison = a.stage.localeCompare(b.stage);
          break;
        case 'completed':
          comparison = a.completedMinutes - b.completedMinutes;
          break;
        case 'remaining':
          comparison = a.remainingMinutes - b.remainingMinutes;
          break;
        case 'progress':
          comparison = a.progressPercent - b.progressPercent;
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [topicProgress, stageFilter, searchTerm, sortConfig]);

  // Get stage statistics
  const stageStats = useMemo(() => {
    const stages: LearningStage[] = ['kognitiivinen', 'assosiatiivinen', 'automaattinen'];
    return stages.map(stage => {
      const stageTopics = getProgressByStage(stage);
      const completed = stageTopics.reduce((sum, topic) => sum + topic.completedMinutes, 0);
      const recommended = stageTopics.reduce((sum, topic) => sum + topic.recommendedMinutes, 0);
      const progress = recommended > 0 ? Math.round((completed / recommended) * 100) : 0;

      return {
        stage,
        completed,
        recommended,
        progress,
      };
    });
  }, [getProgressByStage]);

  // Handle sort change
  const handleSortChange = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Get icon for progress color
  const getProgressIcon = (color: 'success' | 'warning' | 'error') => {
    switch (color) {
      case 'success':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'warning':
        return <WarningIcon fontSize="small" color="warning" />;
      case 'error':
        return <ErrorIcon fontSize="small" color="error" />;
      default:
        return null;
    }
  };

  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  // Get label for learning stage
  const getStageName = (stage: LearningStage) => {
    return t(`lessons:stages.${stage}`, stage);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t('lessons:progress.title', 'Progress Matrix')}
      </Typography>

      {/* Summary stats */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('lessons:progress.overallProgress', 'Overall Progress:')} {getOverallProgress()}%
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
          {stageStats.map(stat => (
            <Paper key={stat.stage} sx={{ p: 2, flex: '1 1 0', minWidth: 180 }}>
              <Typography variant="subtitle2">{getStageName(stat.stage)}</Typography>
              <LinearProgress
                variant="determinate"
                value={stat.progress}
                sx={{ mt: 1, mb: 1, height: 8, borderRadius: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {stat.progress}% ({formatTime(stat.completed)} / {formatTime(stat.recommended)})
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
          alignItems: 'center',
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="stage-filter-label">
            {t('lessons:progress.filterByStage', 'Filter by Stage')}
          </InputLabel>
          <Select
            labelId="stage-filter-label"
            value={stageFilter}
            label={t('lessons:progress.filterByStage', 'Filter by Stage')}
            onChange={e => setStageFilter(e.target.value as LearningStage | 'all')}
            startAdornment={
              <InputAdornment position="start">
                <FilterIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="all">{t('common:all', 'All')}</MenuItem>
            <MenuItem value="kognitiivinen">{t('lessons:stages.kognitiivinen')}</MenuItem>
            <MenuItem value="assosiatiivinen">{t('lessons:stages.assosiatiivinen')}</MenuItem>
            <MenuItem value="automaattinen">{t('lessons:stages.automaattinen')}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label={t('common:search', 'Search')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('lessons:progress.showingTopics', 'Showing {{count}} topics', {
              count: filteredTopics.length,
            })}
          </Typography>
        </Box>
      </Box>

      {/* Main Table */}
      <TableContainer component={Paper}>
        <Table aria-label="progress matrix table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => handleSortChange('label')}
                >
                  {t('lessons:progress.topic', 'Topic')}
                  <SortIcon
                    fontSize="small"
                    sx={{
                      ml: 0.5,
                      transform:
                        sortConfig.field === 'label' && sortConfig.direction === 'desc'
                          ? 'rotate(180deg)'
                          : 'none',
                      opacity: sortConfig.field === 'label' ? 1 : 0.3,
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => handleSortChange('stage')}
                >
                  {t('lessons:progress.stage', 'Stage')}
                  <SortIcon
                    fontSize="small"
                    sx={{
                      ml: 0.5,
                      transform:
                        sortConfig.field === 'stage' && sortConfig.direction === 'desc'
                          ? 'rotate(180deg)'
                          : 'none',
                      opacity: sortConfig.field === 'stage' ? 1 : 0.3,
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSortChange('completed')}
                >
                  {t('lessons:progress.completed', 'Completed')}
                  <SortIcon
                    fontSize="small"
                    sx={{
                      ml: 0.5,
                      transform:
                        sortConfig.field === 'completed' && sortConfig.direction === 'desc'
                          ? 'rotate(180deg)'
                          : 'none',
                      opacity: sortConfig.field === 'completed' ? 1 : 0.3,
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell align="right">
                {t('lessons:progress.recommended', 'Recommended')}
              </TableCell>
              <TableCell align="right">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSortChange('remaining')}
                >
                  {t('lessons:progress.remaining', 'Remaining')}
                  <SortIcon
                    fontSize="small"
                    sx={{
                      ml: 0.5,
                      transform:
                        sortConfig.field === 'remaining' && sortConfig.direction === 'desc'
                          ? 'rotate(180deg)'
                          : 'none',
                      opacity: sortConfig.field === 'remaining' ? 1 : 0.3,
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSortChange('progress')}
                >
                  {t('lessons:progress.progress', 'Progress')}
                  <SortIcon
                    fontSize="small"
                    sx={{
                      ml: 0.5,
                      transform:
                        sortConfig.field === 'progress' && sortConfig.direction === 'desc'
                          ? 'rotate(180deg)'
                          : 'none',
                      opacity: sortConfig.field === 'progress' ? 1 : 0.3,
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                {t('lessons:progress.lastPracticed', 'Last Practiced')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTopics.map(topic => (
              <TableRow key={topic.topicId}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getProgressIcon(topic.color)}
                    <Typography variant="body2">{topic.topicLabel}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStageName(topic.stage)}
                    size="small"
                    variant="outlined"
                    color={
                      topic.stage === 'kognitiivinen'
                        ? 'primary'
                        : topic.stage === 'assosiatiivinen'
                          ? 'secondary'
                          : 'default'
                    }
                  />
                </TableCell>
                <TableCell align="right">{formatTime(topic.completedMinutes)}</TableCell>
                <TableCell align="right">{formatTime(topic.recommendedMinutes)}</TableCell>
                <TableCell align="right">{formatTime(topic.remainingMinutes)}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={topic.progressPercent}
                      color={topic.color}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="body2">{topic.progressPercent}%</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {topic.lastPracticed ? (
                    topic.lastPracticed.toLocaleDateString()
                  ) : (
                    <Chip label={t('common:never', 'Never')} size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredTopics.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    {t('common:noResultsFound', 'No results found')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CheckCircleIcon fontSize="small" color="success" />
          <Typography variant="body2">
            {t('lessons:progress.good', '≥ 75% (Good progress)')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <WarningIcon fontSize="small" color="warning" />
          <Typography variant="body2">
            {t('lessons:progress.medium', '≥ 50% (Making progress)')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ErrorIcon fontSize="small" color="error" />
          <Typography variant="body2">
            {t('lessons:progress.needsAttention', '< 50% (Needs attention)')}
          </Typography>
        </Box>
        <Tooltip
          title={t(
            'lessons:progress.helpText',
            'The progress matrix shows your progress in each driving lesson topic. The recommended time is an estimate of how much practice is needed.',
          )}
        >
          <IconButton size="small" sx={{ ml: 'auto' }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ProgressMatrix;
