import React from 'react';
import { Box, useTheme } from '@mui/material';
import TeachingTips from '../lesson/tips/TeachingTips';

/**
 * Standalone page for teaching tips (Tips)
 * This separates the tips functionality from the student-specific views
 */
const TipsPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        maxHeight: {
          xs: 'calc(100vh - var(--app-bar-height) - var(--bottom-nav-height))',
          md: 'calc(100vh - var(--app-bar-height) - 48px)',
        },
        display: 'flex',
        flexDirection: 'column',
        pb: { xs: 'var(--bottom-nav-height)', md: 1 },
        pt: { xs: 0, md: 2 },
        mt: { xs: 0, md: 0 },
        px: 2,
        mx: 'auto',
        maxWidth: theme.breakpoints.values.lg,
      }}
    >
      <TeachingTips />
    </Box>
  );
};

export default TipsPage;
