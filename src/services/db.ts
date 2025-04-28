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
  subTopics?: string[]; // New field for sub-topics
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

// Interface for lesson drafts
export interface LessonDraft {
  id?: number;
  studentId?: number;
  date: Date;
  startTime?: string;
  endTime?: string;
  learningStage?: LearningStage;
  topics: string[];
  subTopics?: string[];
  notes?: string;
  kilometers?: number;
  draftCreatedAt: Date;
  lastModified: Date;
}

// Define the database class
class DrivingLessonDB extends Dexie {
  students!: Table<Student>;
  lessons!: Table<Lesson>;
  milestones!: Table<Milestone>;
  lessonDrafts!: Table<LessonDraft>;

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

    // Version 3: Add subTopics to lessons
    this.version(3)
      .stores({
        lessons: '++id, studentId, date, completed, learningStage',
        // Keep other tables the same, subTopics doesn't need indexing
      })
      .upgrade(_tx => {
        // Migration logic for optional field
        console.warn('Upgrading schema to version 3, adding subTopics to lessons');
      });

    // Version 4: Add lessonDrafts table
    this.version(4)
      .stores({
        students: '++id, name, email, phone',
        lessons: '++id, studentId, date, completed, learningStage',
        milestones: '++id, studentId, title, completedAt',
        lessonDrafts: '++id, studentId, draftCreatedAt, lastModified',
      })
      .upgrade(_tx => {
        console.warn('Upgrading schema to version 4, adding lessonDrafts table');
      });
  }
}

// Create the database instance
const db = new DrivingLessonDB();

export default db;
