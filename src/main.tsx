import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Import i18n instance (import before App)
import './i18n';
// Import database initialization
import { initializeDatabase } from './services';

// Initialize the database
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
