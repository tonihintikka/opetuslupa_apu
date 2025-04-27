import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { WithTranslation, withTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component
 * Catches JavaScript errors in child component tree and displays fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, t, fallback } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return fallback;
      }

      return (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            m: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          <WarningIcon color="error" sx={{ fontSize: 48 }} />
          <Typography variant="h5" color="error" align="center">
            {t('errors.boundary.title')}
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            {t('errors.boundary.message')}
          </Typography>
          {error && (
            <Box sx={{ width: '100%', overflow: 'auto', my: 2 }}>
              <Typography
                variant="caption"
                component="pre"
                sx={{ p: 1, backgroundColor: 'grey.100' }}
              >
                {error.message}
              </Typography>
            </Box>
          )}
          <Button variant="contained" color="primary" onClick={this.handleReset}>
            {t('errors.boundary.tryAgain')}
          </Button>
        </Paper>
      );
    }

    return children;
  }
}

// Name the wrapped component for Fast Refresh
const TranslatedErrorBoundary = withTranslation(['common'])(ErrorBoundary);
export default TranslatedErrorBoundary;
