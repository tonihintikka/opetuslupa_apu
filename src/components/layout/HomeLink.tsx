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
  const { resetForm, setPreSelectedStudentId } = useLessonForm();

  // Use a ref to track the current location state to avoid dependency issues
  const locationRef = useRef(location);
  locationRef.current = location;

  // Use useCallback to prevent recreation of the function on each render
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      // Reset form state
      resetForm();
      setPreSelectedStudentId(undefined);

      // Navigate to lessons page
      navigate('/lessons', {
        replace: true,
        state: { forceReset: true },
      });
    },
    [navigate, resetForm, setPreSelectedStudentId],
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
