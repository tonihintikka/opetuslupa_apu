import React, { useCallback } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
  const { resetForm, setPreSelectedStudentId } = useLessonForm();

  // Use useCallback to prevent recreation of the function on each render
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      // Reset the form state
      resetForm();

      // Explicitly reset the selected student
      setPreSelectedStudentId(undefined);

      // Force a complete reset by navigating with replace instead of push
      // with a simpler state object
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
