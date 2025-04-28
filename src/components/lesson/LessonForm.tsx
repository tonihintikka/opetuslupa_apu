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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Lesson, LearningStage, Student } from '../../services/db';
import { lessonTopics, getTopicLabel } from '../../constants/lessonTopics';

interface InitialTimes {
  startTime?: string;
  endTime?: string;
}

interface InitialData {
  studentId?: number;
  topics?: string[];
  subTopics?: string[];
}

interface LessonFormProps {
  students: Student[];
  lesson?: Lesson;
  onSubmit: (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialTimes?: InitialTimes;
  initialData?: InitialData;
}

interface FormErrors {
  studentId?: string;
  learningStage?: string;
  topics?: string;
  general?: string;
}

const LessonForm: React.FC<LessonFormProps> = ({
  students,
  lesson,
  onSubmit,
  onCancel,
  initialTimes,
  initialData,
}) => {
  const { t } = useTranslation(['common', 'lessons']);

  const [studentId, setStudentId] = useState<number | ''>(
    lesson?.studentId || initialData?.studentId || '',
  );
  const [date, setDate] = useState<string>(
    lesson?.date.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
  );
  const [startTime, setStartTime] = useState<string>(
    lesson?.startTime || initialTimes?.startTime || '09:00',
  );
  const [endTime, setEndTime] = useState<string>(
    lesson?.endTime || initialTimes?.endTime || '10:00',
  );
  const [learningStage, setLearningStage] = useState<LearningStage | ''>(
    lesson?.learningStage || '',
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    lesson?.topics || initialData?.topics || [],
  );
  const [notes, setNotes] = useState<string>(lesson?.notes || '');
  const [kilometers, setKilometers] = useState<string>(lesson?.kilometers?.toString() || '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update form when initialTimes or initialData changes
  useEffect(() => {
    if (initialTimes) {
      if (initialTimes.startTime) setStartTime(initialTimes.startTime);
      if (initialTimes.endTime) setEndTime(initialTimes.endTime);
    }
  }, [initialTimes]);

  // Effect for initialData updates
  useEffect(() => {
    if (initialData) {
      if (initialData.studentId) setStudentId(initialData.studentId);
      if (initialData.topics) setSelectedTopics(initialData.topics);
      // Handle subTopics if needed in the future
    }
  }, [initialData]);

  const handleTopicChange = (event: SelectChangeEvent<typeof selectedTopics>) => {
    const {
      target: { value },
    } = event;
    setSelectedTopics(typeof value === 'string' ? value.split(',') : value);
    setTouched({ ...touched, topics: true });
    validateField('topics', typeof value === 'string' ? value.split(',') : value);
  };

  const markAsTouched = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateField = (field: string, value: any): boolean => {
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
    // Mark all fields as touched
    const allTouched = {
      studentId: true,
      learningStage: true,
      topics: true,
    };
    setTouched({ ...touched, ...allTouched });

    // Validate all required fields
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

    const lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'> = {
      studentId: Number(studentId),
      date: new Date(date),
      startTime,
      endTime,
      learningStage: learningStage as LearningStage,
      topics: selectedTopics,
      notes,
      kilometers: kilometers ? Number(kilometers) : undefined,
      completed: lesson?.completed || false, // Assume not completed unless editing a completed one
    };
    onSubmit(lessonData);
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
            inputProps={{ step: 300 }} // 5 min steps
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
          <FormControl fullWidth required margin="normal">
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
            >
              {lessonTopics.map(topic => (
                <MenuItem key={topic.key} value={topic.key}>
                  {t(`lessons:topics.${topic.key}`, topic.label)} (
                  {t(`lessons:stages.${topic.stage}`)})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
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
            <Button onClick={onCancel} color="inherit">
              {t('common:buttons.cancel')}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {t('common:buttons.save')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LessonForm;
