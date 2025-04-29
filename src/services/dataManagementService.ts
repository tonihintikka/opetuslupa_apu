import db from './db';
import settingsService from './settingsService';
import { AppSettings } from './settingsService';

interface ExportData {
  type: 'studentData';
  version: string;
  exportedAt: string;
  students: unknown[];
  lessons: unknown[];
  milestones: unknown[];
  lessonDrafts: unknown[];
}

interface FullBackup {
  type: 'fullBackup';
  version: string;
  exportedAt: string;
  settings: AppSettings;
  students: unknown[];
  lessons: unknown[];
  milestones: unknown[];
  lessonDrafts: unknown[];
}

interface Backup {
  date: string;
  timestamp: number;
  type: 'studentData' | 'fullBackup';
}

/**
 * Service for managing application data, including exports, imports,
 * backups, and data clearing.
 */
const dataManagementService = {
  /**
   * Exports only student and lesson data from the database as a JSON file blob
   */
  async exportStudentData(): Promise<Blob> {
    const students = await db.students.toArray();
    const lessons = await db.lessons.toArray();
    const milestones = await db.milestones.toArray();
    const lessonDrafts = await db.lessonDrafts.toArray();

    const data: ExportData = {
      type: 'studentData',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      students,
      lessons,
      milestones,
      lessonDrafts,
    };

    return new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
  },

  /**
   * Creates a complete backup including data and settings
   */
  async createFullBackup(): Promise<Blob> {
    const students = await db.students.toArray();
    const lessons = await db.lessons.toArray();
    const milestones = await db.milestones.toArray();
    const lessonDrafts = await db.lessonDrafts.toArray();
    const settings = await settingsService.getAllSettings();

    const data: FullBackup = {
      type: 'fullBackup',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      students,
      lessons,
      milestones,
      lessonDrafts,
    };

    return new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
  },

  /**
   * Imports student data from a JSON file
   * @param file - The JSON file to import
   * @returns Promise resolving to success status and message
   */
  async importStudentData(file: File): Promise<{ success: boolean; message: string }> {
    try {
      const fileContents = await file.text();
      const data = JSON.parse(fileContents);

      // Validate data structure
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid data format: Not a JSON object' };
      }

      if (data.type !== 'studentData' && data.type !== 'fullBackup') {
        return { 
          success: false, 
          message: 'Invalid data format: File is not a valid student data export or backup' 
        };
      }

      if (
        !data.students ||
        !Array.isArray(data.students) ||
        !data.lessons ||
        !Array.isArray(data.lessons) ||
        !data.milestones ||
        !Array.isArray(data.milestones)
      ) {
        return {
          success: false,
          message: 'Invalid data format: Missing required data collections',
        };
      }

      if (!data.version) {
        console.warn('Importing data without version information');
      }

      // Import data into the database
      await db.transaction('rw', [db.students, db.lessons, db.milestones, db.lessonDrafts], async () => {
        // Clear existing data
        await db.students.clear();
        await db.lessons.clear();
        await db.milestones.clear();
        await db.lessonDrafts.clear();

        // Add new data
        if (data.students.length) await db.students.bulkAdd(data.students);
        if (data.lessons.length) await db.lessons.bulkAdd(data.lessons);
        if (data.milestones.length) await db.milestones.bulkAdd(data.milestones);
        
        // Add lesson drafts if they exist in the import
        if (data.lessonDrafts && Array.isArray(data.lessonDrafts) && data.lessonDrafts.length) {
          await db.lessonDrafts.bulkAdd(data.lessonDrafts);
        }
      });

      return { success: true, message: 'Data imported successfully' };
    } catch (error) {
      console.error('Error importing data:', error);
      return {
        success: false,
        message: `Error importing data: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Restores a full backup including data and settings
   * @param file - The backup file to restore
   * @returns Promise resolving to success status, message, and whether settings were restored
   */
  async restoreFullBackup(file: File): Promise<{ success: boolean; message: string; settingsRestored: boolean }> {
    try {
      const fileContents = await file.text();
      const data = JSON.parse(fileContents);

      // Validate data structure
      if (!data || typeof data !== 'object') {
        return { 
          success: false, 
          message: 'Invalid backup format: Not a JSON object',
          settingsRestored: false 
        };
      }

      if (data.type !== 'fullBackup') {
        return { 
          success: false, 
          message: 'Invalid backup format: File is not a valid full backup',
          settingsRestored: false 
        };
      }

      if (
        !data.students ||
        !Array.isArray(data.students) ||
        !data.lessons ||
        !Array.isArray(data.lessons) ||
        !data.milestones ||
        !Array.isArray(data.milestones) ||
        !data.settings ||
        typeof data.settings !== 'object'
      ) {
        return {
          success: false,
          message: 'Invalid backup format: Missing required data collections or settings',
          settingsRestored: false
        };
      }

      // Import data into the database
      await db.transaction('rw', [db.students, db.lessons, db.milestones, db.lessonDrafts], async () => {
        // Clear existing data
        await db.students.clear();
        await db.lessons.clear();
        await db.milestones.clear();
        await db.lessonDrafts.clear();

        // Add new data
        if (data.students.length) await db.students.bulkAdd(data.students);
        if (data.lessons.length) await db.lessons.bulkAdd(data.lessons);
        if (data.milestones.length) await db.milestones.bulkAdd(data.milestones);
        
        // Add lesson drafts if they exist in the import
        if (data.lessonDrafts && Array.isArray(data.lessonDrafts) && data.lessonDrafts.length) {
          await db.lessonDrafts.bulkAdd(data.lessonDrafts);
        }
      });

      // Restore settings
      await settingsService.clearAllSettings();
      await settingsService.saveAllSettings(data.settings);

      return { 
        success: true, 
        message: 'Backup restored successfully. You may need to reload the application for all settings to take effect.',
        settingsRestored: true
      };
    } catch (error) {
      console.error('Error restoring backup:', error);
      return {
        success: false,
        message: `Error restoring backup: ${error instanceof Error ? error.message : String(error)}`,
        settingsRestored: false
      };
    }
  },

  /**
   * Creates a backup of the current database state
   * Uses the new format with type information
   */
  async backupData(): Promise<void> {
    const data = await this.exportStudentData();
    const dataStr = await data.text();

    const timestamp = Date.now();
    const date = new Date().toLocaleDateString('fi-FI');

    // Store in localStorage with a unique timestamp key
    localStorage.setItem(`backup_${timestamp}`, dataStr);

    // Keep track of backups with metadata
    const backupsList = this.getBackupsFromStorage();
    backupsList.push({ date, timestamp, type: 'studentData' });

    // Store the updated list
    localStorage.setItem('backups_list', JSON.stringify(backupsList));
  },

  /**
   * Creates a full backup including settings
   */
  async backupFullData(): Promise<void> {
    const data = await this.createFullBackup();
    const dataStr = await data.text();

    const timestamp = Date.now();
    const date = new Date().toLocaleDateString('fi-FI');

    // Store in localStorage with a unique timestamp key
    localStorage.setItem(`backup_${timestamp}`, dataStr);

    // Keep track of backups with metadata
    const backupsList = this.getBackupsFromStorage();
    backupsList.push({ date, timestamp, type: 'fullBackup' });

    // Store the updated list
    localStorage.setItem('backups_list', JSON.stringify(backupsList));
  },

  /**
   * Gets a list of all available backups
   */
  async getBackups(): Promise<Backup[]> {
    return this.getBackupsFromStorage();
  },

  /**
   * Utility function to get backups list from localStorage
   */
  getBackupsFromStorage(): Backup[] {
    const backupsListStr = localStorage.getItem('backups_list');
    if (!backupsListStr) return [];

    try {
      const backups = JSON.parse(backupsListStr) as Backup[];
      
      // Handle older backups without type field
      return backups.map(backup => ({
        ...backup,
        type: backup.type || 'studentData', // Default to studentData for older backups
      }));
    } catch (e) {
      console.error('Failed to parse backups list:', e);
      return [];
    }
  },

  /**
   * Restores a backup by its timestamp
   */
  async restoreBackup(timestamp: number): Promise<{ success: boolean; message: string; settingsRestored: boolean }> {
    const backupKey = `backup_${timestamp}`;
    const backupStr = localStorage.getItem(backupKey);

    if (!backupStr) {
      return {
        success: false,
        message: 'Backup not found',
        settingsRestored: false
      };
    }

    try {
      const data = JSON.parse(backupStr);

      // Validate data structure
      if (
        !data.students ||
        !data.lessons ||
        !data.milestones ||
        !Array.isArray(data.students) ||
        !Array.isArray(data.lessons) ||
        !Array.isArray(data.milestones)
      ) {
        return {
          success: false,
          message: 'Invalid backup format',
          settingsRestored: false
        };
      }

      // Check if this is a full backup with settings
      const isFullBackup = data.type === 'fullBackup' && data.settings;
      let settingsRestored = false;

      // Clear current data and restore from backup
      await db.transaction('rw', [db.students, db.lessons, db.milestones, db.lessonDrafts], async () => {
        await db.students.clear();
        await db.lessons.clear();
        await db.milestones.clear();
        await db.lessonDrafts.clear();

        // Import data
        await db.students.bulkAdd(data.students);
        await db.lessons.bulkAdd(data.lessons);
        await db.milestones.bulkAdd(data.milestones);
        
        // Add lesson drafts if they exist in the backup
        if (data.lessonDrafts && Array.isArray(data.lessonDrafts) && data.lessonDrafts.length) {
          await db.lessonDrafts.bulkAdd(data.lessonDrafts);
        }
      });

      // Restore settings if available
      if (isFullBackup) {
        await settingsService.clearAllSettings();
        await settingsService.saveAllSettings(data.settings);
        settingsRestored = true;
      }

      return {
        success: true, 
        message: `Backup restored successfully${settingsRestored ? '. You may need to reload the application for all settings to take effect.' : ''}`,
        settingsRestored
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
        settingsRestored: false
      };
    }
  },

  /**
   * Clears all data after creating a backup
   * @param includeSettings - Whether to also clear settings
   */
  async clearAllData(includeSettings = false): Promise<void> {
    // Create a backup first
    await this.backupFullData();

    // Clear all tables
    await db.transaction('rw', [db.students, db.lessons, db.milestones, db.lessonDrafts], async () => {
      await db.students.clear();
      await db.lessons.clear();
      await db.milestones.clear();
      await db.lessonDrafts.clear();
    });

    // Clear settings if requested
    if (includeSettings) {
      await settingsService.clearAllSettings();
    }
  },
};

export default dataManagementService;
