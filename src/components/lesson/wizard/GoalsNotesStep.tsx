import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Chip,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LessonFormData } from './LessonWizard';

interface GoalsNotesStepProps {
  formData: LessonFormData;
  updateFormData: (data: Partial<LessonFormData>) => void;
}

const GoalsNotesStep: React.FC<GoalsNotesStepProps> = ({ formData, updateFormData }) => {
  const { t } = useTranslation(['common', 'lessons']);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('lessons:wizard.goalsNotes.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('lessons:wizard.goalsNotes.description')}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('lessons:wizard.goalsNotes.lessonSummary')}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('lessons:forms.dateLabel')}:
              </Typography>
              <Typography variant="body1">
                {new Date(formData.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('lessons:forms.timeLabel')}:
              </Typography>
              <Typography variant="body1">
                {formData.startTime} - {formData.endTime}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('lessons:forms.learningStageLabel')}:
              </Typography>
              <Typography variant="body1">
                {formData.learningStage && t(`lessons:stages.${formData.learningStage}`)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('lessons:forms.topicsLabel')}:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {formData.topics.map(topic => (
                  <Chip
                    key={topic}
                    label={t(`lessons:topics.${topic}`)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('lessons:forms.notesLabel')}
            value={formData.notes}
            onChange={e => updateFormData({ notes: e.target.value })}
            placeholder={t('lessons:wizard.goalsNotes.notesPlaceholder')}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.completed}
                onChange={e => updateFormData({ completed: e.target.checked })}
                color="primary"
              />
            }
            label={t('lessons:forms.markAsCompleted')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default GoalsNotesStep;
