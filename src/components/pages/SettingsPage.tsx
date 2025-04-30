import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  Card,
  CardContent,
  CardHeader,
  useTheme,
} from '@mui/material';
import {
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  PrivacyTip as PrivacyTipIcon,
  Gavel as GavelIcon,
  Help as HelpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../';
import { settingsService } from '../../services';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Settings page component
 * Allows users to configure application settings like language, theme, etc.
 */
const SettingsPage: React.FC = () => {
  const { t } = useTranslation(['settings', 'common']);
  const theme = useTheme();

  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = React.useState(true);

  // Current year and app version for footer links
  const currentYear = new Date().getFullYear();
  const appVersion = 'v0.1.0'; // This would typically come from environment variables

  // Load settings from storage when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load settings from the service
        const notificationsSetting = await settingsService.getSetting('notificationsEnabled');
        const darkModeSetting = await settingsService.getSetting('darkMode');
        const autoSaveSetting = await settingsService.getSetting('autoSave');

        // Update state with loaded values
        setNotificationsEnabled(notificationsSetting);
        setDarkModeEnabled(darkModeSetting);
        setAutoSaveEnabled(autoSaveSetting);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleNotificationChange = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await settingsService.saveSetting('notificationsEnabled', newValue);
  };

  const handleDarkModeChange = async () => {
    const newValue = !darkModeEnabled;
    setDarkModeEnabled(newValue);
    await settingsService.saveSetting('darkMode', newValue);
    // Here you might also need to update the app theme
  };

  const handleAutoSaveChange = async () => {
    const newValue = !autoSaveEnabled;
    setAutoSaveEnabled(newValue);
    await settingsService.saveSetting('autoSave', newValue);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'auto',
        minHeight: '100%',
        maxHeight: {
          xs: 'none',
          md: 'calc(100vh - var(--app-bar-height) - 48px)',
        },
        display: 'flex',
        flexDirection: 'column',
        pb: { xs: 'calc(var(--bottom-nav-height) + 32px)', md: 3 },
        pt: { xs: 1, md: 2 },
        px: 2,
        mx: 'auto',
        width: '100%',
        maxWidth: theme.breakpoints.values.lg,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
        {/* Language Settings */}
        <Card sx={{ flex: 1 }}>
          <CardHeader title={t('language.title')} />
          <CardContent>
            <List disablePadding>
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('language.select')}
                  secondary={t('language.description')}
                />
                <LanguageSwitcher />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card sx={{ flex: 1 }}>
          <CardHeader title={t('preferences.title')} />
          <CardContent>
            <List disablePadding>
              <ListItem>
                <ListItemIcon>
                  <DarkModeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('preferences.darkMode')}
                  secondary={t('preferences.darkModeDescription')}
                />
                <Switch
                  edge="end"
                  checked={darkModeEnabled}
                  onChange={handleDarkModeChange}
                  inputProps={{
                    'aria-labelledby': 'dark-mode-switch',
                  }}
                />
              </ListItem>

              <Divider variant="inset" component="li" />

              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('preferences.notifications')}
                  secondary={t('preferences.notificationsDescription')}
                />
                <Switch
                  edge="end"
                  checked={notificationsEnabled}
                  onChange={handleNotificationChange}
                  inputProps={{
                    'aria-labelledby': 'notifications-switch',
                  }}
                />
              </ListItem>

              <Divider variant="inset" component="li" />

              <ListItem>
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('preferences.autoSave')}
                  secondary={t('preferences.autoSaveDescription')}
                />
                <Switch
                  edge="end"
                  checked={autoSaveEnabled}
                  onChange={handleAutoSaveChange}
                  inputProps={{
                    'aria-labelledby': 'auto-save-switch',
                  }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Links & Info Section (replaces footer on mobile) */}
      <Card sx={{ flex: 1, mt: 3 }}>
        <CardHeader title={t('settings:links.title', 'Links & Info')} />
        <CardContent>
          <List disablePadding>
            <ListItem
              component={RouterLink}
              to="/privacy-policy"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <PrivacyTipIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('common:footer.privacyPolicy')}
                secondary={t(
                  'settings:links.privacyDescription',
                  'View our privacy policy and data practices',
                )}
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem
              component={RouterLink}
              to="/terms-of-service"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <GavelIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('common:footer.termsOfService')}
                secondary={t(
                  'settings:links.termsDescription',
                  'Read our terms of service agreement',
                )}
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem
              component={RouterLink}
              to="/help"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('common:footer.help')}
                secondary={t(
                  'settings:links.helpDescription',
                  'Get help with using the application',
                )}
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('settings:links.appInfo', 'Application Info')}
                secondary={`© ${currentYear} ${t('common:footer.copyright')} | ${t('common:footer.version')}: ${appVersion}`}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Data Storage Info */}
      <Paper sx={{ mt: 3, p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('storage.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('storage.description')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
