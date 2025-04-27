import React, { useState, useEffect } from 'react';
import { Box, Paper, Stepper, Step, StepLabel, Button, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Lesson, LearningStage, Student } from '../../../services/db';

// Import step components
import BasicInfoStep from './BasicInfoStep';
import ExercisesStep from './ExercisesStep';
import GoalsNotesStep from './GoalsNotesStep';
import WizardSummary from './WizardSummary';

export interface LessonFormData {
  studentId: number | '';
  date: string;
  startTime: string;
  endTime: string;
  learningStage: LearningStage | '';
  topics: string[];
  subTopics?: string[];
  notes: string;
  kilometers?: string;
  completed: boolean;
}

interface LessonWizardProps {
  students: Student[];
  initialData?: Partial<LessonFormData>;
  onSubmit: (lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const LessonWizard: React.FC<LessonWizardProps> = ({
  students,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation(['common', 'lessons']);
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  // Check for navigation state with pre-selected topics, sub-topics and student
  const locationState = location.state as {
    preSelectedTopics?: string[];
    preSelectedSubTopics?: string[];
    preSelectedStudentId?: number;
  } | null;

  // Initialize form data with anything passed from navigation or props
  const [formData, setFormData] = useState<LessonFormData>({
    studentId: initialData?.studentId || locationState?.preSelectedStudentId || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    startTime: initialData?.startTime || '09:00',
    endTime: initialData?.endTime || '10:00',
    learningStage: initialData?.learningStage || '',
    topics: initialData?.topics || locationState?.preSelectedTopics || [],
    subTopics: initialData?.subTopics || locationState?.preSelectedSubTopics || [],
    notes: initialData?.notes || '',
    kilometers: initialData?.kilometers || '',
    completed: initialData?.completed || false,
  });

  // Define steps
  const steps = [
    t('lessons:wizard.steps.basicInfo'),
    t('lessons:wizard.steps.exercises'),
    t('lessons:wizard.steps.goalsNotes'),
  ];

  // Handle form data updates from child components
  const updateFormData = (data: Partial<LessonFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Step navigation
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Submit final form data
  const handleSubmit = () => {
    if (!formData.studentId || !formData.learningStage || formData.topics.length === 0) {
      // Basic validation
      return;
    }

    const lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'> = {
      studentId: Number(formData.studentId),
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      learningStage: formData.learningStage,
      topics: formData.topics,
      subTopics: formData.subTopics,
      notes: formData.notes,
      kilometers: formData.kilometers ? Number(formData.kilometers) : undefined,
      completed: formData.completed,
    };

    onSubmit(lessonData);
  };

  // Render current step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep formData={formData} updateFormData={updateFormData} students={students} />
        );
      case 1:
        return <ExercisesStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <GoalsNotesStep formData={formData} updateFormData={updateFormData} />;
      default:
        return 'Unknown step';
    }
  };

  // If we receive a student ID and topics in the state, automatically advance to the exercises step
  useEffect(() => {
    if (
      activeStep === 0 &&
      locationState?.preSelectedStudentId &&
      locationState?.preSelectedTopics &&
      locationState.preSelectedTopics.length > 0
    ) {
      // Wait a moment to let the form initialize then go to exercises step
      const timer = setTimeout(() => {
        setActiveStep(1); // Go to exercises step
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [activeStep, locationState]);

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length ? (
        // Final step - summary
        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            {t('lessons:wizard.summaryTitle')}
          </Typography>
          <WizardSummary formData={formData} students={students} currentStep={activeStep} />
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={onCancel}>{t('actions.cancel')}</Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ ml: 1 }}>
              {t('lessons:wizard.createLesson')}
            </Button>
          </Box>
        </Box>
      ) : (
        // Step content with side summary
        <Grid container spacing={3}>
          {/* Main step content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                {t('lessons:wizard.back')}
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={onCancel}>{t('actions.cancel')}</Button>
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              >
                {activeStep === steps.length - 1
                  ? t('lessons:wizard.finish')
                  : t('lessons:wizard.next')}
              </Button>
            </Box>
          </Grid>

          {/* Side summary */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <WizardSummary formData={formData} students={students} currentStep={activeStep} />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default LessonWizard;
