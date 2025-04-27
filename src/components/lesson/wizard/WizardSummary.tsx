import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Divider,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  DirectionsCar as CarIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LessonFormData } from './LessonWizard';
import { Student } from '../../../services/db';

interface WizardSummaryProps {
  formData: LessonFormData;
  students: Student[];
  currentStep: number;
}

const WizardSummary: React.FC<WizardSummaryProps> = ({ formData, students, currentStep }) => {
  const { t } = useTranslation(['common', 'lessons']);

  // Find the selected student's name
  const studentName = students.find(s => s.id === Number(formData.studentId))?.name || '';

  // Determine what sections to show based on current step
  const showBasicInfo = true; // Always show basic info
  const showTopics = currentStep >= 1; // Show topics after step 1
  const showNotes = currentStep >= 2; // Show notes after step 2

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {t('lessons:wizard.summaryTitle', 'Lesson Summary')}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t('lessons:wizard.summarySubtitle', 'Your progress so far')}
      </Typography>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {showBasicInfo && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {t('lessons:wizard.steps.basicInfo', 'Basic Information')}
            </Typography>
            <List dense disablePadding>
              {studentName && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('lessons:forms.studentLabel', 'Student')}
                    secondary={studentName}
                  />
                </ListItem>
              )}

              {formData.date && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CalendarIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('lessons:forms.dateLabel', 'Date')}
                    secondary={new Date(formData.date).toLocaleDateString()}
                  />
                </ListItem>
              )}

              {formData.startTime && formData.endTime && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ScheduleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('lessons:forms.timeLabel', 'Time')}
                    secondary={`${formData.startTime} - ${formData.endTime}`}
                  />
                </ListItem>
              )}

              {formData.learningStage && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <SchoolIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('lessons:forms.learningStageLabel', 'Learning Stage')}
                    secondary={t(`lessons:stages.${formData.learningStage}`)}
                  />
                </ListItem>
              )}

              {formData.kilometers && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CarIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('lessons:forms.kilometersLabel', 'Kilometers')}
                    secondary={formData.kilometers}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}

        {showTopics && formData.topics.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {t('lessons:wizard.steps.exercises', 'Selected Topics')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {formData.topics.map(topic => (
                <Chip
                  key={topic}
                  label={t(`lessons:topics.${topic}`)}
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<CheckCircleIcon />}
                />
              ))}
            </Box>
          </Box>
        )}

        {showNotes && formData.notes && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {t('lessons:wizard.steps.goalsNotes', 'Notes')}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {formData.notes}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Progress indicator */}
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary">
              {t('lessons:wizard.completionProgress', 'Completion progress')}
            </Typography>
            <Box
              sx={{
                mt: 0.5,
                height: 8,
                bgcolor: 'grey.200',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${(currentStep + 1) * 33.33}%`,
                  bgcolor: 'primary.main',
                  maxWidth: '100%',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default WizardSummary;
