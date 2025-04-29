import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Terms of Service page component
 */
const TermsOfService: React.FC = () => {
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
        {t('footer.termsOfService')}
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          AjoKamu - Käyttöehdot
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          1. Johdanto
        </Typography>
        <Typography paragraph>
          Nämä käyttöehdot koskevat AjoKamu-sovelluksen käyttöä. AjoKamu on harrastusprojektina
          kehitetty ajokoulutuksen seurantasovellus, jota saa käyttää vapaasti.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          2. Sovelluksen käyttö
        </Typography>
        <Typography paragraph>
          AjoKamu-sovellus tarjotaan käyttöön täysin ilmaiseksi ja ilman mitään
          sitoutumisvelvoitteita. Sovellus on tarkoitettu ajokoulutuksen seurantaan, mutta käyttäjä
          voi käyttää sitä myös muihin tarkoituksiin.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          3. Vastuuvapauslauseke
        </Typography>
        <Typography paragraph>
          Sovellus tarjotaan "sellaisenaan" ilman minkäänlaisia takuita, mukaan lukien mutta ei
          rajoittuen myyntikelpoisuuteen, soveltuvuuteen tiettyyn tarkoitukseen tai oikeuksien
          loukkaamattomuuteen. Sovelluksen kehittäjä ei ole missään tilanteessa vastuussa mistään
          vahingoista, jotka aiheutuvat sovelluksen käytöstä tai kyvyttömyydestä käyttää sovellusta.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          4. Harrastusprojekti
        </Typography>
        <Typography paragraph>
          AjoKamu on harrastusprojekti, eikä sillä ole kaupallisia tavoitteita. Kehittäjä tarjoaa
          sovelluksen käyttöön hyvässä uskossa, mutta ei anna mitään takeita sen soveltuvuudesta,
          tarkkuudesta tai käytettävyydestä mihinkään tiettyyn tarkoitukseen.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          5. Tietosuoja
        </Typography>
        <Typography paragraph>
          Sovelluksen tietosuojakäytännöt on kuvattu erillisessä tietosuojaselosteessa. Sovellus
          noudattaa EU:n tietosuoja-asetuksen (GDPR) mukaisia periaatteita.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          6. Ohjelmistovirheet ja toimintahäiriöt
        </Typography>
        <Typography paragraph>
          Vaikka pyrimme tarjoamaan mahdollisimman laadukkaan sovelluksen, emme voi taata sen
          toimivuutta kaikissa tilanteissa. Kehittäjä ei vastaa sovelluksen mahdollisista virheistä
          tai toimintahäiriöistä tai niiden aiheuttamista vahingoista.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          7. Sovellettava laki
        </Typography>
        <Typography paragraph>Näihin käyttöehtoihin sovelletaan Suomen lakia.</Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          8. Muutokset
        </Typography>
        <Typography paragraph>
          Pidätämme oikeuden muuttaa näitä käyttöehtoja milloin tahansa ilman erillistä ilmoitusta.
          Käyttämällä sovellusta hyväksyt voimassaolevat käyttöehdot.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic' }}>
          Viimeksi päivitetty: 28.4.2024
        </Typography>
      </Paper>
    </Box>
  );
};

export default TermsOfService;
