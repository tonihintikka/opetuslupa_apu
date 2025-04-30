import React, { useCallback, useRef } from 'react';
import { Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLessonForm } from '../lesson/useLessonForm';

interface HomeLinkProps {
  isMobile: boolean;
}

/**
 * Component that renders the app name as a clickable link that resets to the home view
 */
const HomeLink: React.FC<HomeLinkProps> = ({ isMobile }) => {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const location = useLocation();
  const { resetForm, setPreSelectedStudentId, preSelectedStudentId } = useLessonForm();

  // Use a ref to track the current location state to avoid dependency issues
  const locationRef = useRef(location);
  locationRef.current = location;

  // Use useCallback to prevent recreation of the function on each render
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const currentLocation = locationRef.current;

      // Check if we're coming from a "vinkit" (milestones) view
      // This would be indicated in the URL path, hash, or state
      const isFromVinkit =
        currentLocation.pathname === '/milestones' ||
        currentLocation.hash === '#vinkit' ||
        (currentLocation.state &&
          typeof currentLocation.state === 'object' &&
          'activeTab' in currentLocation.state &&
          currentLocation.state.activeTab === 2);

      if (isFromVinkit && preSelectedStudentId) {
        // If coming from vinkit and we have a student selected, go to that student's tips tab
        navigate('/lessons', {
          replace: true,
          state: {
            redirectToStudentId: preSelectedStudentId,
            activeTab: 2, // Tips tab index
          },
        });
      } else {
        // Otherwise reset form state and go to lessons page
        resetForm();
        setPreSelectedStudentId(undefined);
        navigate('/lessons', {
          replace: true,
          state: { forceReset: true },
        });
      }
    },
    [navigate, resetForm, setPreSelectedStudentId, preSelectedStudentId],
  );

  return (
    <Typography
      variant="h6"
      component="div"
      onClick={handleClick}
      sx={{
        flexGrow: isMobile ? 1 : 0,
        mr: isMobile ? 0 : 4,
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {
          cursor: 'pointer',
          opacity: 0.8,
        },
      }}
    >
      {t('app.name')}
    </Typography>
  );
};

export default HomeLink;
