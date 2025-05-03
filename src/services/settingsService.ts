import db from './db';

// Define the types of settings we can store
export interface AppSettings {
  language: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
  // Add an index signature to allow any string key with any value
  [key: string]: unknown;
}

// Default settings to use if none are found
const defaultSettings: AppSettings = {
  language: 'fi',
  darkMode: false,
  notificationsEnabled: true,
  autoSave: true,
};

/**
 * Service for managing application settings
 */
const settingsService = {
  /**
   * Initialize the settings table if needed
   */
  async init(): Promise<void> {
    // Check if the settings table exists in the current DB version
    try {
      // This will throw if the settings table doesn't exist
      const settings = await db.table('settings').toArray();
      if (settings.length === 0) {
        // Initialize with default settings
        await this.saveAllSettings(defaultSettings);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error('Settings table may not exist yet:');
      // Settings table will be created in the next DB version upgrade
    }
  },

  /**
   * Saves a single setting
   * @param key - Setting key
   * @param value - Setting value
   */
  async saveSetting(key: keyof AppSettings, value: unknown): Promise<void> {
    try {
      // Try to update existing setting
      const existing = await db.table('settings').get(key);
      if (existing) {
        await db.table('settings').update(key, { value });
      } else {
        // Create new setting if it doesn't exist
        await db.table('settings').put({ key, value });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Fallback to localStorage if Dexie table doesn't exist yet
      localStorage.setItem(`setting_${key}`, JSON.stringify(value));
      console.warn(`Saved setting ${key} to localStorage as fallback`);
    }
  },

  /**
   * Gets a single setting value
   * @param key - Setting key
   * @returns Setting value or default value
   */
  async getSetting<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    try {
      // Try to get from Dexie
      const setting = await db.table('settings').get(key);
      if (setting) {
        return setting.value;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Fallback to localStorage if Dexie table doesn't exist yet
      const localValue = localStorage.getItem(`setting_${key}`);
      if (localValue) {
        try {
          return JSON.parse(localValue);
        } catch (e) {
          console.error(`Error parsing localStorage setting ${key}:`, e);
        }
      }
    }

    // Return default if not found
    return defaultSettings[key];
  },

  /**
   * Gets all application settings
   * @returns All settings
   */
  async getAllSettings(): Promise<AppSettings> {
    try {
      // Try to get from Dexie
      const settingsArray = await db.table('settings').toArray();

      if (settingsArray.length > 0) {
        // Convert array of {key, value} objects to a single settings object
        return settingsArray.reduce((acc, curr) => {
          acc[curr.key as keyof AppSettings] = curr.value;
          return acc;
        }, {} as AppSettings);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Fallback to localStorage if Dexie table doesn't exist yet
      const settings = { ...defaultSettings };

      // Try to get each setting from localStorage
      for (const key in defaultSettings) {
        const localValue = localStorage.getItem(`setting_${key}`);
        if (localValue) {
          try {
            // Using proper type assertion with the specific key
            const typedKey = key as keyof AppSettings;
            const parsedValue = JSON.parse(localValue);
            // Set the value with proper typing based on the default settings as a guide
            settings[typedKey] = parsedValue;
          } catch (e) {
            console.error(`Error parsing localStorage setting ${key}:`, e);
          }
        }
      }

      return settings;
    }

    // Return defaults if no settings found
    return { ...defaultSettings };
  },

  /**
   * Saves all application settings at once
   * @param settings - Complete settings object
   */
  async saveAllSettings(settings: AppSettings): Promise<void> {
    try {
      // Clear existing settings
      await db.table('settings').clear();

      // Create array of {key, value} pairs for bulk insert
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
      }));

      // Insert all settings at once
      await db.table('settings').bulkPut(settingsArray);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Fallback to localStorage if Dexie table doesn't exist yet
      for (const [key, value] of Object.entries(settings)) {
        localStorage.setItem(`setting_${key}`, JSON.stringify(value));
      }
      console.warn('Saved all settings to localStorage as fallback');
    }
  },

  /**
   * Clears all settings
   */
  async clearAllSettings(): Promise<void> {
    try {
      await db.table('settings').clear();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Clear localStorage fallback
      for (const key in defaultSettings) {
        localStorage.removeItem(`setting_${key}`);
      }
    }
  },
};

export default settingsService;
