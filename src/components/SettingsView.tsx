import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { dataManagementService } from '../services';
import { isIOS } from '../utils/platformDetection';

interface Backup {
  date: string;
  timestamp: number;
}

const SettingsView: React.FC = () => {
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [backups, setBackups] = useState<Backup[]>([]);
  const [showBackups, setShowBackups] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

  const handleExportData = async () => {
    try {
      const data = await dataManagementService.exportData();
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ajotunnit-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'Tietojen vienti onnistui',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Tietojen vienti epäonnistui: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`,
        severity: 'error',
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const result = await dataManagementService.importData(file);
        setSnackbar({
          open: true,
          message: result.message,
          severity: result.success ? 'success' : 'error',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Tietojen tuonti epäonnistui: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`,
          severity: 'error',
        });
      }
    };
    input.click();
  };

  const handleBackupData = async () => {
    try {
      await dataManagementService.backupData();
      setSnackbar({
        open: true,
        message: 'Varmuuskopio luotu onnistuneesti',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Varmuuskopiointi epäonnistui: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`,
        severity: 'error',
      });
    }
  };

  const handleClearAllData = () => {
    setConfirmMessage(
      'Tämä poistaa kaikki sovelluksen tiedot. Varmuuskopio luodaan automaattisesti. Haluatko jatkaa?',
    );
    setConfirmAction(() => async () => {
      try {
        await dataManagementService.clearAllData();
        setSnackbar({
          open: true,
          message: 'Kaikki tiedot poistettu onnistuneesti',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Tietojen poistaminen epäonnistui: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`,
          severity: 'error',
        });
      }
    });
    setConfirmDialogOpen(true);
  };

  const handleShowBackups = async () => {
    try {
      const backupsList = await dataManagementService.getBackups();
      setBackups(backupsList);
      setShowBackups(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Varmuuskopioiden hakeminen epäonnistui: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`,
        severity: 'error',
      });
    }
  };

  const handleRestoreBackup = (timestamp: number) => {
    setConfirmMessage('Tämä korvaa kaikki nykyiset tiedot varmuuskopiolla. Haluatko jatkaa?');
    setConfirmAction(() => async () => {
      try {
        await dataManagementService.restoreBackup(timestamp);
        setShowBackups(false);
        setSnackbar({
          open: true,
          message: 'Varmuuskopio palautettu onnistuneesti',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Varmuuskopion palauttaminen epäonnistui: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`,
          severity: 'error',
        });
      }
    });
    setConfirmDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('fi-FI');
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3 },
        maxWidth: 800,
        margin: '0 auto',
        height: 'auto',
        overscrollBehavior: isIOSDevice ? 'none' : 'auto',
        WebkitOverflowScrolling: 'touch',
        // Prevent automatic scrolling on iOS
        position: 'relative',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Asetukset
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Tietojen hallinta
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="outlined" color="primary" onClick={handleExportData} fullWidth>
              Vie kaikki tiedot (JSON)
            </Button>

            <Button variant="outlined" color="primary" onClick={handleImportData} fullWidth>
              Tuo tiedot tiedostosta
            </Button>

            <Button variant="outlined" color="primary" onClick={handleBackupData} fullWidth>
              Luo varmuuskopio
            </Button>

            <Button variant="outlined" color="primary" onClick={handleShowBackups} fullWidth>
              Hallitse varmuuskopioita
            </Button>

            <Button variant="outlined" color="error" onClick={handleClearAllData} fullWidth>
              Tyhjennä kaikki tiedot
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Backup List Dialog */}
      <Dialog open={showBackups} onClose={() => setShowBackups(false)} fullWidth maxWidth="sm">
        <DialogTitle>Varmuuskopiot</DialogTitle>
        <DialogContent>
          {backups.length === 0 ? (
            <DialogContentText>Ei varmuuskopioita saatavilla.</DialogContentText>
          ) : (
            <List>
              {backups.map(backup => (
                <ListItem
                  key={backup.timestamp}
                  secondaryAction={
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRestoreBackup(backup.timestamp)}
                    >
                      Palauta
                    </Button>
                  }
                >
                  <ListItemText primary={backup.date} secondary={formatDate(backup.timestamp)} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBackups(false)}>Sulje</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Vahvista toiminto</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Peruuta</Button>
          <Button
            onClick={() => {
              confirmAction();
              setConfirmDialogOpen(false);
            }}
            color="error"
            autoFocus
          >
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsView;
