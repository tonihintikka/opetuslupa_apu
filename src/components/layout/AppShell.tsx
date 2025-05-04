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
import { isIOS } from '../../utils/platformDetection';

/**
 * AppShell component that wraps the entire application and provides common layout elements
 */
const AppShell: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  // Check if running on iOS device
  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

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

    // Increase the app bar height on iOS
    const iosExtraHeight = isIOSDevice ? 10 : 0;

    document.documentElement.style.setProperty(
      '--app-bar-height',
      isMobile
        ? `calc(${56 + iosExtraHeight}px + var(--safe-area-inset-top))`
        : `calc(${64 + iosExtraHeight}px + var(--safe-area-inset-top))`,
    );

    // Update body background for iOS PWA to match the AppBar color
    if (isIOSDevice && (window.navigator as any).standalone) {
      document.body.style.backgroundColor = theme.palette.primary.dark;
    }
  }, [isMobile, isIOSDevice, theme.palette.primary.dark]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get the appropriate background color based on device
  const getAppBarColor = () => {
    if (isIOSDevice) {
      return theme.palette.primary.dark;
    }
    return theme.palette.primary.main;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          paddingTop: 'var(--safe-area-inset-top)',
          height: 'auto', // Changed from fixed height to auto
          backgroundColor: getAppBarColor(),
          // iOS PWA specific styles
          ...(isIOSDevice && {
            // Ensure the AppBar extends to edges on iOS
            left: 0,
            right: 0,
            top: 0,
            width: '100%',
          }),
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: isIOSDevice ? '66px' : '56px',
              sm: isIOSDevice ? '74px' : '64px',
            },
            paddingTop: {
              xs: isIOSDevice ? 'env(safe-area-inset-top, 10px)' : 0,
              sm: isIOSDevice ? 'env(safe-area-inset-top, 10px)' : 0,
            },
            py: { xs: isIOSDevice ? 1 : 0 },
          }}
        >
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
          minHeight: {
            xs: isIOSDevice ? '66px' : '56px',
            sm: isIOSDevice ? '74px' : '64px',
          },
          // Add extra space for iOS in PWA mode
          ...(isIOSDevice && {
            paddingTop: 'env(safe-area-inset-top, 10px)',
          }),
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
            py: { xs: '0px', md: 4 },
            mt: { xs: 0, md: 0 },
            px: { xs: 2, md: 3 },
            width: '100%',
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
