import React, { useState, useEffect } from 'react';
import {
  Box,
  useMediaQuery,
  Theme,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';
import { PlayArrow as StartIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Lesson, Student } from '../../../services/db';
import lessonService from '../../../services/lessonService';
import studentService from '../../../services/studentService';
import { useProgressCalculation } from '../../../hooks/useProgressCalculation';
import ProgressMatrix from './ProgressMatrix';
import ProgressIndicator from './ProgressIndicator';
import SessionStarter from '../../../components/student/SessionStarter';

interface ProgressDashboardProps {
  studentId?: number;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ studentId }) => {
  const { t } = useTranslation(['common', 'lessons']);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const { topicProgress, getOverallProgress } = useProgressCalculation(lessons);
  const [showSessionStarter, setShowSessionStarter] = useState(false);

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
