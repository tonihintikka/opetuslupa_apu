import React, { useState, ReactNode } from 'react';
import { Lesson } from '../../services/db'; // Import Lesson type only
import LessonFormContext, { LessonFormContextType } from './LessonFormContextTypes';

/**
 * Interface for the Lesson Form Context
 * This context is ONLY for UI coordination, not data persistence
 */

/**
 * Create the context with undefined as default value
 */

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
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

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
    setEditingLesson(null);
    setPreSelectedTopics(options.topics);
    setPreSelectedSubTopics(options.subTopics ?? []);
    setPreSelectedStudentId(options.studentId);
    if (options.learningStage !== undefined) setLearningStage(options.learningStage);
    if (options.draftId !== undefined) setDraftId(options.draftId);
    setIsOpen(true);
  };

  /**
   * Open the lesson form specifically for editing an existing lesson
   */
  const openForEditing = (lesson: Lesson) => {
    setEditingLesson(lesson);
    // Extract topic IDs from topicRatings array
    const topicIds = lesson.topicRatings.map(tr => tr.topicId);
    setPreSelectedTopics(topicIds);
    setPreSelectedSubTopics(lesson.subTopics || []);
    setPreSelectedStudentId(lesson.studentId);
    setLearningStage(lesson.learningStage || undefined);
    setDraftId(undefined);
    setIsOpen(true);
  };

  /**
   * Reset all form state, including the editing lesson
   */
  const resetForm = () => {
    setIsOpen(false);
    setPreSelectedTopics([]);
    setPreSelectedSubTopics([]);
    setPreSelectedStudentId(undefined);
    setLearningStage(undefined);
    setDraftId(undefined);
    setEditingLesson(null);
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
    editingLesson,
    setEditingLesson,
    resetForm,
    openWithSelections,
    openForEditing,
  };

  return <LessonFormContext.Provider value={value}>{children}</LessonFormContext.Provider>;
}
