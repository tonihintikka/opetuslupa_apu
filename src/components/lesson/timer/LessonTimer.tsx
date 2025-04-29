import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface LessonTimerProps {
  initialTime?: number; // Initial time in seconds (for editing existing lesson)
  onTimeUpdate: (startTime: string, endTime: string, durationSeconds: number) => void;
}

const LessonTimer: React.FC<LessonTimerProps> = ({ initialTime = 0, onTimeUpdate }) => {
  const { t } = useTranslation(['common', 'lessons']);
  const [seconds, setSeconds] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editHours, setEditHours] = useState<number>(0);
  const [editMinutes, setEditMinutes] = useState<number>(0);

  const timerRef = useRef<number | null>(null);

  // Format seconds as HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0'),
    ].join(':');
  };

  // Format time for lesson data (HH:MM)
  const formatTimeForData = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Start timer
  const handleStart = (): void => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);

      const now = new Date();
      if (!startedAt) {
        setStartedAt(now);
      }

      timerRef.current = window.setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  // Pause timer
  const handlePause = (): void => {
    if (isRunning && !isPaused) {
      clearInterval(timerRef.current!);
      timerRef.current = null;
      setIsPaused(true);
    } else if (isPaused) {
      handleStart(); // Resume
    }
  };

  // Stop timer
  const handleStop = (): void => {
    if (isRunning || isPaused) {
      clearInterval(timerRef.current!);
      timerRef.current = null;
      setIsRunning(false);
      setIsPaused(false);

      // Calculate start and end times
      if (startedAt) {
        const endTime = new Date();
        onTimeUpdate(formatTimeForData(startedAt), formatTimeForData(endTime), seconds);
      }
    }
  };

  // Open edit dialog
  const handleEdit = (): void => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    setEditHours(hours);
    setEditMinutes(minutes);
    setEditDialogOpen(true);
  };

  // Save edited time
  const handleSaveEdit = (): void => {
    const newSeconds = editHours * 3600 + editMinutes * 60;
    setSeconds(newSeconds);
    setEditDialogOpen(false);

    // Update lesson times if the timer has been started before
    if (startedAt) {
      const now = new Date();
      const calculatedStartTime = new Date(now.getTime() - newSeconds * 1000);
      setStartedAt(calculatedStartTime);

      onTimeUpdate(formatTimeForData(calculatedStartTime), formatTimeForData(now), newSeconds);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: isRunning && !isPaused ? 'success.lighter' : 'background.paper',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" gutterBottom>
          {t('lessons:timer.title', 'Lesson Timer')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Typography
            variant="h3"
            component="div"
            sx={{ fontFamily: 'monospace', letterSpacing: 1 }}
          >
            {formatTime(seconds)}
          </Typography>
          <IconButton
            size="small"
            onClick={handleEdit}
            sx={{ position: 'absolute', right: -30 }}
            title={t('lessons:timer.editTime', 'Edit Time')}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          {!isRunning ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<StartIcon />}
              onClick={handleStart}
              fullWidth
            >
              {t('lessons:timer.start', 'Start')}
            </Button>
          ) : (
            <>
              <Button
                variant={isPaused ? 'outlined' : 'contained'}
                color={isPaused ? 'primary' : 'warning'}
                startIcon={isPaused ? <StartIcon /> : <PauseIcon />}
                onClick={handlePause}
                fullWidth
              >
                {isPaused ? t('lessons:timer.resume', 'Resume') : t('lessons:timer.pause', 'Pause')}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                onClick={handleStop}
                fullWidth
              >
                {t('lessons:timer.stop', 'Stop')}
              </Button>
            </>
          )}
        </Stack>

        {(isRunning || seconds > 0) && (
          <Typography variant="caption" align="center">
            {startedAt
              ? `${t('lessons:timer.started', 'Started')}: ${startedAt.toLocaleTimeString()}`
              : t('lessons:timer.notStarted', 'Not started yet')}
          </Typography>
        )}
      </Stack>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>{t('lessons:timer.editTime', 'Edit Time')}</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('lessons:timer.hours', 'Hours')}
              type="number"
              value={editHours}
              onChange={e => setEditHours(Math.max(0, parseInt(e.target.value) || 0))}
              InputProps={{ inputProps: { min: 0, max: 24 } }}
            />
            <TextField
              label={t('lessons:timer.minutes', 'Minutes')}
              type="number"
              value={editMinutes}
              onChange={e =>
                setEditMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))
              }
              InputProps={{ inputProps: { min: 0, max: 59 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            {t('common:buttons.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            {t('common:buttons.save', 'Save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default LessonTimer;
