/**
 * Service Workerin rekisteröinti
 *
 * Tämä tiedosto huolehtii service workerin rekisteröinnistä, versiohallinasta
 * ja versioiden näyttämisestä käyttäjälle
 */

// Sovelluksen versio (pidetään samana kuin service workerissa)
export const APP_VERSION = '1.0.1';

/**
 * Rekisteröi service workerin
 */
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      // Rekisteröidään service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      if (registration.installing) {
        console.log('Service worker asennetaan');
      } else if (registration.waiting) {
        console.log('Service worker odottaa aktivointia');
      } else if (registration.active) {
        console.log('Service worker aktiivinen');
      }

      // Tarkistetaan versio kun service worker on aktiivinen
      if (registration.active) {
        checkServiceWorkerVersion(registration.active);
      }

      // Kuunnellaan päivitystapahtumia
      registration.addEventListener('updatefound', () => {
        // Uusi service worker on löydetty
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              // Uusi service worker on aktivoitu
              console.log('Uusi service worker aktivoitu');
              checkServiceWorkerVersion(newWorker);
            }
          });
        }
      });
    } catch (error) {
      console.error('Service workerin rekisteröinti epäonnistui:', error);
    }
  }
};

/**
 * Tarkistaa service workerin version
 */
const checkServiceWorkerVersion = (worker: ServiceWorker): void => {
  // Luodaan viestikanava
  const messageChannel = new MessageChannel();

  // Asetetaan viestinkäsittelijä kanavaan
  messageChannel.port1.onmessage = event => {
    if (event.data && event.data.type === 'VERSION_INFO') {
      const workerVersion = event.data.version;
      console.log(`Service Worker versio: ${workerVersion}`);

      // Verrataan sovelluksen ja service workerin versioita
      if (workerVersion !== APP_VERSION) {
        console.log('Versioristiriita: sovellus ja service worker eivät täsmää');

        // Tähän voi lisätä logiikkaa joka näyttää käyttäjälle päivitysviestin
        showUpdateNotification();
      }
    }
  };

  // Lähetetään versiontarkistuspyyntö service workerille
  worker.postMessage(
    {
      type: 'CHECK_VERSION',
    },
    [messageChannel.port2],
  );
};

/**
 * Näyttää päivitysilmoituksen käyttäjälle
 */
const showUpdateNotification = (): void => {
  // Tässä voisi käyttää MUI:n Snackbaria tai muuta ilmoitusta
  console.log(
    'Sovelluksesta on saatavilla uusi versio! Päivitä sivu ladataksesi uusimmat muutokset.',
  );

  // Voit toteuttaa tähän logiikan joka näyttää UI-ilmoituksen
};

/**
 * Kuuntelee service workerin viestejä
 */
export const listenForServiceWorkerUpdates = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'VERSION_UPDATED') {
        // Service workerin versio on päivittynyt
        console.log(`Service worker päivitetty versioon ${event.data.version}`);
        showUpdateNotification();
      }
    });
  }
};
