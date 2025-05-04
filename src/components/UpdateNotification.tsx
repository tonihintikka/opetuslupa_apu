import React, { useState, useEffect } from 'react';
import { Snackbar, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Päivitysilmoituskomponentti
 *
 * Näyttää ilmoituksen kun sovelluksesta on saatavilla uusi versio
 */
const UpdateNotification: React.FC = () => {
  const { t } = useTranslation(['common']);
  const [showUpdateMessage, setShowUpdateMessage] = useState<boolean>(false);

  useEffect(() => {
    // Kuunnellaan viestejä service workerilta
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'VERSION_UPDATED') {
        setShowUpdateMessage(true);
      }
    };

    // Rekisteröidään tapahtumakuuntelija
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    // Poistetaan tapahtumakuuntelija kun komponentti unmountataan
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  // Päivitä sivu
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Snackbar
      open={showUpdateMessage}
      message={t('updateNotification.newVersion')}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      action={
        <Box>
          <Button color="primary" size="small" onClick={handleRefresh}>
            {t('updateNotification.refresh')}
          </Button>
        </Box>
      }
    />
  );
};

export default UpdateNotification;
