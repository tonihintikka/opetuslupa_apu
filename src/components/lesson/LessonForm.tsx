import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Grid,
  FormHelperText,
  Alert,
  FormControlLabel,
  Checkbox,
  Rating,
  Typography,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Lesson, LearningStage, Student, TopicRating } from '../../services/db';
import { lessonTopics, getTopicLabel } from '../../constants/lessonTopics';
import { useLessonForm } from './useLessonForm';

interface FormErrors {
  studentId?: string;
  learningStage?: string;
  topics?: string;
  general?: string;
}

const LessonForm: React.FC<{
  students: Student[];
  onSubmit: (
    lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>,
    editingId?: number,
  ) => void;
  onCancel: () => void;
}> = ({ students, onSubmit, onCancel }) => {
  const { t } = useTranslation(['common', 'lessons']);
  const { editingLesson, preSelectedStudentId, preSelectedTopics, resetForm } = useLessonForm();

  const [studentId, setStudentId] = useState<number | ''>('');
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [learningStage, setLearningStage] = useState<LearningStage | ''>('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topicRatingsMap, setTopicRatingsMap] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<string>('');
  const [kilometers, setKilometers] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (editingLesson) {
      setStudentId(editingLesson.studentId || '');
      setDate(editingLesson.date.toISOString().split('T')[0]);
      setStartTime(editingLesson.startTime || '09:00');
      setEndTime(editingLesson.endTime || '10:00');
      setLearningStage(editingLesson.learningStage || '');

      // Extract topic IDs and ratings from topicRatings
      const topicIds = editingLesson.topicRatings.map(tr => tr.topicId);
      setSelectedTopics(topicIds);

      // Build ratings map from topicRatings
      const ratingsMap: Record<string, number> = {};
      editingLesson.topicRatings.forEach(tr => {
        ratingsMap[tr.topicId] = tr.rating;
      });
      setTopicRatingsMap(ratingsMap);

      setNotes(editingLesson.notes || '');
      setKilometers(editingLesson.kilometers?.toString() || '');
      setIsCompleted(editingLesson.completed || false);
      setErrors({});
      setTouched({});
    } else {
      setStudentId(preSelectedStudentId || '');
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:00');
      setLearningStage('');

      // Initialize selected topics from preSelectedTopics (if any)
      const topicIds = preSelectedTopics || [];
      setSelectedTopics(topicIds);

      // Initialize ratings map with default value (0) for preselected topics
      const ratingsMap: Record<string, number> = {};
      topicIds.forEach(topicId => {
        ratingsMap[topicId] = 0;
      });
      setTopicRatingsMap(ratingsMap);

      setNotes('');
      setKilometers('');
      setIsCompleted(false);
      setErrors({});
      setTouched({});
    }
  }, [editingLesson, preSelectedStudentId, preSelectedTopics]);

  const handleTopicChange = (event: SelectChangeEvent<typeof selectedTopics>) => {
    const {
      target: { value },
    } = event;
    const newSelectedTopics = typeof value === 'string' ? value.split(',') : value;
    setSelectedTopics(newSelectedTopics);
    setTouched({ ...touched, topics: true });
    validateField('topics', newSelectedTopics);

    // Update ratings map when topics are selected/deselected
    const newRatingsMap = { ...topicRatingsMap };

    // Add new topics with default rating 0
    newSelectedTopics.forEach(topicId => {
      if (!(topicId in newRatingsMap)) {
        newRatingsMap[topicId] = 0;
      }
    });

    // Remove ratings for deselected topics
    Object.keys(newRatingsMap).forEach(topicId => {
      if (!newSelectedTopics.includes(topicId)) {
        delete newRatingsMap[topicId];
      }
    });

    setTopicRatingsMap(newRatingsMap);
  };

  const handleRatingChange = (topicId: string, newValue: number | null) => {
    setTopicRatingsMap(prev => ({
      ...prev,
      [topicId]: newValue ?? 0,
    }));
  };

  const markAsTouched = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateField = (
    field: string,
    value: string | number | string[] | null | undefined,
  ): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    switch (field) {
      case 'studentId':
        if (!value) {
          newErrors.studentId = t('validation.required');
          isValid = false;
        } else {
          delete newErrors.studentId;
        }
        break;
      case 'learningStage':
        if (!value) {
          newErrors.learningStage = t('validation.required');
          isValid = false;
        } else {
          delete newErrors.learningStage;
        }
        break;
      case 'topics':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors.topics = t('validation.required');
          isValid = false;
        } else {
          delete newErrors.topics;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateForm = (): boolean => {
    const allTouched = {
      studentId: true,
      learningStage: true,
      topics: true,
    };
    setTouched({ ...touched, ...allTouched });

    const studentIdValid = validateField('studentId', studentId);
    const learningStageValid = validateField('learningStage', learningStage);
    const topicsValid = validateField('topics', selectedTopics);

    return studentIdValid && learningStageValid && topicsValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      setErrors(prev => ({ ...prev, general: t('validation.checkFields') }));
      return;
    }

    // Convert topicRatingsMap to the array format expected by the database
    const topicRatings: TopicRating[] = selectedTopics.map(topicId => ({
      topicId,
      rating: topicRatingsMap[topicId] || 0,
    }));

    const lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'> = {
      studentId: Number(studentId),
      date: new Date(date),
      startTime,
      endTime,
      learningStage: learningStage as LearningStage,
      topicRatings,
      notes,
      kilometers: kilometers ? Number(kilometers) : undefined,
      completed: isCompleted,
    };
    onSubmit(lessonData, editingLesson?.id);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  // Get the label for a topic based on its ID
  const getTopicLabelWithStage = (topicId: string): string => {
    const topic = lessonTopics.find(t => t.key === topicId);
    if (!topic) return topicId;

    return `${t(`lessons:topics.${topic.key}`, topic.label)} (${t(`lessons:stages.${topic.stage}`)})`;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl
            fullWidth
            required
            margin="normal"
            error={touched.studentId && !!errors.studentId}
          >
            <InputLabel id="student-select-label">{t('lessons:forms.studentLabel')}</InputLabel>
            <Select
              labelId="student-select-label"
              id="studentId"
              value={studentId}
              label={t('lessons:forms.studentLabel')}
              onChange={e => {
                setStudentId(e.target.value as number);
                validateField('studentId', e.target.value);
              }}
              onBlur={() => markAsTouched('studentId')}
            >
              {students.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
            {touched.studentId && errors.studentId && (
              <FormHelperText error>{errors.studentId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl
            fullWidth
            required
            margin="normal"
            error={touched.learningStage && !!errors.learningStage}
          >
            <InputLabel id="learning-stage-select-label">
              {t('lessons:forms.learningStageLabel')}
            </InputLabel>
            <Select
              labelId="learning-stage-select-label"
              id="learningStage"
              value={learningStage}
              label={t('lessons:forms.learningStageLabel')}
              onChange={e => {
                setLearningStage(e.target.value as LearningStage);
                validateField('learningStage', e.target.value);
              }}
              onBlur={() => markAsTouched('learningStage')}
            >
              <MenuItem value="kognitiivinen">{t('lessons:stages.cognitive')}</MenuItem>
              <MenuItem value="assosiatiivinen">{t('lessons:stages.associative')}</MenuItem>
              <MenuItem value="automaattinen">{t('lessons:stages.automatic')}</MenuItem>
            </Select>
            {touched.learningStage && errors.learningStage && (
              <FormHelperText error>{errors.learningStage}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="date"
            label={t('lessons:forms.dateLabel')}
            name="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="startTime"
            label={t('lessons:forms.startTimeLabel')}
            name="startTime"
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="endTime"
            label={t('lessons:forms.endTimeLabel')}
            name="endTime"
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth required margin="normal" error={touched.topics && !!errors.topics}>
            <InputLabel id="topics-select-label">{t('lessons:forms.topicsLabel')}</InputLabel>
            <Select
              labelId="topics-select-label"
              id="topics"
              multiple
              value={selectedTopics}
              onChange={handleTopicChange}
              input={
                <OutlinedInput id="select-multiple-chip" label={t('lessons:forms.topicsLabel')} />
              }
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => (
                    <Chip key={value} label={t(`lessons:topics.${value}`, getTopicLabel(value))} />
                  ))}
                </Box>
              )}
              onBlur={() => markAsTouched('topics')}
            >
              {lessonTopics.map(topic => (
                <MenuItem key={topic.key} value={topic.key}>
                  {t(`lessons:topics.${topic.key}`, topic.label)} (
                  {t(`lessons:stages.${topic.stage}`)})
                </MenuItem>
              ))}
            </Select>
            {touched.topics && errors.topics && (
              <FormHelperText error>{errors.topics}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Topic Ratings Section */}
        {selectedTopics.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('lessons:forms.topicRatingsLabel', 'Topic Performance Ratings')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t(
                  'lessons:forms.topicRatingsHelp',
                  "Rate the student's performance for each topic on a scale of 1-5 stars.",
                )}
              </Typography>

              {selectedTopics.map(topicId => (
                <Box
                  key={topicId}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 'medium', flex: 1 }}>
                    {getTopicLabelWithStage(topicId)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      name={`rating-${topicId}`}
                      value={topicRatingsMap[topicId] || 0}
                      onChange={(event, newValue) => handleRatingChange(topicId, newValue)}
                      precision={1}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1, minWidth: '24px' }}
                    >
                      {topicRatingsMap[topicId] || 0}/5
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            margin="normal"
            fullWidth
            id="kilometers"
            label={t('lessons:forms.kilometersLabel', 'Kilometers')}
            name="kilometers"
            type="number"
            value={kilometers}
            onChange={e => setKilometers(e.target.value)}
            inputProps={{ min: 0, step: 0.1 }}
          />
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{ display: 'flex', alignItems: 'center', mt: { xs: 0, sm: 1 } }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isCompleted}
                onChange={e => setIsCompleted(e.target.checked)}
                name="completed"
              />
            }
            label={t('lessons:forms.markAsCompleted', 'Mark as Completed')}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            margin="normal"
            fullWidth
            id="notes"
            label={t('lessons:forms.notesLabel')}
            name="notes"
            multiline
            rows={4}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button onClick={handleCancel} color="inherit">
              {t('common:buttons.cancel')}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingLesson ? t('common:buttons.update') : t('common:buttons.save')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LessonForm;
