import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');

  // Initial tip data structure based on our epic/story research
  // This would eventually come from a service or be integrated with translations
  const tipSections: TeachingTipSection[] = [
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
  ];

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
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t('lessons:tips.title', 'Teaching Tips')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
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
          sx={{ mb: 2 }}
        />

        <Divider sx={{ mb: 3 }} />
      </Box>

      <Box
        sx={{
          maxHeight: isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 250px)',
          overflowY: 'auto',
          pr: 1,
        }}
      >
        {filteredSections.length > 0 ? (
          filteredSections.map(section => (
            <Box key={section.id} sx={{ mb: 2 }}>
              <TipAccordion
                id={section.id}
                titleKey={section.titleKey}
                overviewKey={section.overviewKey}
                tips={section.tips}
              />
            </Box>
          ))
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
