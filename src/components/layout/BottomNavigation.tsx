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

  // Extract the first path segment to determine the active tab
  const currentPath = '/' + (location.pathname.split('/')[1] || '');

  // Simple navigation handler
  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      navigate(newValue, { replace: true });
    },
    [navigate],
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
          data-testid="lessons-button"
        />
        <BottomNavigationAction
          label={t('navigation.students')}
          value="/students"
          icon={<PeopleIcon />}
          data-testid="students-button"
        />
        <BottomNavigationAction
          label={t('navigation.milestones')}
          value="/vinkit"
          icon={<MilestoneIcon />}
          data-testid="milestones-button"
        />
        <BottomNavigationAction
          label={t('navigation.settings')}
          value="/settings"
          icon={<SettingsIcon />}
          data-testid="settings-button"
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
