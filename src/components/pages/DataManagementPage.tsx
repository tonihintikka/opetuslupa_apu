import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Alert,
  Divider,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  DeleteForever as DeleteIcon,
  Backup as BackupIcon,
  RestorePage as RestoreIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { dataManagementService } from '../../services';

/**
 * DataManagementPage component
 * Provides interface for export, import, and backup of application data
 */
const DataManagementPage: React.FC = () => {
  const { t } = useTranslation(['common']);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);
  
  // State for dialogs
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState<() => Promise<void>>(() => Promise.resolve());
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmDialogTitle, setConfirmDialogTitle] = useState('');
  
  // State for snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Export only student data
  const handleExportData = async () => {
    try {
      setIsLoading(true);
      const data = await dataManagementService.exportStudentData();
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ajokamu_data_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: t('notifications.exported'),
        severity: 'success',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      setSnackbar({
        open: true,
        message: `Error exporting data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Import student data
  const handleImportData = () => {
    if (importFileInputRef.current) {
      importFileInputRef.current.click();
    }
  };

  // Handle import file selection
  const handleImportFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Show confirmation dialog
    setConfirmDialogTitle(t('dataImport.confirmImport'));
    setConfirmDialogMessage(t('dataImport.importQuestion'));
    setConfirmDialogAction(() => async () => {
      try {
        setIsLoading(true);
        setConfirmDialogOpen(false);
        
        const result = await dataManagementService.importStudentData(file);
        
        setSnackbar({
          open: true,
          message: result.message,
          severity: result.success ? 'success' : 'error',
        });
      } catch (error) {
        console.error('Error importing data:', error);
        setSnackbar({
          open: true,
          message: `Error importing data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
        // Reset the file input
        if (importFileInputRef.current) {
          importFileInputRef.current.value = '';
        }
      }
    });
    setConfirmDialogOpen(true);
  };

  // Create a full backup including settings
  const handleCreateBackup = async () => {
    try {
      setIsLoading(true);
      const data = await dataManagementService.createFullBackup();
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ajokamu_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: t('notifications.exported'),
        severity: 'success',
      });
    } catch (error) {
      console.error('Error creating backup:', error);
      setSnackbar({
        open: true,
        message: `Error creating backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Restore from backup
  const handleRestoreBackup = () => {
    if (backupFileInputRef.current) {
      backupFileInputRef.current.click();
    }
  };

  // Handle backup file selection for restore
  const handleBackupFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Show confirmation dialog with warning about overwriting all data and settings
    setConfirmDialogTitle(t('dataManagement.backup.restoreTitle'));
    setConfirmDialogMessage(t('dataManagement.backup.restoreWarning'));
    setConfirmDialogAction(() => async () => {
      try {
        setIsLoading(true);
        setConfirmDialogOpen(false);
        
        const result = await dataManagementService.restoreFullBackup(file);
        
        setSnackbar({
          open: true,
          message: result.message,
          severity: result.success ? 'success' : 'error',
        });
        
        // If settings were restored, suggest reload
        if (result.success && result.settingsRestored) {
          setTimeout(() => {
            if (window.confirm(t('dataManagement.backup.reloadPrompt'))) {
              window.location.reload();
            }
          }, 1500);
        }
      } catch (error) {
        console.error('Error restoring backup:', error);
        setSnackbar({
          open: true,
          message: `Error restoring backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
        // Reset the file input
        if (backupFileInputRef.current) {
          backupFileInputRef.current.value = '';
        }
      }
    });
    setConfirmDialogOpen(true);
  };

  // Clear all data
  const handleClearData = () => {
    // Show confirmation dialog with warning about irreversible data deletion
    setConfirmDialogTitle(t('dataManagement.dangerZone.title'));
    setConfirmDialogMessage(t('dataManagement.dangerZone.description'));
    setConfirmDialogAction(() => async () => {
      try {
        setIsLoading(true);
        setConfirmDialogOpen(false);
        
        // Clear data but don't clear settings
        await dataManagementService.clearAllData(false);
        
        setSnackbar({
          open: true,
          message: t('dataManagement.dangerZone.successMessage'),
          severity: 'success',
        });
      } catch (error) {
        console.error('Error clearing data:', error);
        setSnackbar({
          open: true,
          message: `Error clearing data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    });
    setConfirmDialogOpen(true);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('dataManagement.title')}
      </Typography>

      <Alert severity="info" sx={{ my: 2 }}>
        {t('dataManagement.info')}
      </Alert>

      <Stack spacing={3} sx={{ mt: 3 }}>
        {/* Export Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('dataManagement.export.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dataManagement.export.description')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
              variant="contained" 
              startIcon={<ExportIcon />} 
              onClick={handleExportData}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : t('dataManagement.export.button')}
            </Button>
          </CardActions>
        </Card>

        {/* Import Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('dataManagement.import.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dataManagement.import.description')}
            </Typography>
            <input
              type="file"
              accept=".json"
              ref={importFileInputRef}
              style={{ display: 'none' }}
              onChange={handleImportFileSelected}
            />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ImportIcon />}
              onClick={handleImportData}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : t('dataManagement.import.button')}
            </Button>
          </CardActions>
        </Card>

        {/* Create Backup Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('dataManagement.backup.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dataManagement.backup.description')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
              variant="outlined" 
              startIcon={<BackupIcon />} 
              onClick={handleCreateBackup}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : t('dataManagement.backup.button')}
            </Button>
          </CardActions>
        </Card>

        {/* Restore Backup Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('dataManagement.backup.restoreTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dataManagement.backup.restoreDescription')}
            </Typography>
            <input
              type="file"
              accept=".json"
              ref={backupFileInputRef}
              style={{ display: 'none' }}
              onChange={handleBackupFileSelected}
            />
          </CardContent>
          <CardActions>
            <Button 
              variant="outlined" 
              color="secondary"
              startIcon={<RestoreIcon />} 
              onClick={handleRestoreBackup}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : t('dataManagement.backup.restoreButton')}
            </Button>
          </CardActions>
        </Card>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Danger Zone */}
      <Paper sx={{ p: 2, backgroundColor: theme => theme.palette.error.light }}>
        <Typography variant="h6" sx={{ color: 'error.contrastText' }}>
          {t('dataManagement.dangerZone.title')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'error.contrastText', mb: 2 }}>
          {t('dataManagement.dangerZone.description')}
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleClearData}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : t('dataManagement.dangerZone.button')}
        </Button>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>{confirmDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            {t('buttons.cancel')}
          </Button>
          <Button onClick={() => confirmDialogAction()} color="primary" autoFocus>
            {t('buttons.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default DataManagementPage;
