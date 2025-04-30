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
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface LessonTimerProps {
  onChange?: (durationInMinutes: number) => void;
  initialDuration?: number; // in minutes
  onTimeUpdate?: (startTime: string, endTime: string, durationSeconds: number) => void;
}

export default function LessonTimer({
  onChange,
  initialDuration = 0,
  onTimeUpdate,
}: LessonTimerProps) {
  const { t } = useTranslation('lessons');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(initialDuration * 60);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editHours, setEditHours] = useState(Math.floor(seconds / 3600));
  const [editMinutes, setEditMinutes] = useState(Math.floor((seconds % 3600) / 60));

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to hh:mm:ss
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  };

  // Handle timer control
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);

    // Round to nearest minute for the form
    const durationInMinutes = Math.round(seconds / 60);
    if (onChange) {
      onChange(durationInMinutes);
    }

    // Use onTimeUpdate if provided
    if (onTimeUpdate) {
      // Generate start and end times for LessonsPage compatibility
      const now = new Date();
      const endTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Calculate start time by subtracting seconds from now
      const startDate = new Date(now.getTime() - seconds * 1000);
      const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;

      onTimeUpdate(startTime, endTime, seconds);
    }
  };

  const openEditDialog = () => {
    setEditHours(Math.floor(seconds / 3600));
    setEditMinutes(Math.floor((seconds % 3600) / 60));
    setEditDialogOpen(true);
    pauseTimer();
  };

  const handleSaveTime = () => {
    const newSeconds = editHours * 3600 + editMinutes * 60;
    setSeconds(newSeconds);
    setEditDialogOpen(false);

    // Notify parent of change
    if (onChange) {
      onChange(editHours * 60 + editMinutes);
    }

    // Use onTimeUpdate if provided
    if (onTimeUpdate) {
      // Generate appropriate times for manual entry
      const now = new Date();
      const endTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Calculate start time based on edited duration
      const startDate = new Date(now.getTime() - newSeconds * 1000);
      const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;

      onTimeUpdate(startTime, endTime, newSeconds);
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

  // Update parent component whenever timer stops
  useEffect(() => {
    if (!isRunning && seconds > 0) {
      const durationInMinutes = Math.round(seconds / 60);
      if (onChange) {
        onChange(durationInMinutes);
      }
    }
  }, [isRunning, seconds, onChange]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 2,
        mb: 2,
        borderRadius: 2,
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            {t('timer.title')}
          </Typography>
          <IconButton
            onClick={openEditDialog}
            color="primary"
            size="small"
            aria-label={t('timer.editTime')}
          >
            <EditIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h3"
          component="div"
          align="center"
          sx={{
            fontFamily: 'monospace',
            letterSpacing: 1,
            fontWeight: 'medium',
          }}
        >
          {formatTime(seconds)}
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center">
          {!isRunning ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayIcon />}
              onClick={startTimer}
              disabled={isRunning}
            >
              {seconds > 0 ? t('timer.resume') : t('timer.start')}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PauseIcon />}
              onClick={pauseTimer}
              disabled={!isRunning}
            >
              {t('timer.pause')}
            </Button>
          )}

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<StopIcon />}
            onClick={stopTimer}
            disabled={seconds === 0}
          >
            {t('timer.stop')}
          </Button>
        </Stack>
      </Stack>

      {/* Time Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>{t('timer.editTime')}</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('timer.hours')}
              type="number"
              InputProps={{ inputProps: { min: 0, max: 10 } }}
              value={editHours}
              onChange={e => setEditHours(parseInt(e.target.value) || 0)}
              fullWidth
            />
            <TextField
              label={t('timer.minutes')}
              type="number"
              InputProps={{ inputProps: { min: 0, max: 59 } }}
              value={editMinutes}
              onChange={e => setEditMinutes(parseInt(e.target.value) || 0)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            {t('timer.cancel')}
          </Button>
          <Button onClick={handleSaveTime} color="primary" variant="contained">
            {t('timer.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
