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
import SessionStarter from '../../../components/student/SessionStarter';
import { format } from 'date-fns';
import { useLessonForm } from '../LessonFormContext';

interface ProgressDashboardProps {
  studentId?: number;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ studentId }) => {
  const { t } = useTranslation(['common', 'lessons']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const { topicProgress, getOverallProgress } = useProgressCalculation(lessons);
  const [showSessionStarter, setShowSessionStarter] = useState(false);
  const { setIsOpen: setLessonFormOpen } = useLessonForm();

  // Fetch lessons on component mount
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        let fetchedLessons: Lesson[];

        if (studentId) {
          fetchedLessons = await lessonService.getByStudentId(studentId);

          // Also fetch student data if studentId is provided
          try {
            const student = await studentService.getById(studentId);
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
  }, [studentId]);

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
  const handleEditLesson = (_lesson: Lesson) => {
    // Open the lesson form
    setLessonFormOpen(true);
    // Note: We don't have a setEditingLesson in the context yet,
    // this would be handled by a future enhancement
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
        <Typography variant="h6" gutterBottom>
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
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {lesson.learningStage && t(`lessons:stages.${lesson.learningStage}`)}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {lesson.topics.map(topic => (
                          <Chip
                            key={topic}
                            label={t(`lessons:topics.${topic}`, topic)}
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
    <Box>
      {/* Start Session Button - Shown at the top for both mobile and desktop */}
      {studentId && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<StartIcon />}
            onClick={handleStartSession}
            sx={{ borderRadius: 2 }}
          >
            {t('lessons:progress.startNewSession', 'Start New Session')}
          </Button>
        </Box>
      )}

      {lessons.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {t('lessons:progress.noLessonsYet', 'No lessons recorded yet')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
              studentId={studentId}
            />
          ) : (
            <ProgressMatrix lessons={lessons} studentId={studentId} />
          )}
        </Box>
      )}

      {/* Lesson History Section */}
      {renderLessonHistory()}

      {/* Session Starter Dialog */}
      {studentId && studentData && (
        <SessionStarter
          open={showSessionStarter}
          onClose={handleCloseSessionStarter}
          studentId={studentId}
          studentName={studentData.name}
          topicProgress={topicProgress}
        />
      )}
    </Box>
  );
};

export default ProgressDashboard;
