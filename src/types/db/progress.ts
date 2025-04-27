export interface Progress {
  id?: string; // Auto-generated UUID if not provided
  skillId: string; // Reference to the associated skill
  studentId: string; // Reference to the student
  level: number; // Proficiency level (0-5)
  notes?: string; // Optional instructor notes
  date: Date; // Date of the progress entry
  createdAt: Date; // When the progress was recorded
}
