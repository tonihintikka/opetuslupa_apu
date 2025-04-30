// Export services from this file
import db, { Student, Lesson, Milestone, LessonDraft, TopicRating, LearningStage } from './db';
import lessonService from './lessonService';
import studentService from './studentService';
import milestoneService from './milestoneService';
import draftLessonService from './draftLessonService';
import dataManagementService from './dataManagementService';
import settingsService from './settingsService';
import initializeDatabase from './dbInit';

// Export services
export {
  db,
  lessonService,
  studentService,
  milestoneService,
  draftLessonService,
  dataManagementService,
  settingsService,
  initializeDatabase,
};

// Export types
export type { Student, Lesson, Milestone, LessonDraft, TopicRating, LearningStage };
