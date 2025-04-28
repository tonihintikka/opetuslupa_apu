import { useState, useEffect, useCallback } from 'react';
import { LessonDraft } from '../services/db';
import draftLessonService from '../services/draftLessonService';

/**
 * Custom hook for working with lesson drafts
 */
export function useDraftLessons() {
  const [drafts, setDrafts] = useState<LessonDraft[]>([]);
  const [currentDraft, setCurrentDraft] = useState<LessonDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all drafts on component mount
  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const results = await draftLessonService.getAll();
        setDrafts(results);
        setError(null);
      } catch (err) {
        console.error('Error fetching drafts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch drafts'));
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  // Save a draft
  const saveDraft = useCallback(async (draft: Omit<LessonDraft, 'lastModified'>) => {
    try {
      setLoading(true);
      const id = await draftLessonService.save(draft);

      // Update the drafts state
      setDrafts(prevDrafts => {
        const existingIndex = prevDrafts.findIndex(d => d.id === draft.id);
        if (existingIndex >= 0) {
          // Update existing draft
          const newDrafts = [...prevDrafts];
          newDrafts[existingIndex] = { ...draft, lastModified: new Date(), id };
          return newDrafts;
        } else {
          // Add new draft
          return [...prevDrafts, { ...draft, lastModified: new Date(), id }];
        }
      });

      // Set as current draft
      setCurrentDraft({ ...draft, lastModified: new Date(), id });
      setError(null);
      return id;
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err instanceof Error ? err : new Error('Failed to save draft'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a draft by ID
  const loadDraft = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const draft = await draftLessonService.getById(id);
      setCurrentDraft(draft || null);
      setError(null);
      return draft;
    } catch (err) {
      console.error('Error loading draft:', err);
      setError(err instanceof Error ? err : new Error(`Failed to load draft ${id}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a draft
  const deleteDraft = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        await draftLessonService.delete(id);

        // Update drafts state
        setDrafts(prevDrafts => prevDrafts.filter(d => d.id !== id));

        // If the current draft is the one being deleted, clear it
        if (currentDraft?.id === id) {
          setCurrentDraft(null);
        }

        setError(null);
      } catch (err) {
        console.error('Error deleting draft:', err);
        setError(err instanceof Error ? err : new Error(`Failed to delete draft ${id}`));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentDraft],
  );

  // Convert a draft to a lesson
  const convertToLesson = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        const lessonId = await draftLessonService.convertToLesson(id);

        // Update drafts state
        setDrafts(prevDrafts => prevDrafts.filter(d => d.id !== id));

        // If the current draft is the one being converted, clear it
        if (currentDraft?.id === id) {
          setCurrentDraft(null);
        }

        setError(null);
        return lessonId;
      } catch (err) {
        console.error('Error converting draft to lesson:', err);
        setError(err instanceof Error ? err : new Error(`Failed to convert draft ${id} to lesson`));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentDraft],
  );

  // Create a new session draft
  const createSessionDraft = useCallback(
    async (studentId: number, topics: string[], subTopics?: string[], learningStage?: string) => {
      try {
        setLoading(true);
        const id = await draftLessonService.createSessionDraft(
          studentId,
          topics,
          subTopics,
          learningStage,
        );

        // Load the newly created draft
        const draft = await draftLessonService.getById(id);

        // Update states
        if (draft) {
          setDrafts(prevDrafts => [...prevDrafts, draft]);
          setCurrentDraft(draft);
        }

        setError(null);
        return id;
      } catch (err) {
        console.error('Error creating session draft:', err);
        setError(err instanceof Error ? err : new Error('Failed to create session draft'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Clean up old drafts
  const cleanupOldDrafts = useCallback(async (hoursOld: number = 24) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - hoursOld);

      const deletedCount = await draftLessonService.cleanupOldDrafts(cutoffDate);

      // Refresh drafts list if any were deleted
      if (deletedCount > 0) {
        const freshDrafts = await draftLessonService.getAll();
        setDrafts(freshDrafts);
      }

      return deletedCount;
    } catch (err) {
      console.error('Error cleaning up old drafts:', err);
      setError(err instanceof Error ? err : new Error('Failed to clean up old drafts'));
      throw err;
    }
  }, []);

  return {
    drafts,
    currentDraft,
    loading,
    error,
    saveDraft,
    loadDraft,
    deleteDraft,
    convertToLesson,
    createSessionDraft,
    cleanupOldDrafts,
  };
}

export default useDraftLessons;
