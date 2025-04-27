import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Student, LearningStage } from '../../../services/db';
import { LessonFormData } from './LessonWizard';

interface BasicInfoStepProps {
  formData: LessonFormData;
  updateFormData: (data: Partial<LessonFormData>) => void;
  students: Student[];
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, updateFormData, students }) => {
  const { t } = useTranslation(['common', 'lessons']);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('lessons:wizard.basicInfo.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('lessons:wizard.basicInfo.description')}
      </Typography>

      <Grid container spacing={2}>
        {/* Student Selection */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required margin="normal">
            <InputLabel id="student-select-label">{t('lessons:forms.studentLabel')}</InputLabel>
            <Select
              labelId="student-select-label"
              id="studentId"
              value={formData.studentId}
              label={t('lessons:forms.studentLabel')}
              onChange={e => updateFormData({ studentId: e.target.value as number })}
            >
              {students.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Learning Stage */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required margin="normal">
            <InputLabel id="learning-stage-select-label">
              {t('lessons:forms.learningStageLabel', 'Learning Stage')}
            </InputLabel>
            <Select
              labelId="learning-stage-select-label"
              id="learningStage"
              value={formData.learningStage}
              label={t('lessons:forms.learningStageLabel', 'Learning Stage')}
              onChange={e => updateFormData({ learningStage: e.target.value as LearningStage })}
            >
              <MenuItem value="kognitiivinen">
                {t('lessons:stages.cognitive', 'Kognitiivinen')}
              </MenuItem>
              <MenuItem value="assosiatiivinen">
                {t('lessons:stages.associative', 'Assosiatiivinen')}
              </MenuItem>
              <MenuItem value="automaattinen">
                {t('lessons:stages.automatic', 'Automaattinen')}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Date */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="date"
            label={t('lessons:forms.dateLabel')}
            name="date"
            type="date"
            value={formData.date}
            onChange={e => updateFormData({ date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Start Time */}
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="startTime"
            label={t('lessons:forms.startTimeLabel', 'Start Time')}
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={e => updateFormData({ startTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }} // 5 min steps
          />
        </Grid>

        {/* End Time */}
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="endTime"
            label={t('lessons:forms.endTimeLabel', 'End Time')}
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={e => updateFormData({ endTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        </Grid>

        {/* Kilometers */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            margin="normal"
            fullWidth
            id="kilometers"
            label={t('lessons:forms.kilometersLabel', 'Kilometers')}
            name="kilometers"
            type="number"
            value={formData.kilometers}
            onChange={e => updateFormData({ kilometers: e.target.value })}
            inputProps={{ min: 0, step: 0.1 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInfoStep;
