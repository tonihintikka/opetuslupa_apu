import React from 'react';
import { Box, Typography, SxProps, Theme, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
  actionText?: string;
  onAction?: () => void;
}

/**
 * EmptyState component for displaying when there is no data to show
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data',
  message = 'There is nothing to display yet',
  icon,
  sx,
  actionText,
  onAction,
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
      <Typography variant="body2" color="text.secondary" sx={{ mb: actionText ? 3 : 0 }}>
        {message}
      </Typography>
      
      {actionText && onAction && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
