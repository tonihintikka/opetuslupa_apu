export interface Student {
  id?: string; // Auto-generated UUID if not provided
  name: string; // Student's full name
  email?: string; // Optional contact email
  notes?: string; // Optional additional notes
  createdAt: Date; // When the student record was created
}
