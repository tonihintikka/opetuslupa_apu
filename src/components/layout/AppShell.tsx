import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu as MenuIcon } from '@mui/icons-material';
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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: isMobile ? 1 : 0, mr: isMobile ? 0 : 4 }}
          >
            {t('app.name')}
          </Typography>
          {!isMobile && <Navigation />}
          <Box sx={{ flexGrow: isMobile ? 0 : 1 }} />
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>

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
            py: { xs: 2, md: 4 },
            px: { xs: 2, md: 3 },
            width: '100%',
          }}
        >
          <Outlet />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AppShell;
