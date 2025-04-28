import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  SelectChangeEvent,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Add as AddIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useLessons, useStudents } from '../../hooks';
import LessonForm from '../lesson/LessonForm';
import LessonTimer from '../lesson/LessonTimer';
import LoadingIndicator from '../common/LoadingIndicator';
import EmptyState from '../common/EmptyState';
import { Lesson } from '../../services/db';
import { useLessonForm } from '../lesson/useLessonForm';
import ProgressDashboard from '../lesson/progress/ProgressDashboard';

/**
 * Lessons page component
 */
const LessonsPage: React.FC = () => {
  const { t } = useTranslation(['common', 'lessons']);
  const { students, loading: loadingStudents } = useStudents();
  const { lessons, loading: loadingLessons, addLesson } = useLessons();
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');

  // Get the lesson form context
  const {
    isOpen: openFormFromContext,
    setIsOpen: setOpenFormFromContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    preSelectedTopics,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    preSelectedSubTopics,
    preSelectedStudentId,
    setPreSelectedStudentId,
    resetForm,
  } = useLessonForm();

  // Local state for timer
  const [showTimer, setShowTimer] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timerStartTime, setTimerStartTime] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timerEndTime, setTimerEndTime] = useState<string>('');

  // Use context's isOpen for dialog visibility
  const openForm = openFormFromContext;

  // Set the preselected student as the selected student when it changes
  useEffect(() => {
    if (preSelectedStudentId) {
      setSelectedStudentId(preSelectedStudentId);
    }
  }, [preSelectedStudentId]);

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

  const handleStudentChange = (event: SelectChangeEvent<number | string>) => {
    const newStudentId = event.target.value as number | '';
    setSelectedStudentId(newStudentId);

    // Also update the preSelectedStudentId in the form context
    if (newStudentId !== '') {
      setPreSelectedStudentId(newStudentId as number);
    }
  };

  // Find the selected student object
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  if (loadingLessons || loadingStudents) {
    return <LoadingIndicator />;
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        {/* Page header with breadcrumbs when student is selected */}
        {selectedStudent ? (
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{ mb: 1 }}
            >
              <Link
                underline="hover"
                color="inherit"
                onClick={() => setSelectedStudentId('')}
                sx={{ cursor: 'pointer' }}
              >
                {t('navigation.lessons')}
              </Link>
              <Typography color="text.primary">{selectedStudent.name}</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4">{selectedStudent.name}</Typography>
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleStartTimer}
                  sx={{ mr: 1 }}
                >
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
          </Box>
        ) : (
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
          >
            <Typography variant="h4">{t('navigation.lessons')}</Typography>
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
        )}

        {/* Student Selection Dropdown (only show when no student is selected) */}
        {!selectedStudent && (
          <Paper sx={{ p: 2, mb: 4 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="student-select-label">{t('lessons:forms.studentLabel')}</InputLabel>
              <Select
                labelId="student-select-label"
                id="student-select"
                value={selectedStudentId}
                label={t('lessons:forms.studentLabel')}
                onChange={handleStudentChange}
              >
                <MenuItem value="">{t('lessons:forms.studentPlaceholder')}</MenuItem>
                {students.map(student => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )}

        {/* Display ProgressDashboard when a student is selected */}
        {selectedStudentId ? (
          <ProgressDashboard studentId={selectedStudentId as number} />
        ) : // Show default lessons list view when no student is selected
        lessons.length === 0 ? (
          <EmptyState
            title={t('emptyStates.noLessons')}
            message={t('lessons:emptyState.addYourFirst')}
            actionText={t('common:buttons.add')}
            onAction={handleOpenForm}
          />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">{t('lessons:recentLessons')}</Typography>
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
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default LessonsPage;
