import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  useMediaQuery,
  Typography,
  CircularProgress,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Lesson, Student } from '../../../services/db';
import lessonService from '../../../services/lessonService';
import studentService from '../../../services/studentService';
import { useProgressCalculation } from '../../../hooks/useProgressCalculation';
import ProgressMatrix from './ProgressMatrix';
import ProgressIndicator from './ProgressIndicator';
import SessionStarter from '../session/SessionStarter';
import { format } from 'date-fns';
import { useLessonForm } from '../useLessonForm';

interface ProgressDashboardProps {
  studentId?: number;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ studentId: initialStudentId }) => {
  const { t } = useTranslation(['common', 'lessons']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>(initialStudentId);
  const { topicProgress, getOverallProgress } = useProgressCalculation(lessons);
  const [showSessionStarter, setShowSessionStarter] = useState(false);
  const { openForEditing } = useLessonForm();

  // Fetch all students on component mount
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const students = await studentService.getAll();
        setAllStudents(students);
      } catch (error) {
        console.error('Error fetching all students:', error);
      }
    };

    fetchAllStudents();
  }, []);

  // Fetch lessons on component mount or when selected student changes
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        let fetchedLessons: Lesson[];

        if (selectedStudentId) {
          fetchedLessons = await lessonService.getByStudentId(selectedStudentId);

          // Also fetch student data if studentId is provided
          try {
            const student = await studentService.getById(selectedStudentId);
            if (student) {
              setStudentData(student);
            }
          } catch (error) {
            console.error('Error fetching student data:', error);
          }
        } else {
          fetchedLessons = await lessonService.getAll();
        }

        setLessons(fetchedLessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [selectedStudentId]);

  const handleStudentChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    setSelectedStudentId(value as number);
  };

  const handleStartSession = () => {
    // Use the session starter dialog which will handle creating a draft
    // and opening the lesson form
    setShowSessionStarter(true);
  };

  const handleCloseSessionStarter = () => {
    setShowSessionStarter(false);
  };

  // Helper function to format date
  const formatDate = (date: Date): string => {
    return format(new Date(date), 'dd.MM.yyyy');
  };

  // Helper function to calculate lesson duration in minutes
  const calculateLessonDuration = (lesson: Lesson): number => {
    if (!lesson.startTime || !lesson.endTime) return 0;

    const [startHours, startMinutes] = lesson.startTime.split(':').map(Number);
    const [endHours, endMinutes] = lesson.endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    const totalMinutes =
      endTotalMinutes < startTotalMinutes
        ? endTotalMinutes + 24 * 60 - startTotalMinutes
        : endTotalMinutes - startTotalMinutes;

    return totalMinutes;
  };

  // Handle opening lesson edit form
  const handleEditLesson = (lesson: Lesson) => {
    // Open the lesson form using the context function, passing the lesson data
    openForEditing(lesson);
  };

  // Sort lessons by date (newest first)
  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [lessons]);

  // Lesson history section
  const renderLessonHistory = () => {
    if (lessons.length === 0) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('lessons:history.title', 'Lesson History')}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <List sx={{ bgcolor: 'background.paper' }}>
          {sortedLessons.map(lesson => (
            <React.Fragment key={lesson.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditLesson(lesson)}>
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle1">{formatDate(lesson.date)}</Typography>
                      <Chip
                        size="small"
                        label={`${lesson.startTime} - ${lesson.endTime}`}
                        icon={<TimeIcon fontSize="small" />}
                        variant="outlined"
                        sx={{ ml: 2 }}
                      />
                      <Chip
                        size="small"
                        label={`${calculateLessonDuration(lesson)} min`}
                        color="primary"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                        {lesson.learningStage && t(`lessons:stages.${lesson.learningStage}`)}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {lesson.topicRatings.map(tr => (
                          <Chip
                            key={tr.topicId}
                            label={t(`lessons:topics.${tr.topicId}`, tr.topicId)}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      {lesson.notes && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          {lesson.notes}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'auto',
        height: '100%',
        maxHeight: {
          xs: 'calc(100vh - var(--app-bar-height) - var(--bottom-nav-height) - 32px)', // Account for AppBar, BottomNav, and padding
          md: 'calc(100vh - var(--app-bar-height) - 48px)', // Account for AppBar and padding on desktop
        },
        display: 'flex',
        flexDirection: 'column',
        pb: 4,
        pt: 3, // Increase top padding to allow space for dropdown
        px: 1, // Add horizontal padding
      }}
    >
      {/* Student Selection Dropdown */}
      <Box
        sx={{
          mb: 3,
          position: 'relative',
          zIndex: 2,
          bgcolor: 'background.paper',
          pt: 2,
          pb: 2,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <FormControl fullWidth size="medium" sx={{ mb: 2 }}>
          {' '}
          {/* Change to medium size */}
          <InputLabel id="student-select-label">{t('common:student', 'Student')}</InputLabel>
          <Select
            labelId="student-select-label"
            id="student-select"
            value={selectedStudentId || ''}
            label={t('common:student', 'Student')}
            onChange={handleStudentChange}
            displayEmpty
            sx={{
              '& .MuiSelect-select': {
                padding: '14px 16px', // Increase padding even more
                fontSize: '1.1rem', // Slightly larger font
              },
              '& .MuiMenuItem-root': {
                padding: '12px 16px',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: '50vh',
                  mt: 1, // Add margin to move dropdown down slightly
                  '& .MuiMenuItem-root': {
                    padding: '10px 16px',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="" sx={{ padding: '12px 16px' }}>
              {t('common:allStudents', 'All Students')}
            </MenuItem>
            {allStudents.map(student => (
              <MenuItem key={student.id} value={student.id} sx={{ padding: '12px 16px' }}>
                {student.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {studentData && (
          <>
            <Typography variant="h4" sx={{ mb: 1, px: 1 }}>
              {' '}
              {/* Add horizontal padding */}
              {studentData.name}
            </Typography>
            <Divider />
          </>
        )}
      </Box>

      {/* Start Session Button - Shown at the top for both mobile and desktop */}
      {selectedStudentId && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<StartIcon />}
            onClick={handleStartSession}
            sx={{ borderRadius: 2, py: 1 }} // Add more vertical padding
          >
            {t('lessons:progress.startNewSession', 'Start New Session')}
          </Button>
        </Box>
      )}

      {lessons.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('lessons:progress.noLessonsYet', 'No lessons recorded yet')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t(
              'lessons:progress.noLessonsMessage',
              'Complete some driving lessons to see your progress statistics here.',
            )}
          </Typography>
        </Paper>
      ) : (
        <Box>
          {isMobile ? (
            <ProgressIndicator
              topicProgress={topicProgress}
              overallProgress={getOverallProgress()}
              studentId={selectedStudentId}
              studentName={studentData?.name}
            />
          ) : (
            <ProgressMatrix lessons={lessons} studentId={selectedStudentId} />
          )}
        </Box>
      )}

      {/* Lesson History Section */}
      {renderLessonHistory()}

      {/* Session Starter Dialog */}
      {selectedStudentId && studentData && (
        <SessionStarter
          open={showSessionStarter}
          onClose={handleCloseSessionStarter}
          studentId={selectedStudentId}
          studentName={studentData.name}
          suggestedTopics={topicProgress}
        />
      )}
    </Box>
  );
};

export default ProgressDashboard;
