import { useEffect, useState } from 'react';
import { Student, studentService } from '../services';

export interface UseStudentsResult {
  students: Student[];
  loading: boolean;
  error: Error | null;
  refreshStudents: () => Promise<void>;
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateStudent: (
    id: number,
    student: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
}

export const useStudents = (): UseStudentsResult => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshStudents = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (
    student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> => {
    try {
      await studentService.add(student);
      await refreshStudents();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add student'));
      throw err;
    }
  };

  const updateStudent = async (
    id: number,
    student: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> => {
    try {
      await studentService.update(id, student);
      await refreshStudents();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update student'));
      throw err;
    }
  };

  const deleteStudent = async (id: number): Promise<void> => {
    try {
      await studentService.delete(id);
      await refreshStudents();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete student'));
      throw err;
    }
  };

  useEffect(() => {
    refreshStudents();
  }, []);

  return {
    students,
    loading,
    error,
    refreshStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  };
};

export default useStudents;
