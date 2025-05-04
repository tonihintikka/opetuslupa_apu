import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Import mobile PWA styles
import './styles/mobile.css';
// Import i18n instance (import before App)
import './i18n';
// Import database initialization
import { initializeDatabase } from './services';
// Import accessibility utils
import { getContrastRatio, meetsWCAGAA } from './utils/accessibilityUtils';
import theme from './theme';
import { isIOS } from './utils/platformDetection';
// Import service worker registration
import { registerServiceWorker, listenForServiceWorkerUpdates } from './sw-register';

// Initialize the database
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
});

// Register service worker
registerServiceWorker().catch(error => {
  console.error('Failed to register service worker:', error);
});

// Listen for service worker updates
listenForServiceWorkerUpdates();

// Test contrast ratio
if (process.env.NODE_ENV === 'development') {
  // Wait for DOM to be ready
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      try {
        const isiOSDevice = isIOS();
        console.log('Is iOS device:', isiOSDevice);

        // Get theme colors
        const backgroundColor = isiOSDevice
          ? theme.palette.primary.dark
          : theme.palette.primary.main;
        const textColor = theme.palette.primary.contrastText;

        // Calculate and log contrast ratio
        const ratio = getContrastRatio(textColor, backgroundColor.toString());
        console.log(`Header contrast ratio: ${ratio.toFixed(2)}:1`);
        console.log(
          `Meets WCAG AA standards: ${meetsWCAGAA(textColor, backgroundColor.toString())}`,
        );
      } catch (error) {
        console.error('Error testing contrast:', error);
      }
    }, 1000); // Wait a second for everything to render
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
