import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../';
import Navigation from './Navigation';
import Footer from './Footer';
import Sidebar from './Sidebar';

/**
 * AppShell component that wraps the entire application and provides common layout elements
 */
const AppShell: React.FC = () => {
  const { t } = useTranslation(['common']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile ? (
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          ) : (
            <>
              <Typography variant="h6" component="div" sx={{ mr: 4 }}>
                {t('app.name')}
              </Typography>
              <Navigation />
            </>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {!isMobile && <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />}

        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Outlet />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AppShell;
