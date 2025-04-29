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
} from '@mui/material';
import {
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../';
import { settingsService } from '../../services';

/**
 * Settings page component
 * Allows users to configure application settings like language, theme, etc.
 */
const SettingsPage: React.FC = () => {
  const { t } = useTranslation(['settings']);

  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = React.useState(true);

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
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 3 }}>
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

      {/* Data Storage Info */}
      <Paper sx={{ mt: 3, p: 2 }}>
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
