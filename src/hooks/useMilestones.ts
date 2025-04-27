import { useEffect, useState } from 'react';
import { Milestone, milestoneService } from '../services';

export interface UseMilestonesResult {
  milestones: Milestone[];
  loading: boolean;
  error: Error | null;
  refreshMilestones: () => Promise<void>;
  getMilestonesByStudentId: (studentId: number) => Promise<void>;
  addMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMilestone: (
    id: number,
    milestone: Partial<Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => Promise<void>;
  completeMilestone: (id: number) => Promise<void>;
  deleteMilestone: (id: number) => Promise<void>;
}

export const useMilestones = (studentId?: number): UseMilestonesResult => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshMilestones = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await milestoneService.getAll();
      setMilestones(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const getMilestonesByStudentId = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await milestoneService.getByStudentId(id);
      setMilestones(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const addMilestone = async (
    milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> => {
    try {
      await milestoneService.add(milestone);
      if (studentId && milestone.studentId === studentId) {
        await getMilestonesByStudentId(studentId);
      } else {
        await refreshMilestones();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add milestone'));
      throw err;
    }
  };

  const updateMilestone = async (
    id: number,
    milestone: Partial<Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> => {
    try {
      await milestoneService.update(id, milestone);
      if (studentId) {
        await getMilestonesByStudentId(studentId);
      } else {
        await refreshMilestones();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update milestone'));
      throw err;
    }
  };

  const completeMilestone = async (id: number): Promise<void> => {
    try {
      await milestoneService.markAsCompleted(id);
      if (studentId) {
        await getMilestonesByStudentId(studentId);
      } else {
        await refreshMilestones();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to complete milestone'));
      throw err;
    }
  };

  const deleteMilestone = async (id: number): Promise<void> => {
    try {
      await milestoneService.delete(id);
      if (studentId) {
        await getMilestonesByStudentId(studentId);
      } else {
        await refreshMilestones();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete milestone'));
      throw err;
    }
  };

  useEffect(() => {
    if (studentId) {
      getMilestonesByStudentId(studentId);
    } else {
      refreshMilestones();
    }
  }, [studentId]);

  return {
    milestones,
    loading,
    error,
    refreshMilestones,
    getMilestonesByStudentId,
    addMilestone,
    updateMilestone,
    completeMilestone,
    deleteMilestone,
  };
};

export default useMilestones;
