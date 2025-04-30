import db, { LessonDraft, Lesson, TopicRating } from './db';
import lessonService from './lessonService';

/**
 * Service for managing lesson drafts
 */
export const draftLessonService = {
  /**
   * Get all lesson drafts
   */
  getAll: async (): Promise<LessonDraft[]> => {
    return await db.lessonDrafts.toArray();
  },

  /**
   * Get lesson drafts for a specific student
   */
  getByStudentId: async (studentId: number): Promise<LessonDraft[]> => {
    return await db.lessonDrafts.where('studentId').equals(studentId).toArray();
  },

  /**
   * Get a lesson draft by id
   */
  getById: async (id: number): Promise<LessonDraft | undefined> => {
    return await db.lessonDrafts.get(id);
  },

  /**
   * Add a new lesson draft or update if it has an ID
   */
  save: async (draft: Omit<LessonDraft, 'lastModified'>): Promise<number> => {
    const now = new Date();
    const draftWithUpdatedTime = {
      ...draft,
      lastModified: now,
    };

    if (draft.id) {
      await db.lessonDrafts.update(draft.id, draftWithUpdatedTime);
      return draft.id;
    } else {
      return await db.lessonDrafts.add(draftWithUpdatedTime);
    }
  },

  /**
   * Update an existing lesson draft
   */
  update: async (
    id: number,
    updates: Partial<Omit<LessonDraft, 'id' | 'draftCreatedAt' | 'lastModified'>>,
  ): Promise<number> => {
    const now = new Date();
    await db.lessonDrafts.update(id, {
      ...updates,
      lastModified: now,
    });
    return id;
  },

  /**
   * Delete a lesson draft
   */
  delete: async (id: number): Promise<void> => {
    await db.lessonDrafts.delete(id);
  },

  /**
   * Clean up old drafts that haven't been modified in a while
   * @param olderThan The date to compare against (delete drafts older than this)
   * @returns The number of drafts deleted
   */
  cleanupOldDrafts: async (olderThan: Date): Promise<number> => {
    return await db.lessonDrafts.where('lastModified').below(olderThan).delete();
  },

  /**
   * Convert a draft to a full lesson and delete the draft
   * @param draftId The ID of the draft to convert
   * @returns The ID of the newly created lesson
   */
  convertToLesson: async (draftId: number): Promise<number> => {
    // Use a transaction to ensure atomicity
    return await db.transaction('rw', [db.lessonDrafts, db.lessons], async () => {
      // Get the draft
      const draft = await db.lessonDrafts.get(draftId);
      if (!draft) {
        throw new Error(`Lesson draft with ID ${draftId} not found`);
      }

      // Create a new lesson from the draft
      const lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'> = {
        studentId: draft.studentId!,
        date: draft.date,
        startTime: draft.startTime || '',
        endTime: draft.endTime || '',
        learningStage: draft.learningStage,
        topicRatings: draft.topicRatings,
        subTopics: draft.subTopics,
        notes: draft.notes,
        kilometers: draft.kilometers,
        completed: false,
      };

      // Add the lesson
      const lessonId = await lessonService.add(lessonData);

      // Delete the draft
      await db.lessonDrafts.delete(draftId);

      return lessonId;
    });
  },

  /**
   * Create a new draft for a session
   * @param studentId The ID of the student
   * @param topicIds The suggested topic IDs for the session
   * @returns The ID of the newly created draft
   */
  createSessionDraft: async (
    studentId: number,
    topicIds: string[],
    subTopics?: string[],
    learningStage?: string,
  ): Promise<number> => {
    const now = new Date();
    // Convert topic IDs to topic ratings
    const topicRatings: TopicRating[] = topicIds.map(topicId => ({
      topicId,
      rating: 0,
    }));

    const draft: Omit<LessonDraft, 'id'> = {
      studentId,
      date: now,
      topicRatings,
      subTopics,
      learningStage: learningStage as LessonDraft['learningStage'], // Using indexed type for type safety
      draftCreatedAt: now,
      lastModified: now,
    };

    return await db.lessonDrafts.add(draft);
  },
};

export default draftLessonService;
