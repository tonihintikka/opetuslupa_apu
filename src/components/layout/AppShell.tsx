import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Container,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
import { LanguageSwitcher } from '../';
import Navigation from './Navigation';
import Footer from './Footer';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import HomeLink from './HomeLink';

/**
 * AppShell component that wraps the entire application and provides common layout elements
 */
const AppShell: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Add CSS variables for safe area insets for iOS devices
  useEffect(() => {
    // Only needed for iOS devices with notches/home indicators
    document.documentElement.style.setProperty(
      '--safe-area-inset-bottom',
      'env(safe-area-inset-bottom, 0px)',
    );
    document.documentElement.style.setProperty(
      '--bottom-nav-height',
      isMobile ? 'calc(56px + var(--safe-area-inset-bottom))' : '0px',
    );
    document.documentElement.style.setProperty(
      '--safe-area-inset-top',
      'env(safe-area-inset-top, 0px)',
    );
    document.documentElement.style.setProperty(
      '--app-bar-height',
      'calc(64px + var(--safe-area-inset-top))',
    );
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          paddingTop: 'var(--safe-area-inset-top)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <HomeLink isMobile={isMobile} />
          {!isMobile && <Navigation />}
          <Box sx={{ flexGrow: isMobile ? 0 : 1 }} />
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>

      {/* Toolbar placeholder to push content below fixed app bar */}
      <Toolbar
        sx={{
          marginBottom: { xs: 0, sm: 1 },
          paddingTop: 'var(--safe-area-inset-top)',
        }}
      />

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Mobile drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better performance on mobile
            }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: 240,
                marginTop: 'var(--app-bar-height)',
              },
            }}
          >
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          </Drawer>
        )}

        {/* Desktop sidebar */}
        {!isMobile && <Sidebar mobileOpen={false} handleDrawerToggle={() => {}} />}

        <Container
          component="main"
          sx={{
            flexGrow: 1,
            py: { xs: 1, md: 4 }, // Reduced top padding for mobile
            px: { xs: 2, md: 3 },
            width: '100%',
            // Add padding bottom when on mobile to account for BottomNavigation
            pb: isMobile ? 'var(--bottom-nav-height)' : 'inherit',
          }}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Show bottom navigation only on mobile devices */}
      {isMobile && <BottomNavigation />}

      {/* Footer appears below content but above BottomNavigation */}
      <Footer />
    </Box>
  );
};

export default AppShell;
