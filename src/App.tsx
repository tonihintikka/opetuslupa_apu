import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, Typography, AppBar, Toolbar } from '@mui/material'
import { I18nextProvider } from 'react-i18next'
import { useTranslation } from 'react-i18next'
import i18n from './i18n'
import theme from './theme'
import { LanguageSwitcher, TranslatedText } from './components'
import './App.css'

function AppContent() {
  const { t } = useTranslation(['common'])

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app.name')}
          </Typography>
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          padding: 3,
          textAlign: 'center',
        }}
      >
        <TranslatedText
          textKey="app.name"
          variant="h3"
          component="h1"
          gutterBottom
        />
        <Typography variant="body1" paragraph>
          {t('app.loading')}
        </Typography>
      </Box>
    </>
  )
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App
