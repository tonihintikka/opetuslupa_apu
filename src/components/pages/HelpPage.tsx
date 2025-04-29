import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  DirectionsCar as CarIcon,
  EmojiEvents as MilestoneIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

/**
 * Help page component
 * Provides user documentation, tutorials and FAQs
 */
const HelpPage: React.FC = () => {
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
        {t('footer.help')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          AjoKamu - {t('footer.help')}
        </Typography>

        <Typography paragraph>
          AjoKamu on ajokoulutuksen seurantasovellus, joka on suunniteltu auttamaan ajo-opettajia
          oppilaiden edistymisen seurannassa. Tällä sivulla löydät ohjeita sovelluksen käyttöön.
        </Typography>
      </Paper>

      {/* Getting Started Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('help.gettingStarted')}
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <SchoolIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="1. Lisää oppilas"
              secondary="Aloita lisäämällä oppilas Oppilaat-sivulla. Täytä oppilaan perustiedot."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CarIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="2. Aloita ajotunti"
              secondary="Valitse oppilas ja aloita uusi ajotunti Ajotunnit-sivulta. Voit käyttää myös suositeltuja aiheita."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MilestoneIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="3. Seuraa edistymistä"
              secondary="Tarkastele oppilaan edistymistä aihealueittain ja aseta tavoitteita Vinkit-sivulla."
            />
          </ListItem>
        </List>
      </Paper>

      {/* FAQ Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          {t('help.faq')}
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Miten sovellus tallentaa tiedot?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Kaikki tiedot tallennetaan ainoastaan laitteellesi. Mitään tietoja ei lähetetä
              ulkopuolisiin palveluihin tai pilveen. Voit varmuuskopioida tietosi Asetukset-sivulta.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Kuinka oppilaan edistymistä seurataan?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Sovellus laskee oppilaan edistymistä jokaisessa aiheessa ajotuntien yhteydessä
              annettujen arvioiden perusteella. Voit nähdä edistymisen visuaalisesti
              Ajotunnit-sivulla oppilaan kohdalla.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Voiko sovellusta käyttää ilman internetyhteyttä?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Kyllä! AjoKamu toimii täysin offline-tilassa, kun sovellus on kerran ladattu
              laitteellesi. Kaikki tiedot tallennetaan paikallisesti, joten voit käyttää sovellusta
              myös ilman internetyhteyttä.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Key Features Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('help.features')}
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Oppilaiden hallinta"
              secondary="Lisää, muokkaa ja poista oppilaita helposti."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Ajotuntien seuranta"
              secondary="Tallenna ajotuntien tiedot, aiheet ja arviot."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Edistymisen visualisointi"
              secondary="Näe oppilaiden edistyminen selkeistä kaavioista."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Oppimisvaiheiden tuki"
              secondary="Seuraa oppimista kognitiiviselta tasolta automaattiselle tasolle."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Tietojen vienti ja tuonti"
              secondary="Varmuuskopioi ja siirrä tiedot helposti."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" sx={{ mt: 2 }}>
          {t('help.contact')} <Link href="mailto:info@ajokamu.fi">{t('help.emailAddress')}</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default HelpPage;
