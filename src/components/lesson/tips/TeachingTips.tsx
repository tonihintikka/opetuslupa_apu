import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Divider, Alert } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TipAccordion from './TipAccordion';

interface TeachingTipSection {
  id: string;
  titleKey: string;
  overviewKey: string;
  tips: string[];
}

/**
 * Displays teaching tips organized by topic area with search functionality.
 */
const TeachingTips: React.FC = () => {
  const { t } = useTranslation(['lessons']);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize the static tip sections data to prevent unnecessary dependency changes
  const tipSections: TeachingTipSection[] = useMemo(
    () => [
      {
        id: 'basicVehicleHandling',
        titleKey: 'lessons:tips.sections.basicHandling.title',
        overviewKey: 'lessons:tips.sections.basicHandling.overview',
        tips: [
          'lessons:tips.sections.basicHandling.tip1',
          'lessons:tips.sections.basicHandling.tip2',
          'lessons:tips.sections.basicHandling.tip3',
          'lessons:tips.sections.basicHandling.tip4',
          'lessons:tips.sections.basicHandling.tip5',
        ],
      },
      {
        id: 'trafficSituations',
        titleKey: 'lessons:tips.sections.trafficSituations.title',
        overviewKey: 'lessons:tips.sections.trafficSituations.overview',
        tips: [
          'lessons:tips.sections.trafficSituations.tip1',
          'lessons:tips.sections.trafficSituations.tip2',
          'lessons:tips.sections.trafficSituations.tip3',
          'lessons:tips.sections.trafficSituations.tip4',
        ],
      },
      {
        id: 'highwayDriving',
        titleKey: 'lessons:tips.sections.highwayDriving.title',
        overviewKey: 'lessons:tips.sections.highwayDriving.overview',
        tips: [
          'lessons:tips.sections.highwayDriving.tip1',
          'lessons:tips.sections.highwayDriving.tip2',
          'lessons:tips.sections.highwayDriving.tip3',
        ],
      },
      {
        id: 'parking',
        titleKey: 'lessons:tips.sections.parking.title',
        overviewKey: 'lessons:tips.sections.parking.overview',
        tips: [
          'lessons:tips.sections.parking.tip1',
          'lessons:tips.sections.parking.tip2',
          'lessons:tips.sections.parking.tip3',
          'lessons:tips.sections.parking.tip4',
        ],
      },
      {
        id: 'specialConditions',
        titleKey: 'lessons:tips.sections.specialConditions.title',
        overviewKey: 'lessons:tips.sections.specialConditions.overview',
        tips: [
          'lessons:tips.sections.specialConditions.tip1',
          'lessons:tips.sections.specialConditions.tip2',
          'lessons:tips.sections.specialConditions.tip3',
          'lessons:tips.sections.specialConditions.tip4',
        ],
      },
      {
        id: 'riskManagement',
        titleKey: 'lessons:tips.sections.riskManagement.title',
        overviewKey: 'lessons:tips.sections.riskManagement.overview',
        tips: [
          'lessons:tips.sections.riskManagement.tip1',
          'lessons:tips.sections.riskManagement.tip2',
          'lessons:tips.sections.riskManagement.tip3',
          'lessons:tips.sections.riskManagement.tip4',
        ],
      },
    ],
    [],
  );

  // For the MVP, we're just displaying placeholder content
  // Search functionality will be implemented in a future story
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter sections based on search term
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) {
      return tipSections;
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();

    return tipSections.filter(section => {
      // Check if title or overview match
      const titleMatches = t(section.titleKey).toLowerCase().includes(normalizedSearch);
      const overviewMatches = t(section.overviewKey).toLowerCase().includes(normalizedSearch);

      // Check if any tips match
      const tipsMatch = section.tips.some(tip => t(tip).toLowerCase().includes(normalizedSearch));

      return titleMatches || overviewMatches || tipsMatch;
    });
  }, [searchTerm, t, tipSections]);

  return (
    <Paper
      sx={{
        p: 2,
        pb: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {t('lessons:tips.title', 'Teaching Tips')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          {t(
            'lessons:tips.description',
            'Find teaching advice for various driving topics to help your students learn effectively.',
          )}
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('lessons:tips.searchPlaceholder', 'Search for tips...')}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />

        <Divider sx={{ mb: 2 }} />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
          pb: { xs: 'calc(56px + var(--safe-area-inset-bottom) + 16px)', md: 2 },
          // Ensure this container can expand to fit content
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {filteredSections.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
            {filteredSections.map(section => (
              <Box key={section.id}>
                <TipAccordion
                  id={section.id}
                  titleKey={section.titleKey}
                  overviewKey={section.overviewKey}
                  tips={section.tips}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Alert severity="info">
            {t(
              'lessons:tips.noResults',
              'No teaching tips match your search. Try different keywords.',
            )}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default TeachingTips;
