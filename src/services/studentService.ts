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
   * Delete a student and all associated records (cascade deletion)
   */
  delete: async (id: number): Promise<void> => {
    // Use transaction to ensure all operations succeed or fail together
    await db.transaction(
      'rw',
      [db.students, db.lessons, db.milestones, db.lessonDrafts],
      async () => {
        // Delete all lessons associated with this student
        await db.lessons.where('studentId').equals(id).delete();

        // Delete all milestones associated with this student
        await db.milestones.where('studentId').equals(id).delete();

        // Delete all lesson drafts associated with this student
        await db.lessonDrafts.where('studentId').equals(id).delete();

        // Finally, delete the student
        await db.students.delete(id);

        console.log(`Deleted student ${id} and all associated records`);
      },
    );
  },
};

export default studentService;
