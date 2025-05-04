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
import { isIOS, isPWAStandalone } from '../../utils/platformDetection';

/**
 * AppShell component that wraps the entire application and provides common layout elements
 */
const AppShell: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Check if running on iOS device and in PWA mode
  useEffect(() => {
    setIsIOSDevice(isIOS());
    setIsStandalone(isPWAStandalone());
  }, []);

  // Add CSS variables for safe area insets for iOS devices
  useEffect(() => {
    // Set CSS variables for safe area insets
    document.documentElement.style.setProperty(
      '--safe-area-inset-bottom',
      'env(safe-area-inset-bottom, 0px)',
    );
    document.documentElement.style.setProperty(
      '--safe-area-inset-top',
      'env(safe-area-inset-top, 0px)',
    );
    document.documentElement.style.setProperty(
      '--safe-area-inset-left',
      'env(safe-area-inset-left, 0px)',
    );
    document.documentElement.style.setProperty(
      '--safe-area-inset-right',
      'env(safe-area-inset-right, 0px)',
    );

    document.documentElement.style.setProperty(
      '--bottom-nav-height',
      isMobile ? 'calc(56px + var(--safe-area-inset-bottom))' : '0px',
    );

    // Increase the app bar height on iOS
    const iosExtraHeight = isIOSDevice ? 10 : 0;

    document.documentElement.style.setProperty(
      '--app-bar-height',
      isMobile
        ? `calc(${56 + iosExtraHeight}px + var(--safe-area-inset-top))`
        : `calc(${64 + iosExtraHeight}px + var(--safe-area-inset-top))`,
    );

    // Ensure consistent background color across all platforms
    document.body.style.backgroundColor = theme.palette.background.default;

    // Prevent iOS overscroll effects
    if (isIOSDevice) {
      document.body.style.overscrollBehavior = 'none';
    }
  }, [isMobile, isIOSDevice, theme.palette.background.default]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overscrollBehavior: isIOSDevice ? 'none' : 'auto',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          paddingTop: 'var(--safe-area-inset-top)',
          height: 'auto',
          // iOS-specific styles for proper safe area handling
          ...(isIOSDevice && {
            left: 0,
            right: 0,
            top: 0,
            width: '100%',
            paddingLeft: 'var(--safe-area-inset-left)',
            paddingRight: 'var(--safe-area-inset-right)',
          }),
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: isIOSDevice ? '66px' : '56px',
              sm: isIOSDevice ? '74px' : '64px',
            },
            paddingTop: isIOSDevice ? 'var(--safe-area-inset-top, 10px)' : 0,
            paddingLeft: isIOSDevice ? 'var(--safe-area-inset-left, 16px)' : 2,
            paddingRight: isIOSDevice ? 'var(--safe-area-inset-right, 16px)' : 2,
            py: { xs: isIOSDevice ? 1 : 0 },
            // Ensure proper spacing on iOS PWA
            ...(isStandalone &&
              isIOSDevice && {
                px: { xs: 3, sm: 3 },
              }),
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                // Add more left margin on iOS devices in PWA mode
                ...(isIOSDevice &&
                  isStandalone && {
                    ml: { xs: 1, sm: 1 },
                    marginLeft: 'calc(8px + var(--safe-area-inset-left))',
                  }),
                ...(isIOSDevice &&
                  !isStandalone && {
                    ml: { xs: 0.5, sm: 1 },
                  }),
              }}
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
          // Add extra space for iOS
          ...(isIOSDevice && {
            paddingTop: 'var(--safe-area-inset-top, 10px)',
            paddingLeft: 'var(--safe-area-inset-left, 0px)',
            paddingRight: 'var(--safe-area-inset-right, 0px)',
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
                paddingLeft: isIOSDevice ? 'var(--safe-area-inset-left, 0px)' : 0,
                paddingTop: isIOSDevice ? 'var(--safe-area-inset-top, 0px)' : 0,
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
            overscrollBehavior: isIOSDevice ? 'none' : 'auto',
            WebkitOverflowScrolling: 'touch',
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
