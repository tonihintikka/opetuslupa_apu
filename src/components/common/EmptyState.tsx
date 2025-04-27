import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * EmptyState component for displaying when there is no data to show
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data',
  message = 'There is nothing to display yet',
  icon,
  sx,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        ...sx,
      }}
    >
      {icon || <InboxIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;
