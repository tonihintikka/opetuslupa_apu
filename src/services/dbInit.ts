import db from './db';
import studentService from './studentService';
import lessonService from './lessonService';
import milestoneService from './milestoneService';

/**
 * Initialize the database with sample data
 */
export const initializeDatabase = async (): Promise<void> => {
  // Check if the database is empty
  const studentCount = await db.students.count();

  if (studentCount > 0) {
    // Database already has data
    console.warn('Database already initialized');
    return;
  }

  console.warn('Initializing database with sample data...');

  try {
    // Add sample students
    const student1Id = await studentService.add({
      name: 'Matti Meikäläinen',
      email: 'matti@example.com',
      phone: '040-1234567',
    });

    const student2Id = await studentService.add({
      name: 'Liisa Virtanen',
      email: 'liisa@example.com',
      phone: '050-7654321',
    });

    // Add sample lessons for Matti
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await lessonService.add({
      studentId: student1Id,
      date: yesterday,
      startTime: '14:00',
      endTime: '15:30',
      topics: ['Basic controls', 'Starting and stopping'],
      notes: 'Good progress with basic car controls',
      kilometers: 15,
      completed: true,
    });

    await lessonService.add({
      studentId: student1Id,
      date: tomorrow,
      startTime: '10:00',
      endTime: '11:30',
      topics: ['City driving', 'Traffic lights'],
      notes: '',
      kilometers: 0,
      completed: false,
    });

    // Add sample lessons for Liisa
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await lessonService.add({
      studentId: student2Id,
      date: nextWeek,
      startTime: '13:00',
      endTime: '14:30',
      topics: ['Highway driving', 'Overtaking'],
      notes: '',
      kilometers: 0,
      completed: false,
    });

    // Add sample milestones
    await milestoneService.add({
      studentId: student1Id,
      title: 'Basic car control',
      description: 'Comfortable with starting, stopping, and basic maneuvers',
    });

    await milestoneService.add({
      studentId: student1Id,
      title: 'City driving',
      description: 'Navigate through city traffic and intersections',
    });

    await milestoneService.add({
      studentId: student2Id,
      title: 'Basic car control',
      description: 'Comfortable with starting, stopping, and basic maneuvers',
    });

    console.warn('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase;
