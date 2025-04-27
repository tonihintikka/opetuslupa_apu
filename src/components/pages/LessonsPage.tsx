import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Lessons page component
 */
const LessonsPage: React.FC = () => {
  const { t } = useTranslation(['common']);

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('navigation.lessons')}
        </Typography>
        <Typography variant="body1">Lessons feature coming soon...</Typography>
      </Box>
    </Container>
  );
};

export default LessonsPage;
