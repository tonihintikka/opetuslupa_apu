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
  Tabs,
  Tab,
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
import TeachingTips from '../lesson/tips/TeachingTips';
import { useLocation } from 'react-router-dom';

/**
 * Lessons page component
 */
const LessonsPage: React.FC = () => {
  const { t } = useTranslation(['common', 'lessons']);
  const { students, loading: loadingStudents } = useStudents();
  const { lessons, loading: loadingLessons, addLesson } = useLessons();
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [activeTab, setActiveTab] = useState(0); // New state for active tab
  const location = useLocation();

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

  // Reset the active tab when navigating to the page directly (not through state)
  useEffect(() => {
    // If there's no redirectToStudentId in the state, and we're directly navigating to /lessons
    // This means we're coming from another main navigation item (like bottom nav or sidebar)
    if (!location.state && location.pathname === '/lessons') {
      setActiveTab(0);
    }
  }, [location.pathname, location]);

  // Handle redirect from MilestonesPage
  useEffect(() => {
    const state = location.state as { redirectToStudentId?: number; activeTab?: number } | null;
    if (state?.redirectToStudentId) {
      setSelectedStudentId(state.redirectToStudentId);
      if (state.activeTab !== undefined) {
        setActiveTab(state.activeTab);
      }
      // Clear location state to prevent redirect on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
    setActiveTab(0); // Reset to first tab when changing student

    // Also update the preSelectedStudentId in the form context
    if (newStudentId !== '') {
      setPreSelectedStudentId(newStudentId as number);
    }
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Find the selected student object
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  if (loadingLessons || loadingStudents) {
    return <LoadingIndicator />;
  }

  return (
    <Container disableGutters maxWidth={false}>
      <Box sx={{ py: 4, overflowX: 'hidden', width: '100%' }}>
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
                onClick={() => {
                  setSelectedStudentId('');
                  setActiveTab(0); // Reset tab when navigating back
                }}
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

        {/* Display Tabs and content when a student is selected */}
        {selectedStudentId ? (
          <Box sx={{ width: '100%' }}>
            {/* Only show tabs when not in the Teaching Tips view */}
            {activeTab !== 2 && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="student progress tabs"
                >
                  <Tab
                    label={t('lessons:tabs.overview', 'Overview')}
                    id="tab-0"
                    aria-controls="tabpanel-0"
                  />
                  <Tab
                    label={t('lessons:tabs.topics', 'Topics')}
                    id="tab-1"
                    aria-controls="tabpanel-1"
                  />
                  <Tab
                    label={t('lessons:tabs.tips', 'Tips')}
                    id="tab-2"
                    aria-controls="tabpanel-2"
                  />
                </Tabs>
              </Box>
            )}

            {/* Tab content panels */}
            <Box role="tabpanel" hidden={activeTab !== 0} id="tabpanel-0" aria-labelledby="tab-0">
              {activeTab === 0 && <ProgressDashboard studentId={selectedStudentId as number} />}
            </Box>

            <Box role="tabpanel" hidden={activeTab !== 1} id="tabpanel-1" aria-labelledby="tab-1">
              {activeTab === 1 && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    {t('lessons:tabs.topicsContent', 'Topics View')}
                  </Typography>
                  <Typography>
                    {t(
                      'lessons:tabs.topicsDescription',
                      'Detailed view of student progress by topic will be displayed here.',
                    )}
                  </Typography>
                </Paper>
              )}
            </Box>

            <Box role="tabpanel" hidden={activeTab !== 2} id="tabpanel-2" aria-labelledby="tab-2">
              {activeTab === 2 && <TeachingTips />}
            </Box>
          </Box>
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
