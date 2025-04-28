import { useMemo } from 'react';
import { Lesson, LearningStage } from '../services/db';
import { lessonTopics } from '../constants/lessonTopics';

// Define the structure for topic progress
export interface TopicProgress {
  topicId: string;
  topicLabel: string;
  stage: LearningStage;
  recommendedMinutes: number; // Default recommended minutes per topic
  completedMinutes: number;
  lastPracticed: Date | null;
  progressPercent: number;
  remainingMinutes: number;
  color: 'success' | 'warning' | 'error'; // Color based on progress
  averageRating: number; // Average rating for the topic
}

// Define constants for recommended minutes and thresholds
const DEFAULT_RECOMMENDED_MINUTES = {
  kognitiivinen: 60, // 1 hour per cognitive stage topic
  assosiatiivinen: 90, // 1.5 hours per associative stage topic
  automaattinen: 120, // 2 hours per automatic stage topic
};

// Define progress color thresholds
const PROGRESS_THRESHOLDS = {
  warning: 50, // Below 50% is warning (yellow)
  success: 75, // Above 75% is success (green), between is error (red)
};

// Helper function to calculate time in minutes from a lesson
const calculateLessonDuration = (lesson: Lesson): number => {
  if (!lesson.startTime || !lesson.endTime) return 0;

  const [startHours, startMinutes] = lesson.startTime.split(':').map(Number);
  const [endHours, endMinutes] = lesson.endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Handle lesson going past midnight
  const totalMinutes =
    endTotalMinutes < startTotalMinutes
      ? endTotalMinutes + 24 * 60 - startTotalMinutes
      : endTotalMinutes - startTotalMinutes;

  return totalMinutes;
};

// Calculate progress color based on percentage
const getProgressColor = (percent: number): 'success' | 'warning' | 'error' => {
  if (percent >= PROGRESS_THRESHOLDS.success) return 'success';
  if (percent >= PROGRESS_THRESHOLDS.warning) return 'warning';
  return 'error';
};

/**
 * Hook to calculate topic progress statistics based on lesson data
 */
export const useProgressCalculation = (lessons: Lesson[]) => {
  const topicProgress = useMemo(() => {
    // Initialize progress data for all topics
    const progress: Record<string, TopicProgress> = {};

    // Initialize with all possible topics
    lessonTopics.forEach(topic => {
      progress[topic.key] = {
        topicId: topic.key,
        topicLabel: topic.label,
        stage: topic.stage,
        recommendedMinutes: DEFAULT_RECOMMENDED_MINUTES[topic.stage],
        completedMinutes: 0,
        lastPracticed: null,
        progressPercent: 0,
        remainingMinutes: DEFAULT_RECOMMENDED_MINUTES[topic.stage],
        color: 'error',
        averageRating: 0, // Initialize average rating
      };
    });

    // Process all lessons to calculate statistics
    lessons.forEach(lesson => {
      if (!lesson.completed) return; // Skip incomplete lessons

      const lessonDate = new Date(lesson.date);
      // Extract topic IDs from topicRatings
      const topicIds = lesson.topicRatings.map(tr => tr.topicId);
      const topicCount = topicIds.length || 1; // Avoid division by zero
      const lessonDuration = calculateLessonDuration(lesson);
      const minutesPerTopic = lessonDuration / topicCount; // Equal distribution among topics

      // Track ratings sum and count for calculating averages
      const ratingSums: Record<string, { sum: number; count: number }> = {};

      // Update statistics for each topic in the lesson
      lesson.topicRatings.forEach(tr => {
        const topicId = tr.topicId;

        if (progress[topicId]) {
          const topic = progress[topicId];

          // Update completed minutes
          topic.completedMinutes += minutesPerTopic;

          // Update last practiced date
          if (!topic.lastPracticed || lessonDate > topic.lastPracticed) {
            topic.lastPracticed = lessonDate;
          }

          // Track rating sums for later averaging
          if (!ratingSums[topicId]) {
            ratingSums[topicId] = { sum: 0, count: 0 };
          }

          // Only count ratings > 0
          if (tr.rating > 0) {
            ratingSums[topicId].sum += tr.rating;
            ratingSums[topicId].count += 1;
          }
        }
      });

      // Calculate average ratings
      Object.entries(ratingSums).forEach(([topicId, { sum, count }]) => {
        if (count > 0 && progress[topicId]) {
          // Calculate weighted average combining previous average and new ratings
          const previousAvg = progress[topicId].averageRating;
          const previousCount = previousAvg > 0 ? 1 : 0; // Simplify by treating previous as one "lesson"
          const newAvg = sum / count;

          // Simple weighted average, giving equal weight to previous average and new data
          progress[topicId].averageRating =
            (previousAvg * previousCount + newAvg) / (previousCount + 1);
        }
      });
    });

    // Calculate final statistics
    Object.values(progress).forEach(topic => {
      // Calculate progress percentage
      topic.progressPercent = Math.min(
        100,
        Math.round((topic.completedMinutes / topic.recommendedMinutes) * 100),
      );

      // Calculate remaining minutes
      topic.remainingMinutes = Math.max(0, topic.recommendedMinutes - topic.completedMinutes);

      // Determine color based on progress
      topic.color = getProgressColor(topic.progressPercent);

      // Round average rating to one decimal place
      topic.averageRating = Math.round(topic.averageRating * 10) / 10;
    });

    return Object.values(progress);
  }, [lessons]);

  // Additional helper functions

  // Get progress for a specific learning stage
  const getProgressByStage = (stage: LearningStage) => {
    return topicProgress.filter(topic => topic.stage === stage);
  };

  // Get the least practiced topics (for recommendations)
  const getLeastPracticedTopics = (limit = 5) => {
    return [...topicProgress].sort((a, b) => a.progressPercent - b.progressPercent).slice(0, limit);
  };

  // Get overall progress across all topics
  const getOverallProgress = () => {
    if (topicProgress.length === 0) return 0;

    const totalCompleted = topicProgress.reduce((sum, topic) => sum + topic.completedMinutes, 0);

    const totalRecommended = topicProgress.reduce(
      (sum, topic) => sum + topic.recommendedMinutes,
      0,
    );

    return Math.round((totalCompleted / totalRecommended) * 100);
  };

  return {
    topicProgress,
    getProgressByStage,
    getLeastPracticedTopics,
    getOverallProgress,
  };
};

export default useProgressCalculation;
