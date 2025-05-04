import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import i18n from './i18n';
import theme from './theme';
import Router from './router';
import { ErrorBoundary } from './components/layout';
import { LessonFormProvider } from './components/lesson/LessonFormContext';
import UpdateNotification from './components/UpdateNotification';
import './App.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <ErrorBoundary>
            <LessonFormProvider>
              <Router />
              <UpdateNotification />
            </LessonFormProvider>
          </ErrorBoundary>
        </SnackbarProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
