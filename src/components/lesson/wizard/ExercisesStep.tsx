import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Checkbox,
  ListItemButton,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LessonFormData } from './LessonWizard';
import { lessonTopics, getTopicLabel } from '../../../constants/lessonTopics';
import { lessonSubTopics, getSubTopicsForTopic } from '../../../constants/lessonSubTopics';
import { LearningStage } from '../../../services/db';

interface ExercisesStepProps {
  formData: LessonFormData;
  updateFormData: (data: Partial<LessonFormData>) => void;
}

const ExercisesStep: React.FC<ExercisesStepProps> = ({ formData, updateFormData }) => {
  const { t } = useTranslation(['common', 'lessons']);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  // Initialize subTopics state if it's not present
  useEffect(() => {
    if (!formData.subTopics) {
      updateFormData({ subTopics: [] });
    }
  }, [formData.subTopics, updateFormData]);

  const handleTopicChange = (event: SelectChangeEvent<typeof formData.topics>) => {
    const {
      target: { value },
    } = event;
    const newTopics = typeof value === 'string' ? value.split(',') : value;

    // When removing topics, also remove associated sub-topics
    if (formData.subTopics && formData.subTopics.length > 0) {
      const removedTopics = formData.topics.filter(t => !newTopics.includes(t));
      if (removedTopics.length > 0) {
        const remainingSubTopics = formData.subTopics.filter(st => {
          const parentTopic = lessonSubTopics.find(s => s.key === st)?.parentTopicKey;
          return !removedTopics.includes(parentTopic || '');
        });

        updateFormData({
          topics: newTopics,
          subTopics: remainingSubTopics,
        });
        return;
      }
    }

    updateFormData({
      topics: newTopics,
    });
  };

  // Toggle topic expansion for sub-topics
  const handleToggleExpand = (topicKey: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicKey) ? prev.filter(key => key !== topicKey) : [...prev, topicKey],
    );
  };

  // Handle sub-topic selection
  const handleSubTopicToggle = (subTopicKey: string) => {
    const currentSubTopics = formData.subTopics || [];
    const newSubTopics = currentSubTopics.includes(subTopicKey)
      ? currentSubTopics.filter(key => key !== subTopicKey)
      : [...currentSubTopics, subTopicKey];

    updateFormData({ subTopics: newSubTopics });
  };

  // Filter topics based on selected learning stage
  const filteredTopics = formData.learningStage
    ? lessonTopics.filter(topic => topic.stage === formData.learningStage)
    : lessonTopics;

  // Group topics by learning stage
  const stageLabels: Record<LearningStage, string> = {
    kognitiivinen: t('lessons:stages.cognitive', 'Kognitiivinen'),
    assosiatiivinen: t('lessons:stages.associative', 'Assosiatiivinen'),
    automaattinen: t('lessons:stages.automatic', 'Automaattinen'),
  };

  // Check if a topic has sub-topics
  const hasSubTopics = (topicKey: string) => {
    return getSubTopicsForTopic(topicKey).length > 0;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('lessons:wizard.exercises.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('lessons:wizard.exercises.description')}
      </Typography>

      <FormControl fullWidth required margin="normal">
        <InputLabel id="topics-select-label">{t('lessons:forms.topicsLabel')}</InputLabel>
        <Select
          labelId="topics-select-label"
          id="topics"
          multiple
          value={formData.topics}
          onChange={handleTopicChange}
          input={<OutlinedInput id="select-multiple-chip" label={t('lessons:forms.topicsLabel')} />}
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(value => (
                <Chip key={value} label={t(`lessons:topics.${value}`, getTopicLabel(value))} />
              ))}
            </Box>
          )}
        >
          {filteredTopics.map(topic => (
            <MenuItem key={topic.key} value={topic.key}>
              {t(`lessons:topics.${topic.key}`, topic.label)}
              {topic.stage && ` (${t(`lessons:stages.${topic.stage}`)})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {formData.topics.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {t('lessons:wizard.exercises.selectedTopics')}
          </Typography>
          <List>
            {formData.topics.map(topicKey => {
              const topic = lessonTopics.find(t => t.key === topicKey);
              const topicSubTopics = getSubTopicsForTopic(topicKey);
              const isExpanded = expandedTopics.includes(topicKey);

              return (
                <React.Fragment key={topicKey}>
                  <ListItem
                    secondaryAction={
                      topicSubTopics.length > 0 && (
                        <IconButton edge="end" onClick={() => handleToggleExpand(topicKey)}>
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      )
                    }
                  >
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(`lessons:topics.${topicKey}`, getTopicLabel(topicKey))}
                      secondary={topic?.stage ? stageLabels[topic.stage] : undefined}
                    />
                  </ListItem>

                  {topicSubTopics.length > 0 && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {topicSubTopics.map(subTopic => {
                          const isSelected = formData.subTopics?.includes(subTopic.key) || false;

                          return (
                            <ListItemButton
                              key={subTopic.key}
                              sx={{ pl: 4 }}
                              onClick={() => handleSubTopicToggle(subTopic.key)}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={isSelected}
                                  tabIndex={-1}
                                  disableRipple
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={t(`lessons:subTopics.${subTopic.key}`, subTopic.label)}
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}

      {formData.learningStage && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {t('lessons:wizard.exercises.suggestedTopics')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {Object.entries(stageLabels).map(([stage, label]) => {
              // Only show the selected stage if a stage is selected
              if (formData.learningStage && stage !== formData.learningStage) return null;

              return (
                <Grid size={{ xs: 12, md: 6 }} key={stage}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {label}
                    </Typography>
                    <List dense>
                      {lessonTopics
                        .filter(topic => topic.stage === (stage as LearningStage))
                        .map(topic => (
                          <ListItem
                            key={topic.key}
                            sx={{
                              borderRadius: 1,
                              bgcolor: formData.topics.includes(topic.key)
                                ? 'action.selected'
                                : 'inherit',
                            }}
                          >
                            <ListItemText
                              primary={t(`lessons:topics.${topic.key}`, topic.label)}
                              secondary={
                                hasSubTopics(topic.key)
                                  ? t('lessons:hasSubTopics', 'Includes sub-topics')
                                  : undefined
                              }
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ExercisesStep;
