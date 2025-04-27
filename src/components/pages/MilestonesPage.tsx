import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Milestones page component
 */
const MilestonesPage: React.FC = () => {
  const { t } = useTranslation(['common']);

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('navigation.milestones')}
        </Typography>
        <Typography variant="body1">Milestones feature coming soon...</Typography>
      </Box>
    </Container>
  );
};

export default MilestonesPage;
