import React, { useState, useMemo } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  PriorityHigh as HighPriorityIcon,
  Flag as MediumPriorityIcon,
  FiberManualRecord as LowPriorityIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { TopicProgress } from '../../../hooks/useProgressCalculation';
import { LearningStage } from '../../../services/db';
import { useLessonForm } from '../useLessonForm';

interface SessionStarterProps {
  open: boolean;
  onClose: () => void;
  onStartSession?: (topicIds: string[]) => void;
  suggestedTopics: TopicProgress[];
  studentId: number;
  studentName: string;
}

// Sessions durations in minutes
const SESSION_DURATIONS = [30, 45, 60, 90, 120];

// Priority levels for topics
type PriorityLevel = 'high' | 'medium' | 'low';

interface SuggestedTopic extends TopicProgress {
  priorityLevel: PriorityLevel;
}

const SessionStarter: React.FC<SessionStarterProps> = ({
  open,
  onClose,
  onStartSession,
  suggestedTopics,
  studentId,
  studentName,
}) => {
  const { t } = useTranslation(['common', 'lessons']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get the lesson form context
  const { openWithSelections } = useLessonForm();

  // States for customization
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedStage, setSelectedStage] = useState<LearningStage | 'all'>('all');
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  // Calculate topic priorities and initialize selected topics
  const prioritizedTopics = useMemo(() => {
    // Assign priority levels based on progress percentage
    const topics: SuggestedTopic[] = suggestedTopics.map(topic => {
      let priorityLevel: PriorityLevel;

      if (topic.progressPercent < 25) {
        priorityLevel = 'high';
      } else if (topic.progressPercent < 50) {
        priorityLevel = 'medium';
      } else {
        priorityLevel = 'low';
      }

      return {
        ...topic,
        priorityLevel,
      };
    });

    // Sort by priority (high to low) and then by progress (low to high)
    return topics.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priorityLevel] !== priorityOrder[b.priorityLevel]) {
        return priorityOrder[a.priorityLevel] - priorityOrder[b.priorityLevel];
      }
      return a.progressPercent - b.progressPercent;
    });
  }, [suggestedTopics]);

  // Initialize selected topics when dialog opens
  React.useEffect(() => {
    if (open) {
      // Select high priority topics by default (max 3)
      const highPriorityTopicIds = prioritizedTopics
        .filter(topic => topic.priorityLevel === 'high')
        .slice(0, 3)
        .map(topic => topic.topicId);

      setSelectedTopicIds(highPriorityTopicIds);
    }
  }, [open, prioritizedTopics]);

  // Filter topics by selected stage
  const filteredTopics = useMemo(() => {
    if (selectedStage === 'all') {
      return prioritizedTopics;
    }
    return prioritizedTopics.filter(topic => topic.stage === selectedStage);
  }, [prioritizedTopics, selectedStage]);

  // Calculate estimated session duration based on recommended minutes
  const estimatedDuration = useMemo(() => {
    return selectedTopicIds.reduce((total, topicId) => {
      const topic = prioritizedTopics.find(t => t.topicId === topicId);
      if (topic) {
        // If topic has more than selectedDuration minutes remaining, cap it at selectedDuration
        const topicDuration = Math.min(
          Math.ceil(topic.remainingMinutes / 2), // Use half of the remaining minutes per session
          selectedDuration / selectedTopicIds.length, // Divide the session time evenly
        );
        return total + topicDuration;
      }
      return total;
    }, 0);
  }, [selectedTopicIds, prioritizedTopics, selectedDuration]);

  // Handle topic selection/deselection
  const handleTopicToggle = (topicId: string) => {
    setSelectedTopicIds(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };

  // Handle session duration change
  const handleDurationChange = (event: SelectChangeEvent<number>) => {
    setSelectedDuration(event.target.value as number);
  };

  // Handle stage filter change
  const handleStageChange = (event: SelectChangeEvent<LearningStage | 'all'>) => {
    setSelectedStage(event.target.value as LearningStage | 'all');
  };

  // Start the session with selected topics
  const handleStartSession = () => {
    // Use context to open form with pre-selections if provided
    openWithSelections({
      topics: selectedTopicIds,
      studentId: studentId,
    });

    // For backward compatibility, call the callback if provided
    if (onStartSession) {
      onStartSession(selectedTopicIds);
    }

    onClose();
  };

  // Get color for priority level
  const getPriorityColor = (level: PriorityLevel): string => {
    switch (level) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Get icon for priority level
  const getPriorityIcon = (level: PriorityLevel) => {
    switch (level) {
      case 'high':
        return <HighPriorityIcon fontSize="small" color="error" />;
      case 'medium':
        return <MediumPriorityIcon fontSize="small" color="warning" />;
      case 'low':
        return <LowPriorityIcon fontSize="small" color="success" />;
      default:
        return null;
    }
  };

  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      hideBackdrop={!isMobile}
      disablePortal={!isMobile}
      sx={{
        '& .MuiDialog-paper': {
          minHeight: isMobile ? '100%' : '80vh',
          maxHeight: isMobile ? '100%' : '80vh',
          margin: isMobile ? 0 : 2,
          borderRadius: isMobile ? 0 : 2,
          position: isMobile ? 'fixed' : 'absolute',
          top: isMobile ? 0 : '10vh',
          left: isMobile ? 0 : undefined,
          right: isMobile ? 0 : undefined,
        },
      }}
    >
      <DialogTitle>
        {t('Start New Learning Session')}: {studentName}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          padding: 3,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          {t('Student')}: {studentName}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t(
            'This session will focus on topics that need the most practice based on progress data.',
          )}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('Suggested Topics')} ({estimatedDuration} {t('min')})
          </Typography>

          {/* Session configuration */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
              mb: 2,
            }}
          >
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel id="duration-select-label">{t('Duration')}</InputLabel>
              <Select
                labelId="duration-select-label"
                id="duration"
                value={selectedDuration}
                label={t('Duration')}
                onChange={handleDurationChange}
              >
                {SESSION_DURATIONS.map(duration => (
                  <MenuItem key={duration} value={duration}>
                    {duration} {t('minutes')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" size="small">
              <InputLabel id="stage-select-label">{t('Learning Stage')}</InputLabel>
              <Select
                labelId="stage-select-label"
                id="stage"
                value={selectedStage}
                label={t('Learning Stage')}
                onChange={handleStageChange}
              >
                <MenuItem value="all">{t('All Stages')}</MenuItem>
                <MenuItem value="kognitiivinen">{t('Kognitiivinen')}</MenuItem>
                <MenuItem value="assosiatiivinen">{t('Assosiatiivinen')}</MenuItem>
                <MenuItem value="automaattinen">{t('Automaattinen')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Selected topics summary */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {t('Estimated Duration')}: {formatTime(estimatedDuration)}
            </Typography>
            <Typography variant="body2">
              {t('Selected Topics')}: {selectedTopicIds.length}
            </Typography>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HighPriorityIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
              <Typography variant="caption">{t('High Priority')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MediumPriorityIcon fontSize="small" color="warning" sx={{ mr: 0.5 }} />
              <Typography variant="caption">{t('Medium Priority')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LowPriorityIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
              <Typography variant="caption">{t('Low Priority')}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Topics list */}
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {filteredTopics.map(topic => {
            const isSelected = selectedTopicIds.includes(topic.topicId);
            return (
              <Box
                key={topic.topicId}
                onClick={() => handleTopicToggle(topic.topicId)}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  borderLeft: `4px solid ${getPriorityColor(topic.priorityLevel)}`,
                  boxShadow: isSelected ? 2 : 0,
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getPriorityIcon(topic.priorityLevel)}
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {topic.topicLabel}
                  </Typography>
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ mr: 1 }}>
                      {topic.progressPercent}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={topic.progressPercent}
                      color={topic.color}
                      sx={{ flexGrow: 1, height: 6, borderRadius: 1 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">
                      {formatTime(topic.completedMinutes)} / {formatTime(topic.recommendedMinutes)}
                    </Typography>
                    <Chip
                      label={topic.stage}
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
                  </Box>
                </Box>
              </Box>
            );
          })}

          {filteredTopics.length === 0 && (
            <ListItem>
              <ListItemText
                primary={t('common:noResultsFound', 'No results found')}
                secondary={t('lessons:progress.tryDifferentFilter', 'Try a different filter')}
              />
            </ListItem>
          )}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('Cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartSession}
          disabled={selectedTopicIds.length === 0}
        >
          {t('Start Session')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionStarter;
