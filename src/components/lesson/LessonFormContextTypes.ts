import { createContext } from 'react';
import { Lesson } from '../../services/db';

/**
 * Interface for the Lesson Form Context
 * This context is ONLY for UI coordination, not data persistence
 */
export interface LessonFormContextType {
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
  editingLesson: Lesson | null;
  setEditingLesson: (lesson: Lesson | null) => void;
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
  /**
   * Open the lesson form for editing an existing lesson
   */
  openForEditing: (lesson: Lesson) => void;
}

/**
 * Create the context with undefined as default value
 */
const LessonFormContext = createContext<LessonFormContextType | undefined>(undefined);

export default LessonFormContext;
