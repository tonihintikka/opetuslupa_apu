import React from 'react';
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
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LessonFormData } from './LessonWizard';
import { lessonTopics, getTopicLabel } from '../../../constants/lessonTopics';
import { LearningStage } from '../../../services/db';

interface ExercisesStepProps {
  formData: LessonFormData;
  updateFormData: (data: Partial<LessonFormData>) => void;
}

const ExercisesStep: React.FC<ExercisesStepProps> = ({ formData, updateFormData }) => {
  const { t } = useTranslation(['common', 'lessons']);

  const handleTopicChange = (event: SelectChangeEvent<typeof formData.topics>) => {
    const {
      target: { value },
    } = event;
    updateFormData({
      topics: typeof value === 'string' ? value.split(',') : value,
    });
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
          <List dense>
            {formData.topics.map(topicKey => {
              const topic = lessonTopics.find(t => t.key === topicKey);
              return (
                <ListItem key={topicKey}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(`lessons:topics.${topicKey}`, getTopicLabel(topicKey))}
                    secondary={topic?.stage ? stageLabels[topic.stage] : undefined}
                  />
                </ListItem>
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
                            <ListItemText primary={t(`lessons:topics.${topic.key}`, topic.label)} />
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
