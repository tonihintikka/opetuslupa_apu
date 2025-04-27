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

export interface Lesson {
  id?: number;
  studentId: number;
  date: Date;
  startTime: string;
  endTime: string;
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
    this.version(1).stores({
      students: '++id, name, email, phone',
      lessons: '++id, studentId, date, completed',
      milestones: '++id, studentId, title, completedAt',
    });
  }
}

// Create the database instance
const db = new DrivingLessonDB();

export default db;
