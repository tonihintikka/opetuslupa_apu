# Driving-Lesson Tracker - Cursor Rules Yhteenveto

Tässä projektissa on käytössä seuraavat Cursor-säännöt, jotka ohjaavat kehitystä ja varmistavat yhtenäiset käytännöt:

## 1. State Management (`driving-store-agent.mdc`)

Tämä sääntö ohjaa Dexie (IndexedDB) -pohjaisen `useDrivingStore`-hookin käyttöä:

- Komponentit käyttävät aina `useDrivingStore`-hookia (ei suoria Dexie-kutsuja)
- Dexie-logiikka on kapseloitu hookin sisälle
- Asynkroniset operaatiot käsitellään oikein (async/await, virheenkäsittely)
- Tietorakenteet ovat selkeästi määritelty TypeScript-rajapinnoilla
- Dexie-skeeman päivitykset tehdään huolella versionumeroa kasvattaen
- Hookin tila pidetään minimalistisena

## 2. Material-UI Komponentit (`mui-standards-agent.mdc`)

Tämä sääntö ohjaa MUI-komponenttien käyttöä ja tyylittelyä:

- Tyylittelyssä käytetään aina projektin teemaa
- Responsiivisuus varmistetaan MUI:n työkaluilla
- Propsit määritellään TypeScript-rajapinnoilla
- Monimutkainen UI kootaan pienistä komponenteista
- Lomakkeissa käytetään validointia
- MUI:n komponentteja käytetään tarkoituksenmukaisesti
- Sekä vaalea että tumma teema toimivat
- Saavutettavuus huomioidaan

## 3. PWA Konfiguraatio (`pwa-config-agent.mdc`)

Tämä sääntö ohjaa PWA-ominaisuuksien toteutusta:

- PWA toteutetaan `vite-plugin-pwa`:lla
- Välimuististrategiat valitaan oikein: NetworkFirst, CacheFirst, StaleWhileRevalidate
- Offline-toimivuus varmistetaan
- Web App Manifest sisältää kaikki tarvittavat tiedot
- Service Worker rekisteröidään turvallisesti
- Välimuisti versiointi on käytössä
- Päivitykset käsitellään hallitusti
- PWA-ominaisuudet testataan säännöllisesti

## 4. JSON Export/Import (`json-data-agent.mdc`)

Tämä sääntö ohjaa datan vienti/tuonti-toimintoja:

- Vientitiedostoihin sisällytetään versiotiedot yhteensopivuuden varmistamiseksi
- Tuontidatan validointi suoritetaan perusteellisesti
- Virhetilanteet käsitellään hallitusti
- Käyttäjät voivat viedä erilaisia dataosajoukkoja
- Arkaluontoisen datan käsittelyssä huomioidaan tietoturva
- TypeScript-tyypitykset määritellään vienti/tuontifunktioille
- Suurienkin datajoukkojen käsittely on asynkronista
- Käyttäjälle annetaan selkeää palautetta operaatioiden aikana

## 5. Teknologiapino (`tech-stack-agent.mdc`)

Tämä sääntö määrittelee käytettävät teknologiat ja kirjastoversiot:

- **Ydinteknologiat:**
  - Vite 6.x kehitysympäristönä
  - TypeScript 5.x strict-moodissa
  - React 18.x ja yhteensopivat tyyppimäärittelyt
  - ESLint ja TypeScript-tuki

- **UI-kirjastot:**
  - Material-UI (MUI) 5.x 
  - Emotion styling engine
  - Keskitetty teemaobjekti vaalea/tumma -tuella

- **Tietokanta:**
  - Dexie.js 3.x IndexedDB:n käyttöön
  - dexie-react-hooks reaktiiviseen datanhallintaan
  - dexie-export-import JSON-vientiin/tuontiin
  - Zod-validointi tuontidatalle

- **PWA-ominaisuudet:**
  - vite-plugin-pwa 0.18.x tai uudempi
  - Workbox-välimuististrategiat tiedostotyypeittäin
  - Kattava Web App Manifest
  - Service Worker -hallinta

- **Paketinhallinta:**
  - Semantic versioning (^) -prefiksillä
  - Yhteensopivat versiot kirjastojen välillä

Näitä sääntöjä noudattamalla varmistetaan sovelluksen yhtenäinen rakenne, koodityyli ja toimintalogiikka koko sovelluksessa. 