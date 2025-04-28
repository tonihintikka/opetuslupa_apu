export interface TopicRating {
  topicId: string;
  rating: number;
}

export interface Lesson {
  id?: string; // Auto-generated UUID if not provided
  studentId: string; // Reference to the student
  date: Date; // Date and time of the lesson
  duration: number; // Duration in minutes
  topicRatings: TopicRating[]; // Array of topics with ratings (1-5)
  location?: string; // Starting/ending location
  notes?: string; // Additional notes about the lesson
  completed: boolean; // Whether the lesson has been completed
  createdAt: Date; // When the lesson record was created
}
