import React from 'react';
import { Typography, SxProps, Theme, Button, Paper } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import AddIcon from '@mui/icons-material/Add';

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
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        width: '100%',
        mb: 2,
        ...sx,
      }}
    >
      {icon || <InboxIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: actionText ? 3 : 0,
          maxWidth: '90%',
          lineHeight: 1.5,
        }}
      >
        {message}
      </Typography>

      {actionText && onAction && (
        <Button
          variant="contained"
          color="primary"
          onClick={onAction}
          startIcon={<AddIcon />}
          sx={{
            mt: 2,
            px: 3,
            py: 1,
            borderRadius: 6,
            boxShadow: 2,
          }}
        >
          {actionText}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
