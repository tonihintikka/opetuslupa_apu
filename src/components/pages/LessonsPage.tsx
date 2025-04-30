import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
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

  // Reset the active tab when navigating to the page directly (not through state)
  useEffect(() => {
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

  const handleTimeUpdate = (_startTime: string, _endTime: string, _durationSeconds: number) => {
    // Automatically open the form after stopping the timer
    setOpenFormFromContext(true);
  };

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudentId(studentId);
    setActiveTab(0); // Reset to first tab when changing student

    // Also update the preSelectedStudentId in the form context
    setPreSelectedStudentId(studentId);
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
                  setActiveTab(0); // Reset tab when navigating back
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('lessons:frontPage.appTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}>
            {t('lessons:frontPage.appDescription')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => (window.location.href = '/students')} // Navigate to students page to add new student
            size={isMobile ? 'medium' : 'large'}
            sx={{ my: 2 }}
          >
            {t('students:addStudent')}
          </Button>
        </Box>

        {/* Students Selection Section */}
        {students.length > 0 ? (
          <>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
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
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        position: 'relative',
        height: '100%',
        maxHeight: {
          xs: 'calc(100vh - var(--app-bar-height) - var(--bottom-nav-height))',
          sm: 'calc(100vh - var(--app-bar-height))',
        },
        overflowY: 'auto',
        overflowX: 'hidden',
        pt: 4,
        pb: { xs: 8, sm: 4 },
        px: 2,
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
    </Container>
  );
};

export default LessonsPage;
