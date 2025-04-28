import { useContext } from 'react';
import LessonFormContext from './LessonFormContextTypes';

/**
 * Custom hook for using the Lesson Form Context
 * Throws an error if used outside of a LessonFormProvider
 */
export function useLessonForm() {
  const context = useContext(LessonFormContext);

  if (context === undefined) {
    throw new Error('useLessonForm must be used within a LessonFormProvider');
  }

  return context;
}

export default useLessonForm;
