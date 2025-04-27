import db, { Student } from './db';

export const studentService = {
  /**
   * Get all students
   */
  getAll: async (): Promise<Student[]> => {
    return await db.students.toArray();
  },

  /**
   * Get a student by id
   */
  getById: async (id: number): Promise<Student | undefined> => {
    return await db.students.get(id);
  },

  /**
   * Add a new student
   */
  add: async (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> => {
    const now = new Date();
    return await db.students.add({
      ...student,
      createdAt: now,
      updatedAt: now,
    });
  },

  /**
   * Update an existing student
   */
  update: async (
    id: number,
    student: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<number> => {
    const updatedAt = new Date();
    await db.students.update(id, {
      ...student,
      updatedAt,
    });
    return id;
  },

  /**
   * Delete a student
   */
  delete: async (id: number): Promise<void> => {
    await db.students.delete(id);
  },
};

export default studentService;
