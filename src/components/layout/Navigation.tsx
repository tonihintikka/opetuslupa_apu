import React, { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  EmojiEvents as MilestoneIcon,
} from '@mui/icons-material';
import { useLessonForm } from '../lesson/useLessonForm';

/**
 * Main navigation component
 * Prioritizes lessons as the primary workflow element
 */
const Navigation: React.FC = () => {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { resetForm, setPreSelectedStudentId, preSelectedStudentId } = useLessonForm();

  // Use useCallback to prevent recreation of the function on each render
  const handleLessonsClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      // Reset form state
      resetForm();

      // Explicitly reset selected student
      setPreSelectedStudentId(undefined);

      // Navigate with a simpler state object
      navigate('/lessons', {
        replace: true,
        state: { forceReset: true },
      });
    },
    [navigate, resetForm, setPreSelectedStudentId],
  );

  // Handle milestones (Vinkit) button click
  const handleMilestonesClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      // If we have a selected student, navigate to their tips tab
      if (preSelectedStudentId) {
        // For the milestones/vinkit, always go to the tips tab
        navigate('/lessons', {
          replace: true,
          state: {
            redirectToStudentId: preSelectedStudentId,
            activeTab: 2, // Tips tab index
          },
        });
      } else {
        // No student selected - redirect to the milestones page
        // which will select the first student and show tips
        navigate('/milestones', { replace: true });
      }
    },
    [navigate, preSelectedStudentId],
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button
        component={NavLink}
        to="/lessons"
        startIcon={<CalendarIcon />}
        color="inherit"
        onClick={handleLessonsClick}
        sx={{
          textDecoration: 'none',
          '&.active': {
            fontWeight: 'bold',
            textDecoration: 'underline',
          },
        }}
      >
        {t('navigation.lessons')}
      </Button>

      <Button
        component={NavLink}
        to="/students"
        startIcon={<PeopleIcon />}
        color="inherit"
        sx={{
          textDecoration: 'none',
          '&.active': {
            fontWeight: 'bold',
            textDecoration: 'underline',
          },
        }}
      >
        {t('navigation.students')}
      </Button>

      <Button
        component={NavLink}
        to="/lessons"
        startIcon={<MilestoneIcon />}
        color="inherit"
        onClick={handleMilestonesClick}
        sx={{
          textDecoration: 'none',
          '&.active': {
            fontWeight: 'bold',
            textDecoration: 'underline',
          },
        }}
      >
        {t('navigation.milestones')}
      </Button>
    </Box>
  );
};

export default Navigation;
