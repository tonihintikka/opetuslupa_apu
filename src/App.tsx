import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import theme from './theme';
import Router from './router';
import { ErrorBoundary } from './components/layout';
import { LessonFormProvider } from './components/lesson/LessonFormContext';
import './App.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <LessonFormProvider>
            <Router />
          </LessonFormProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
