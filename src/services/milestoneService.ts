import db, { Milestone } from './db';

export const milestoneService = {
  /**
   * Get all milestones
   */
  getAll: async (): Promise<Milestone[]> => {
    return await db.milestones.toArray();
  },

  /**
   * Get milestones for a specific student
   */
  getByStudentId: async (studentId: number): Promise<Milestone[]> => {
    return await db.milestones.where('studentId').equals(studentId).toArray();
  },

  /**
   * Get a milestone by id
   */
  getById: async (id: number): Promise<Milestone | undefined> => {
    return await db.milestones.get(id);
  },

  /**
   * Add a new milestone
   */
  add: async (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> => {
    const now = new Date();
    return await db.milestones.add({
      ...milestone,
      createdAt: now,
      updatedAt: now,
    });
  },

  /**
   * Update an existing milestone
   */
  update: async (
    id: number,
    milestone: Partial<Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<number> => {
    const updatedAt = new Date();
    await db.milestones.update(id, {
      ...milestone,
      updatedAt,
    });
    return id;
  },

  /**
   * Mark a milestone as completed
   */
  markAsCompleted: async (id: number): Promise<number> => {
    const completedAt = new Date();
    const updatedAt = new Date();

    await db.milestones.update(id, {
      completedAt,
      updatedAt,
    });

    return id;
  },

  /**
   * Delete a milestone
   */
  delete: async (id: number): Promise<void> => {
    await db.milestones.delete(id);
  },
};

export default milestoneService;
