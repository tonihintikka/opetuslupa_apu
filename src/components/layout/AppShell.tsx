import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell component that wraps the entire application and provides common layout elements
 */
const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header will be added in Epic-1 Story-3 */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      {/* Footer will be added in Epic-1 Story-3 */}
    </Box>
  );
};

export default AppShell;
