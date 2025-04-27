import { useEffect, useState } from 'react';
import { Lesson, lessonService } from '../services';

export interface UseLessonsResult {
  lessons: Lesson[];
  loading: boolean;
  error: Error | null;
  refreshLessons: () => Promise<void>;
  getLessonsByStudentId: (studentId: number) => Promise<void>;
  addLesson: (lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLesson: (
    id: number,
    lesson: Partial<Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => Promise<void>;
  completeLesson: (id: number) => Promise<void>;
  deleteLesson: (id: number) => Promise<void>;
}

export const useLessons = (studentId?: number): UseLessonsResult => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshLessons = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await lessonService.getAll();
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const getLessonsByStudentId = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await lessonService.getByStudentId(id);
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const addLesson = async (
    lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> => {
    try {
      await lessonService.add(lesson);
      if (studentId && lesson.studentId === studentId) {
        await getLessonsByStudentId(studentId);
      } else {
        await refreshLessons();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add lesson'));
      throw err;
    }
  };

  const updateLesson = async (
    id: number,
    lesson: Partial<Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> => {
    try {
      await lessonService.update(id, lesson);
      if (studentId) {
        await getLessonsByStudentId(studentId);
      } else {
        await refreshLessons();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update lesson'));
      throw err;
    }
  };

  const completeLesson = async (id: number): Promise<void> => {
    try {
      await lessonService.markAsCompleted(id);
      if (studentId) {
        await getLessonsByStudentId(studentId);
      } else {
        await refreshLessons();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to complete lesson'));
      throw err;
    }
  };

  const deleteLesson = async (id: number): Promise<void> => {
    try {
      await lessonService.delete(id);
      if (studentId) {
        await getLessonsByStudentId(studentId);
      } else {
        await refreshLessons();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete lesson'));
      throw err;
    }
  };

  useEffect(() => {
    if (studentId) {
      getLessonsByStudentId(studentId);
    } else {
      refreshLessons();
    }
  }, [studentId]);

  return {
    lessons,
    loading,
    error,
    refreshLessons,
    getLessonsByStudentId,
    addLesson,
    updateLesson,
    completeLesson,
    deleteLesson,
  };
};

export default useLessons;
