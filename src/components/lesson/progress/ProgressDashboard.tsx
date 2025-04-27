import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, Theme, Typography, CircularProgress, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Lesson } from '../../../services/db';
import lessonService from '../../../services/lessonService';
import { useProgressCalculation } from '../../../hooks/useProgressCalculation';
import ProgressMatrix from './ProgressMatrix';
import ProgressIndicator from './ProgressIndicator';

interface ProgressDashboardProps {
  studentId?: number;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ studentId }) => {
  const { t } = useTranslation(['common', 'lessons']);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { topicProgress, getOverallProgress } = useProgressCalculation(lessons);

  // Fetch lessons on component mount
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        let fetchedLessons: Lesson[];

        if (studentId) {
          fetchedLessons = await lessonService.getByStudentId(studentId);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (lessons.length === 0) {
    return (
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
    );
  }

  return (
    <Box>
      {isMobile ? (
        <ProgressIndicator topicProgress={topicProgress} overallProgress={getOverallProgress()} />
      ) : (
        <ProgressMatrix lessons={lessons} studentId={studentId} />
      )}
    </Box>
  );
};

export default ProgressDashboard;
