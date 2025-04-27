import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  EmojiEvents as MilestoneIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

/**
 * Sidebar/drawer navigation component
 * Provides a responsive navigation drawer that can be toggled on mobile
 */
const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const { t } = useTranslation(['common']);
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const drawerWidth = 240;

  const navItems = [
    { path: '/students', label: t('navigation.students'), icon: <PeopleIcon /> },
    { path: '/lessons', label: t('navigation.lessons'), icon: <CalendarIcon /> },
    { path: '/milestones', label: t('navigation.milestones'), icon: <MilestoneIcon /> },
    { path: '/settings', label: t('navigation.settings'), icon: <SettingsIcon /> },
    { path: '/export-import', label: t('navigation.exportImport'), icon: <BackupIcon /> },
  ];

  const drawer = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map(item => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={isSmallScreen ? handleDrawerToggle : undefined}
              selected={location.pathname === item.path}
              sx={{
                '&.active': {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { md: 'none' } }}
      >
        <MenuIcon />
      </IconButton>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              position: 'relative',
              height: '100%',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
