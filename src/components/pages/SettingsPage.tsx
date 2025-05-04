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
  Button,
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
  Update as UpdateIcon,
  ImportExport as ImportExportIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../';
import { settingsService } from '../../services';
import { Link as RouterLink } from 'react-router-dom';
import { APP_VERSION } from '../../sw-register';

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
  const [updateMessage, setUpdateMessage] = React.useState<string | null>(null);

  // Current year and app version for footer links
  const currentYear = new Date().getFullYear();
  const appVersion = APP_VERSION; // Using the version from service worker

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

  // Check for updates
  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      setUpdateMessage(t('settings:updates.checking', 'Tarkistetaan päivityksiä...'));

      try {
        // Request cache update and registration update
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          for (const registration of registrations) {
            await registration.update();
          }
        }

        // Force reload resources
        setUpdateMessage(t('settings:updates.refreshing', 'Ladataan resursseja uudelleen...'));
        if (window.caches) {
          const cacheNames = await window.caches.keys();
          await Promise.all(cacheNames.map(cacheName => window.caches.delete(cacheName)));
        }

        // Success message
        setUpdateMessage(t('settings:updates.upToDate', 'Sovellus on ajan tasalla!'));
        setTimeout(() => setUpdateMessage(null), 3000);
      } catch (error) {
        console.error('Error checking for updates:', error);
        setUpdateMessage(t('settings:updates.error', 'Virhe päivityksien tarkistamisessa'));
        setTimeout(() => setUpdateMessage(null), 3000);
      }
    } else {
      setUpdateMessage(
        t('settings:updates.notSupported', 'Päivitykset eivät ole tuettuja tässä selaimessa'),
      );
      setTimeout(() => setUpdateMessage(null), 3000);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        maxHeight: {
          xs: 'calc(100vh - var(--app-bar-height))',
          md: 'calc(100vh - var(--app-bar-height) - 48px)',
        },
        display: 'flex',
        flexDirection: 'column',
        pb: { xs: 'calc(var(--bottom-nav-height) + 64px)', md: 3 },
        pt: { xs: 1, md: 2 },
        mt: { xs: 0, md: 0 },
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

      {/* Application Management */}
      <Card sx={{ flex: 1, mt: 3 }}>
        <CardHeader title={t('settings:dataManagement', 'Sovelluksen hallinta')} />
        <CardContent>
          <List disablePadding>
            {/* Check for Updates */}
            <ListItem>
              <ListItemIcon>
                <UpdateIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('settings:updates.checkForUpdates', 'Tarkista päivitykset')}
                secondary={
                  updateMessage ||
                  t('settings:updates.description', 'Tarkista sovelluksen päivitykset')
                }
              />
              <Button variant="outlined" size="small" onClick={checkForUpdates} sx={{ ml: 2 }}>
                {t('settings:updates.check', 'Tarkista')}
              </Button>
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Data Export/Import */}
            <ListItem
              component={RouterLink}
              to="/export-import"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <ImportExportIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('common:navigation.exportImport', 'Vienti/Tuonti')}
                secondary={t('settings:dataExport.exportHelp', 'Vie tai tuo tietosi')}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Links & Info Section (replaces footer on mobile) */}
      <Card sx={{ flex: 1, mt: 3 }}>
        <CardHeader title={t('settings:links.title', 'Linkit & Info')} />
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
