import db, { Lesson } from './db';

export const lessonService = {
  /**
   * Get all lessons
   */
  getAll: async (): Promise<Lesson[]> => {
    return await db.lessons.toArray();
  },

  /**
   * Get lessons for a specific student
   */
  getByStudentId: async (studentId: number): Promise<Lesson[]> => {
    return await db.lessons.where('studentId').equals(studentId).toArray();
  },

  /**
   * Get a lesson by id
   */
  getById: async (id: number): Promise<Lesson | undefined> => {
    return await db.lessons.get(id);
  },

  /**
   * Add a new lesson
   */
  add: async (lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> => {
    const now = new Date();
    return await db.lessons.add({
      ...lesson,
      createdAt: now,
      updatedAt: now,
    });
  },

  /**
   * Update an existing lesson
   */
  update: async (
    id: number,
    lesson: Partial<Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<number> => {
    const updatedAt = new Date();
    await db.lessons.update(id, {
      ...lesson,
      updatedAt,
    });
    return id;
  },

  /**
   * Mark a lesson as completed
   */
  markAsCompleted: async (id: number): Promise<number> => {
    const updatedAt = new Date();
    await db.lessons.update(id, {
      completed: true,
      updatedAt,
    });
    return id;
  },

  /**
   * Delete a lesson
   */
  delete: async (id: number): Promise<void> => {
    await db.lessons.delete(id);
  },

  /**
   * Get total kilometers for a student
   */
  getTotalKilometers: async (studentId: number): Promise<number> => {
    const lessons = await db.lessons.where('studentId').equals(studentId).toArray();
    return lessons.reduce((total, lesson) => total + (lesson.kilometers || 0), 0);
  },
};

export default lessonService;
