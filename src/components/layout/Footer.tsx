import React from 'react';
import { Box, Typography, Link, Container, Divider, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Footer component for the application
 * Displays app version, copyright info, and useful links
 * Only shown on desktop; hidden on mobile to save space
 */
const Footer: React.FC = () => {
  const { t } = useTranslation(['common']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = new Date().getFullYear();

  // This would typically come from environment variables in a real app
  const appVersion = 'v0.1.0';

  // Hide footer completely on mobile
  if (isMobile) {
    return null;
  }

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" align="left">
              &copy; {currentYear} {t('footer.copyright')}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="left">
              {t('footer.version')}: {appVersion}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Link component={RouterLink} to="/privacy-policy" color="inherit" underline="hover">
              {t('footer.privacyPolicy')}
            </Link>
            <Link component={RouterLink} to="/terms-of-service" color="inherit" underline="hover">
              {t('footer.termsOfService')}
            </Link>
            <Link component={RouterLink} to="/help" color="inherit" underline="hover">
              {t('footer.help')}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
