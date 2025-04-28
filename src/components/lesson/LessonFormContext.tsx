import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * Interface for the Lesson Form Context
 * This context is ONLY for UI coordination, not data persistence
 */
interface LessonFormContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  preSelectedTopics: string[];
  setPreSelectedTopics: (topics: string[]) => void;
  preSelectedSubTopics: string[];
  setPreSelectedSubTopics: (subTopics: string[]) => void;
  preSelectedStudentId?: number;
  setPreSelectedStudentId: (studentId?: number) => void;
  learningStage?: string;
  setLearningStage: (stage?: string) => void;
  draftId?: number;
  setDraftId: (id?: number) => void;
  resetForm: () => void;
  /**
   * Open the lesson form with pre-selected options (topics, subTopics, studentId, stage, draft)
   */
  openWithSelections: (options: {
    topics: string[];
    subTopics?: string[];
    studentId?: number;
    learningStage?: string;
    draftId?: number;
  }) => void;
}

/**
 * Create the context with undefined as default value
 */
const LessonFormContext = createContext<LessonFormContextType | undefined>(undefined);

/**
 * Props for the LessonFormProvider component
 */
interface LessonFormProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the Lesson Form Context
 */
export function LessonFormProvider({ children }: LessonFormProviderProps) {
  // State for UI coordination
  const [isOpen, setIsOpen] = useState(false);
  const [preSelectedTopics, setPreSelectedTopics] = useState<string[]>([]);
  const [preSelectedSubTopics, setPreSelectedSubTopics] = useState<string[]>([]);
  const [preSelectedStudentId, setPreSelectedStudentId] = useState<number | undefined>();
  const [learningStage, setLearningStage] = useState<string | undefined>();
  const [draftId, setDraftId] = useState<number | undefined>();

  /**
   * Open the lesson form with specified selections and open the dialog
   */
  const openWithSelections = (options: {
    topics: string[];
    subTopics?: string[];
    studentId?: number;
    learningStage?: string;
    draftId?: number;
  }) => {
    setPreSelectedTopics(options.topics);
    setPreSelectedSubTopics(options.subTopics ?? []);
    setPreSelectedStudentId(options.studentId);
    if (options.learningStage !== undefined) setLearningStage(options.learningStage);
    if (options.draftId !== undefined) setDraftId(options.draftId);
    setIsOpen(true);
  };

  /**
   * Reset all form state
   */
  const resetForm = () => {
    setIsOpen(false);
    setPreSelectedTopics([]);
    setPreSelectedSubTopics([]);
    setPreSelectedStudentId(undefined);
    setLearningStage(undefined);
    setDraftId(undefined);
  };

  // Create the context value
  const value: LessonFormContextType = {
    isOpen,
    setIsOpen,
    preSelectedTopics,
    setPreSelectedTopics,
    preSelectedSubTopics,
    setPreSelectedSubTopics,
    preSelectedStudentId,
    setPreSelectedStudentId,
    learningStage,
    setLearningStage,
    draftId,
    setDraftId,
    resetForm,
    openWithSelections,
  };

  return <LessonFormContext.Provider value={value}>{children}</LessonFormContext.Provider>;
}

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

/**
 * Export the context as well, in case direct access is needed
 */
export default LessonFormContext;
