import React from 'react';
import { Box, Typography, Link, Container, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Footer component for the application
 * Displays app version, copyright info, and useful links
 */
const Footer: React.FC = () => {
  const { t } = useTranslation(['common']);
  const currentYear = new Date().getFullYear();

  // This would typically come from environment variables in a real app
  const appVersion = 'v0.1.0';

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              &copy; {currentYear} {t('footer.copyright')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.version')}: {appVersion}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" color="inherit" underline="hover">
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="#" color="inherit" underline="hover">
              {t('footer.termsOfService')}
            </Link>
            <Link href="#" color="inherit" underline="hover">
              {t('footer.help')}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
