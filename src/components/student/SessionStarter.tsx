import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TopicProgress } from '../../hooks/useProgressCalculation';
import { useLessonForm } from '../lesson/useLessonForm';
import useDraftLessons from '../../hooks/useDraftLessons';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface SessionStarterProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  studentName: string;
  topicProgress: TopicProgress[];
}

// Session durations in minutes
const SESSION_DURATIONS = [30, 45, 60, 90, 120];

// Learning stages
const LEARNING_STAGES = [
  { value: 'kognitiivinen', label: 'Kognitiivinen' },
  { value: 'assosiatiivinen', label: 'Assosiatiivinen' },
  { value: 'automaattinen', label: 'Automaattinen' },
];

export function SessionStarter({
  open,
  onClose,
  studentId,
  studentName,
  topicProgress,
}: SessionStarterProps) {
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedStage, setSelectedStage] = useState<string>('');

  const { loading, error, createSessionDraft } = useDraftLessons();

  const {
    setIsOpen: setLessonFormOpen,
    setPreSelectedTopics,
    setPreSelectedStudentId,
    setDraftId,
  } = useLessonForm();

  // Calculate prioritized topics
  const prioritizedTopics = useMemo(() => {
    // Sort topics by lowest progress percentage first
    const sorted = [...topicProgress]
      .filter(
        topic =>
          // If a stage is selected, filter by that stage
          !selectedStage || topic.stage === selectedStage,
      )
      .sort((a, b) => a.progressPercent - b.progressPercent);

    // Calculate how many topics can fit in the selected duration
    let remainingMinutes = selectedDuration;
    const selectedTopics: TopicProgress[] = [];

    for (const topic of sorted) {
      const topicNeededMinutes = Math.max(0, topic.recommendedMinutes - topic.completedMinutes);

      if (topicNeededMinutes > 0 && remainingMinutes > 0) {
        selectedTopics.push(topic);
        remainingMinutes -= topicNeededMinutes;

        // Stop if we've filled the session duration
        if (remainingMinutes <= 0) break;
      }
    }

    return selectedTopics;
  }, [topicProgress, selectedDuration, selectedStage]);

  // Calculate the actual estimated duration based on selected topics
  const estimatedDuration = useMemo(() => {
    return prioritizedTopics.reduce((total, topic) => {
      const neededMinutes = Math.max(0, topic.recommendedMinutes - topic.completedMinutes);
      return total + neededMinutes;
    }, 0);
  }, [prioritizedTopics]);

  // Handler for starting the session
  const handleStartSession = async () => {
    try {
      // Get topic IDs from prioritized topics
      const topicIds = prioritizedTopics.map(topic => topic.topicId);

      // Create a session draft in the database
      const draftId = await createSessionDraft(
        studentId,
        topicIds,
        [], // No sub-topics for now
        selectedStage || undefined,
      );

      // Set up the lesson form context
      setPreSelectedStudentId(studentId);
      setPreSelectedTopics(topicIds);
      setDraftId(draftId);

      // Close this dialog
      onClose();

      // Open the lesson form
      setLessonFormOpen(true);
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  // Reset form state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedDuration(60);
      setSelectedStage('');
    }
  }, [open]);

  // Render priority indicator based on progress percentage
  const renderPriorityIndicator = (progress: number) => {
    if (progress < 30) {
      return <PriorityHighIcon color="error" />;
    } else if (progress < 70) {
      return <WarningIcon color="warning" />;
    } else {
      return <KeyboardArrowRightIcon color="success" />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('Start New Learning Session')}</DialogTitle>

      <DialogContent>
        {loading && <CircularProgress />}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('Student')}: {studentName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t(
              'This session will focus on topics that need the most practice based on progress data.',
            )}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>{t('Duration')}</InputLabel>
            <Select
              value={selectedDuration}
              onChange={e => setSelectedDuration(Number(e.target.value))}
              label={t('Duration')}
            >
              {SESSION_DURATIONS.map(duration => (
                <MenuItem key={duration} value={duration}>
                  {duration} {t('minutes')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>{t('Learning Stage')}</InputLabel>
            <Select
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value as string)}
              label={t('Learning Stage')}
            >
              <MenuItem value="">
                <em>{t('All Stages')}</em>
              </MenuItem>
              {LEARNING_STAGES.map(stage => (
                <MenuItem key={stage.value} value={stage.value}>
                  {t(stage.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {t('Suggested Topics')}
            <Chip
              label={`${estimatedDuration} ${t('min')}`}
              color="primary"
              size="small"
              icon={<AccessTimeIcon />}
              sx={{ ml: 1 }}
            />
          </Typography>

          {prioritizedTopics.length === 0 ? (
            <Alert severity="info">
              {t(
                'No topics match the current criteria. Try changing the learning stage or duration.',
              )}
            </Alert>
          ) : (
            <List dense>
              {prioritizedTopics.map(topic => {
                const neededMinutes = Math.max(
                  0,
                  topic.recommendedMinutes - topic.completedMinutes,
                );

                return (
                  <ListItem key={topic.topicId}>
                    <ListItemIcon>{renderPriorityIndicator(topic.progressPercent)}</ListItemIcon>
                    <ListItemText
                      primary={t(topic.topicLabel)}
                      secondary={`${topic.progressPercent}% ${t('complete')} • ${t('Need')} ${neededMinutes} ${t('min')}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('Cancel')}
        </Button>
        <Button
          onClick={handleStartSession}
          variant="contained"
          color="primary"
          disabled={loading || prioritizedTopics.length === 0}
        >
          {t('Start Session')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SessionStarter;
