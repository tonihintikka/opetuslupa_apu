import React from 'react';
import { Box, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  EmojiEvents as MilestoneIcon,
} from '@mui/icons-material';

/**
 * Main navigation component
 */
const Navigation: React.FC = () => {
  const { t } = useTranslation(['common']);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
        startIcon={<CalendarIcon />}
        color="inherit"
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
        to="/milestones"
        startIcon={<MilestoneIcon />}
        color="inherit"
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
