import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useLessons, useStudents } from '../../hooks';
import LessonForm from '../lesson/LessonForm';
import LessonTimer from '../lesson/LessonTimer';
import LoadingIndicator from '../common/LoadingIndicator';
import EmptyState from '../common/EmptyState';
import { Lesson } from '../../services/db';
import { useLessonForm } from '../lesson/LessonFormContext';

/**
 * Lessons page component
 */
const LessonsPage: React.FC = () => {
  const { t } = useTranslation(['common', 'lessons']);
  const { students, loading: loadingStudents } = useStudents();
  const { lessons, loading: loadingLessons, addLesson } = useLessons();

  // Get the lesson form context
  const {
    isOpen: openFormFromContext,
    setIsOpen: setOpenFormFromContext,
    preSelectedTopics,
    preSelectedSubTopics,
    preSelectedStudentId,
    resetForm,
  } = useLessonForm();

  // Local state for timer
  const [showTimer, setShowTimer] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<string>('');
  const [timerEndTime, setTimerEndTime] = useState<string>('');

  // Use context's isOpen for dialog visibility
  const openForm = openFormFromContext;

  const handleOpenForm = () => {
    setOpenFormFromContext(true);
  };

  const handleCloseForm = () => {
    setOpenFormFromContext(false);
    resetForm(); // Reset form state when closing
  };

  const handleStartTimer = () => {
    setShowTimer(true);
  };

  const handleSubmitLesson = async (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addLesson(lessonData);
      setOpenFormFromContext(false);
      resetForm(); // Reset form state after successful submission
    } catch (error) {
      console.error('Failed to add lesson', error);
    }
  };

  const handleTimeUpdate = (startTime: string, endTime: string, _durationSeconds: number) => {
    setTimerStartTime(startTime);
    setTimerEndTime(endTime);

    // Automatically open the form after stopping the timer
    setOpenFormFromContext(true);
  };

  if (loadingLessons || loadingStudents) {
    return <LoadingIndicator />;
  }

  // Find the pre-selected student object if available
  // const preSelectedStudent = preSelectedStudentId
  //   ? students.find(s => s.id === preSelectedStudentId)
  //   : undefined;

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('navigation.lessons')}
          </Typography>
          <Box>
            <Button variant="outlined" color="primary" onClick={handleStartTimer} sx={{ mr: 1 }}>
              {t('lessons:startTimer')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
            >
              {t('lessons:addLesson')}
            </Button>
          </Box>
        </Box>

        {lessons.length === 0 ? (
          <EmptyState
            title={t('emptyStates.noLessons')}
            message={t('lessons:emptyState.description')}
            actionText={t('lessons:addLesson')}
            onAction={handleOpenForm}
          />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                {t('lessons:recentLessons')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>{t('lessons:lessonsFeature')}</Typography>
              {/* Lesson list will be implemented here in the future */}
            </Grid>
          </Grid>
        )}

        {/* Timer Dialog */}
        <Dialog open={showTimer} onClose={() => setShowTimer(false)} fullWidth maxWidth="sm">
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{t('lessons:timer.title')}</Typography>
              <IconButton edge="end" onClick={() => setShowTimer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <LessonTimer onTimeUpdate={handleTimeUpdate} />
          </DialogContent>
        </Dialog>

        {/* Lesson Form Dialog */}
        <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{t('lessons:addLesson')}</Typography>
              <IconButton edge="end" onClick={handleCloseForm}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <LessonForm
              students={students}
              onSubmit={handleSubmitLesson}
              onCancel={handleCloseForm}
              initialTimes={{
                startTime: timerStartTime || undefined,
                endTime: timerEndTime || undefined,
              }}
              initialData={{
                studentId: preSelectedStudentId,
                topics: preSelectedTopics,
                subTopics: preSelectedSubTopics,
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default LessonsPage;
