import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface TipAccordionProps {
  id: string;
  titleKey: string;
  overviewKey: string;
  tips: string[];
}

/**
 * A reusable accordion component for displaying teaching tips by topic area.
 */
const TipAccordion: React.FC<TipAccordionProps> = ({ id, titleKey, overviewKey, tips }) => {
  const { t } = useTranslation(['lessons']);
  const theme = useTheme();

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}
      >
        <Typography variant="h6">{t(titleKey)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1, fontStyle: 'italic', color: 'text.secondary' }}>
            {t(overviewKey)}
          </Typography>
        </Box>
        <List disablePadding>
          {tips.map((tip, index) => (
            <ListItem
              key={index}
              sx={{
                py: 0.5,
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                pl: 2,
                mb: 1,
                bgcolor: 'background.paper',
                borderRadius: '0 4px 4px 0',
              }}
            >
              <ListItemText primary={t(tip)} />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default TipAccordion;
