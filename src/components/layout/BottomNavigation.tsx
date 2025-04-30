import React, { useCallback } from 'react';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  EmojiEvents as MilestoneIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLessonForm } from '../lesson/useLessonForm';

/**
 * BottomNavigation component for mobile devices
 * Provides a fixed navigation bar at the bottom of the screen
 * with support for iOS safe area insets
 * Prioritizes lessons as the primary workflow element
 */
const BottomNavigation: React.FC = () => {
  const { t } = useTranslation(['common']);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { resetForm, setPreSelectedStudentId } = useLessonForm();

  // Extract the first path segment to determine the active tab
  const currentPath = '/' + (location.pathname.split('/')[1] || '');

  // Use useCallback to prevent recreation of the function on each render
  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      // When going to lessons page, reset any selected student
      if (newValue === '/lessons') {
        // Reset form state
        resetForm();

        // Explicitly reset selected student
        setPreSelectedStudentId(undefined);

        // Navigate with a simpler state object
        navigate('/lessons', {
          replace: true,
          state: { forceReset: true },
        });
      } else {
        // For other pages, navigate normally
        navigate(newValue, { replace: true });
      }
    },
    [navigate, resetForm, setPreSelectedStudentId],
  );

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderRadius: 0,
        // Use CSS variable for safe area inset
        paddingBottom: 'var(--safe-area-inset-bottom)',
        // Make sure the component is higher in visual stacking than other elements
        boxShadow: 3,
      }}
      elevation={3}
    >
      <MuiBottomNavigation
        value={currentPath}
        onChange={handleChange}
        showLabels
        sx={{ height: '56px' }}
      >
        <BottomNavigationAction
          label={t('navigation.lessons')}
          value="/lessons"
          icon={<CalendarIcon />}
        />
        <BottomNavigationAction
          label={t('navigation.students')}
          value="/students"
          icon={<PeopleIcon />}
        />
        <BottomNavigationAction
          label={t('navigation.milestones')}
          value="/milestones"
          icon={<MilestoneIcon />}
        />
        <BottomNavigationAction
          label={t('navigation.settings')}
          value="/settings"
          icon={<SettingsIcon />}
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
