import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Privacy Policy page component
 */
const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation(['common']);
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        maxHeight: {
          xs: 'calc(100vh - var(--app-bar-height) - var(--bottom-nav-height) - 32px)', // Account for AppBar, BottomNav, and padding
          md: 'calc(100vh - var(--app-bar-height) - 48px)', // Account for AppBar and padding on desktop
        },
        display: 'flex',
        flexDirection: 'column',
        pb: { xs: 'var(--bottom-nav-height)', md: 2 },
        pt: 4,
        px: 2,
        mx: 'auto',
        maxWidth: theme.breakpoints.values.md,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {t('footer.privacyPolicy')}
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          AjoKamu - Tietosuojaseloste
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          1. Johdanto
        </Typography>
        <Typography paragraph>
          Tässä tietosuojaselosteessa kerromme, miten AjoKamu-sovellus käsittelee henkilötietoja.
          AjoKamu on ajokoulutuksen seurantasovellus, joka on kehitetty harrastusprojektina.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          2. Tietojen tallentaminen
        </Typography>
        <Typography paragraph>
          Kaikki sovelluksessa syötetyt tiedot tallennetaan ainoastaan käyttäjän omalle laitteelle,
          paikalliseen tietokantaan. Mitään tietoja ei lähetetä sovelluksen kehittäjille tai
          kolmansille osapuolille.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          3. Oikeusperuste
        </Typography>
        <Typography paragraph>
          Käsittelemme tietoja sovelluksen toiminnallisuuden kannalta välttämättömän oikeutetun edun
          perusteella. Koska kaikki tiedot pysyvät laitteellasi, niiden käsittely on täysin sinun
          hallinnassasi.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          4. Rekisteröidyn oikeudet
        </Typography>
        <Typography paragraph>
          Sinulla on oikeus saada pääsy tietoihisi, oikaista tietoja, poistaa tiedot ja rajoittaa
          käsittelyä. Kaikki nämä toimenpiteet voit tehdä suoraan sovelluksessa, koska hallitset
          kaikkia tietoja itse.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          5. Tietojen säilytys
        </Typography>
        <Typography paragraph>
          Tietoja säilytetään laitteellasi niin kauan kuin sovellus on asennettuna tai kunnes
          poistat tiedot itse. Sovelluksen poistaminen laitteelta poistaa myös kaikki tallennetut
          tiedot.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          6. Kolmansien osapuolten pääsy
        </Typography>
        <Typography paragraph>
          Sovellus ei anna kenellekään kolmannelle osapuolelle pääsyä tietoihisi ilman nimenomaista
          suostumustasi.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          7. Käyttömäärien seuranta
        </Typography>
        <Typography paragraph>
          Saatamme kerätä anonyymejä käyttötilastoja sovelluksen käytöstä, kuten toimintojen
          käyttömääriä ja käyttöaikoja. Näitä tietoja käytetään vain sovelluksen kehittämiseen, eikä
          niitä voida yhdistää yksittäisiin käyttäjiin.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          8. Päivitykset
        </Typography>
        <Typography paragraph>
          Pidätämme oikeuden päivittää tätä tietosuojaselostetta tarpeen mukaan. Merkittävistä
          muutoksista ilmoitetaan sovelluksessa.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          9. Yhteydenotot
        </Typography>
        <Typography paragraph>
          Jos sinulla on kysyttävää tietosuojakäytännöistämme, ota yhteyttä sovelluksen kehittäjään.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic' }}>
          Viimeksi päivitetty: 28.4.2024
        </Typography>
      </Paper>
    </Box>
  );
};

export default PrivacyPolicy;
