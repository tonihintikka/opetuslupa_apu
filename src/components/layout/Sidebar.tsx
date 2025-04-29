import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Typography,
} from '@mui/material';
import {
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  EmojiEvents as MilestoneIcon,
  Settings as SettingsIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

/**
 * Sidebar/drawer navigation component
 * Provides a responsive navigation drawer that can be toggled on mobile
 * Prioritizes lessons as the primary workflow element
 */
const Sidebar: React.FC<SidebarProps> = ({ handleDrawerToggle }) => {
  const { t } = useTranslation(['common']);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const navItems = [
    { path: '/lessons', label: t('navigation.lessons'), icon: <CalendarIcon /> },
    { path: '/students', label: t('navigation.students'), icon: <PeopleIcon /> },
    { path: '/milestones', label: t('navigation.milestones'), icon: <MilestoneIcon /> },
    { path: '/settings', label: t('navigation.settings'), icon: <SettingsIcon /> },
    { path: '/export-import', label: t('navigation.exportImport'), icon: <BackupIcon /> },
  ];

  const handleNavigation = (path: string) => {
    // Always navigate with no state to ensure fresh rendering
    navigate(path, { replace: true, state: null });
    handleDrawerToggle();
  };

  return (
    <Box sx={{ width: 240 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap>
          {t('app.name')}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        {navItems.map(item => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                py: 1.5,
                minHeight: 48,
                '&.active': {
                  backgroundColor: theme.palette.action.selected,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
