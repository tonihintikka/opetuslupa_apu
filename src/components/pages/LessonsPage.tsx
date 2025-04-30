import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Add as AddIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  PersonAdd as PersonAddIcon,
  ChevronLeft as ChevronLeftIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import { useLessons, useStudents } from '../../hooks';
import LessonForm from '../lesson/LessonForm';
import LessonTimer from '../lesson/LessonTimer';
import LoadingIndicator from '../common/LoadingIndicator';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { students, loading: loadingStudents } = useStudents();
  const { loading: loadingLessons, addLesson } = useLessons();
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();

  // Use refs to track state changes and prevent loops
  const locationStateRef = useRef(location.state);
  const selectedStudentIdRef = useRef(selectedStudentId);

  // Get the lesson form context
  const {
    isOpen: openFormFromContext,
    setIsOpen: setOpenFormFromContext,
    preSelectedStudentId,
    setPreSelectedStudentId,
    resetForm,
  } = useLessonForm();

  // Local state for timer
  const [showTimer, setShowTimer] = useState(false);

  // Use context's isOpen for dialog visibility
  const openForm = openFormFromContext;

  // Reset the active tab when navigating to the page directly
  useEffect(() => {
    if (!location.state && location.pathname === '/lessons') {
      setActiveTab(0);
    }
  }, [location.pathname, location.state]);

  // Update ref when selectedStudentId changes
  useEffect(() => {
    selectedStudentIdRef.current = selectedStudentId;
  }, [selectedStudentId]);

  // Memoize the reset function with stable refs
  const resetStudentSelection = useCallback(() => {
    // Only reset if we actually have a selection
    if (selectedStudentIdRef.current !== '') {
      setSelectedStudentId('');
      setActiveTab(0);

      // Only update context if it has a value to avoid unnecessary renders
      if (preSelectedStudentId !== undefined) {
        setPreSelectedStudentId(undefined);
      }

      resetForm();
    }
  }, [resetForm, setPreSelectedStudentId, preSelectedStudentId]);

  // Handle location state changes
  useEffect(() => {
    // Early exit if location.state hasn't actually changed (reference equality)
    if (location.state === locationStateRef.current) return;

    // Update our ref
    locationStateRef.current = location.state;

    if (!location.state) return;

    const state = location.state as {
      redirectToStudentId?: number;
      activeTab?: number;
      forceReset?: boolean;
    };

    // Handle force reset from navigation
    if (state.forceReset) {
      resetStudentSelection();
      // Clear state to prevent re-processing
      window.history.replaceState({}, document.title);
      return;
    }

    // Handle normal redirect with student ID
    if (state.redirectToStudentId !== undefined) {
      setSelectedStudentId(state.redirectToStudentId);

      // Only update tab if explicitly provided in state
      if (state.activeTab !== undefined) {
        setActiveTab(state.activeTab);
      }

      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, resetStudentSelection]);

  // Sync with preSelectedStudentId from context, but only when it changes
  // and only if our local selection is different
  useEffect(() => {
    if (preSelectedStudentId && preSelectedStudentId !== selectedStudentIdRef.current) {
      setSelectedStudentId(preSelectedStudentId);
    }
  }, [preSelectedStudentId]);

  const handleOpenForm = () => {
    setOpenFormFromContext(true);
  };

  const handleCloseForm = () => {
    setOpenFormFromContext(false);
    resetForm();
  };

  const handleStartTimer = () => {
    setShowTimer(true);
  };

  const handleSubmitLesson = async (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addLesson(lessonData);
      setOpenFormFromContext(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add lesson', error);
    }
  };

  const handleTimeUpdate = (_startTime: string, _endTime: string, _durationSeconds: number) => {
    setOpenFormFromContext(true);
  };

  // Memoize the student select handler
  const handleStudentSelect = useCallback(
    (studentId: number) => {
      setSelectedStudentId(studentId);
      setActiveTab(0); // Reset to first tab when changing student

      // Only update context if the ID is different
      if (studentId !== preSelectedStudentId) {
        setPreSelectedStudentId(studentId);
      }
    },
    [preSelectedStudentId, setPreSelectedStudentId],
  );

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Find the selected student object
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  if (loadingLessons || loadingStudents) {
    return <LoadingIndicator />;
  }

  // Main content based on whether a student is selected or not
  const renderMainContent = () => {
    if (selectedStudent) {
      return (
        <Box sx={{ width: '100%' }}>
          {/* Breadcrumb navigation */}
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
                  setActiveTab(0);
                  // Reset context explicitly
                  setPreSelectedStudentId(undefined);
                }}
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeftIcon fontSize="small" sx={{ mr: 0.5 }} />
                {t('lessons:frontPage.backToStudentsList')}
              </Link>
              <Typography color="text.primary">{selectedStudent.name}</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4">{selectedStudent.name}</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<TimerIcon />}
                  onClick={handleStartTimer}
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

          {/* Only show tabs when not in the Teaching Tips view */}
          {activeTab !== 2 && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="student progress tabs">
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
                <Tab label={t('lessons:tabs.tips', 'Tips')} id="tab-2" aria-controls="tabpanel-2" />
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
      );
    }

    // No student selected - show the front page
    return (
      <>
        {/* App Description Section */}
        <Box sx={{ mb: 2, textAlign: 'center', pt: { xs: 3, md: 0 } }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: { xs: 3, md: 0 } }}>
            {t('lessons:frontPage.appTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, maxWidth: '800px', mx: 'auto' }}>
            {t('lessons:frontPage.appDescription')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => (window.location.href = '/students')}
            size={isMobile ? 'medium' : 'large'}
            sx={{ my: 1 }}
          >
            {t('students:addStudent')}
          </Button>
        </Box>

        {/* Students Selection Section */}
        {students.length > 0 ? (
          <>
            <Typography variant="h5" component="h2" sx={{ mb: 2, mt: 1 }}>
              {t('lessons:frontPage.selectStudent')}
            </Typography>
            <Grid container spacing={3}>
              {students.map(student => (
                <Grid key={student.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {student.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" component="div">
                          {student.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {student.email && `Email: ${student.email}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.phone && `Phone: ${student.phone}`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<ShowChartIcon />}
                        onClick={() => handleStudentSelect(student.id!)}
                        fullWidth
                      >
                        {t('lessons:frontPage.viewStudent')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          // Empty state when no students exist
          <Box sx={{ my: 4, textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.7, mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              {t('lessons:frontPage.noStudentsYet')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {t('lessons:frontPage.addFirstStudent')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={() => (window.location.href = '/students')}
              size="large"
            >
              {t('students:addStudent')}
            </Button>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        maxHeight: {
          xs: 'calc(100vh - var(--app-bar-height) - var(--bottom-nav-height))', // Removed subtraction entirely
          md: 'calc(100vh - var(--app-bar-height) - 48px)',
        },
        display: 'flex',
        flexDirection: 'column',
        pb: { xs: 'var(--bottom-nav-height)', md: 2 },
        pt: { xs: 6, md: 2 }, // Increased from 5 to 6 for mobile
        mt: { xs: 6, md: 0 }, // Increased from 4 to 6 for mobile
        px: 2,
        mx: 'auto',
        maxWidth: theme.breakpoints.values.lg,
      }}
    >
      {renderMainContent()}

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
  );
};

export default LessonsPage;
