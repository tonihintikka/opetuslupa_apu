import Dexie, { Table } from 'dexie';

// Define interfaces for the database tables
export interface Student {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the learning stages based on Finnish driving school curriculum
export type LearningStage = 'kognitiivinen' | 'assosiatiivinen' | 'automaattinen';

export interface Lesson {
  id?: number;
  studentId: number;
  date: Date;
  startTime: string;
  endTime: string;
  learningStage?: LearningStage; // New field for learning stage
  topics: string[];
  notes?: string;
  kilometers?: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id?: number;
  studentId: number;
  title: string;
  description?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the database class
class DrivingLessonDB extends Dexie {
  students!: Table<Student>;
  lessons!: Table<Lesson>;
  milestones!: Table<Milestone>;

  constructor() {
    super('DrivingLessonDB');

    // Define database schema
    // Version 1: Initial schema
    this.version(1).stores({
      students: '++id, name, email, phone',
      lessons: '++id, studentId, date, completed',
      milestones: '++id, studentId, title, completedAt',
    });

    // Version 2: Add learningStage to lessons
    this.version(2)
      .stores({
        lessons: '++id, studentId, date, completed, learningStage',
        // Keep other tables the same
      })
      .upgrade(_tx => {
        // Migration logic (optional, Dexie might handle adding optional fields)
        // If needed, you could map existing lessons here
        console.warn('Upgrading schema to version 2, adding learningStage');
      });
  }
}

// Create the database instance
const db = new DrivingLessonDB();

export default db;
