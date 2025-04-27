import db from './db';

interface ExportData {
  students: unknown[];
  lessons: unknown[];
  milestones: unknown[];
  version: string;
  exportDate: string;
}

interface Backup {
  date: string;
  timestamp: number;
}

/**
 * Service for managing application data, including exports, imports,
 * backups, and data clearing.
 */
const dataManagementService = {
  /**
   * Exports all data from the database as a JSON file blob
   */
  async exportData(): Promise<Blob> {
    const students = await db.students.toArray();
    const lessons = await db.lessons.toArray();
    const milestones = await db.milestones.toArray();

    const data: ExportData = {
      students,
      lessons,
      milestones,
      version: '1.0',
      exportDate: new Date().toISOString(),
    };

    return new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
  },

  /**
   * Imports data from a JSON file
   * @param file - The JSON file to import
   * @returns Promise resolving to success status and message
   */
  async importData(file: File): Promise<{ success: boolean; message: string }> {
    try {
      const fileContents = await file.text();
      const data = JSON.parse(fileContents);

      // Validate data structure
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid data format: Not a JSON object' };
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
      await db.transaction('rw', [db.students, db.lessons, db.milestones], async () => {
        // Clear existing data
        await db.students.clear();
        await db.lessons.clear();
        await db.milestones.clear();

        // Add new data
        if (data.students.length) await db.students.bulkAdd(data.students);
        if (data.lessons.length) await db.lessons.bulkAdd(data.lessons);
        if (data.milestones.length) await db.milestones.bulkAdd(data.milestones);
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
   * Creates a backup of the current database state
   */
  async backupData(): Promise<void> {
    const data = await this.exportData();
    const dataStr = await data.text();

    const timestamp = Date.now();
    const date = new Date().toLocaleDateString('fi-FI');

    // Store in localStorage with a unique timestamp key
    localStorage.setItem(`backup_${timestamp}`, dataStr);

    // Keep track of backups with metadata
    const backupsList = this.getBackupsFromStorage();
    backupsList.push({ date, timestamp });

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
      return JSON.parse(backupsListStr) as Backup[];
    } catch (e) {
      console.error('Failed to parse backups list:', e);
      return [];
    }
  },

  /**
   * Restores a backup by its timestamp
   */
  async restoreBackup(timestamp: number): Promise<void> {
    const backupKey = `backup_${timestamp}`;
    const backupStr = localStorage.getItem(backupKey);

    if (!backupStr) {
      throw new Error('Varmuuskopiota ei löydy');
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
        throw new Error('Virheellinen varmuuskopion muoto');
      }

      // Clear current data and restore from backup
      await db.transaction('rw', [db.students, db.lessons, db.milestones], async () => {
        await db.students.clear();
        await db.lessons.clear();
        await db.milestones.clear();

        // Import data
        await db.students.bulkAdd(data.students);
        await db.lessons.bulkAdd(data.lessons);
        await db.milestones.bulkAdd(data.milestones);
      });
    } catch (error) {
      throw new Error(
        `Varmuuskopion palauttaminen epäonnistui: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`,
      );
    }
  },

  /**
   * Clears all data after creating a backup
   */
  async clearAllData(): Promise<void> {
    // Create a backup first
    await this.backupData();

    // Clear all tables
    await db.transaction('rw', [db.students, db.lessons, db.milestones], async () => {
      await db.students.clear();
      await db.lessons.clear();
      await db.milestones.clear();
    });
  },
};

export default dataManagementService;
