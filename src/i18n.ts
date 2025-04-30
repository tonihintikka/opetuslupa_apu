import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import types needed for specific declarations
import { InitOptions } from 'i18next';

// Finnish translations - import JSON files
import commonFI from './locales/fi/common.json';
import studentsFI from './locales/fi/students.json';
import lessonsFI from './locales/fi/lessons.json';
import settingsFI from './locales/fi/settings.json';

/**
 * Initialize i18next with the necessary configuration for the driving-lesson tracker
 *
 * Features:
 * - Finnish as default language with placeholders for English and Swedish
 * - Browser language detection with localStorage persistence
 * - Namespace separation by feature area
 * - Interpolation with React-compatible escaping
 */
i18n
  // Detect user language and remember selection
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Define resources (initially only Finnish)
    resources: {
      fi: {
        common: commonFI as Record<string, unknown>,
        students: studentsFI as Record<string, unknown>,
        lessons: lessonsFI as Record<string, unknown>,
        settings: settingsFI as Record<string, unknown>,
      },
      // English and Swedish will be added later and loaded dynamically
    },
    // Language to use if translations in user language are not available
    fallbackLng: 'fi',

    // Default namespace used if not specified
    defaultNS: 'common',

    // Control when to pluralize
    pluralSeparator: '_',

    // Log warnings in development environment
    debug: import.meta.env.DEV,

    // Configure interpolation
    interpolation: {
      // React already escapes values by default
      escapeValue: false,
      // Match formatting to locale standards
      format: (value: unknown, format: string | undefined, lng: string | undefined) => {
        if (typeof value === 'string') {
          if (format === 'uppercase') return value.toUpperCase();
          if (format === 'lowercase') return value.toLowerCase();
          if (format === 'capitalize') return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
        }

        // Date formatting
        if (value instanceof Date) {
          const options: Intl.DateTimeFormatOptions = {};

          if (format === 'short') {
            options.year = 'numeric';
            options.month = '2-digit';
            options.day = '2-digit';
          } else if (format === 'long') {
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
          } else if (format === 'time') {
            options.hour = '2-digit';
            options.minute = '2-digit';
          } else if (format === 'datetime') {
            options.year = 'numeric';
            options.month = '2-digit';
            options.day = '2-digit';
            options.hour = '2-digit';
            options.minute = '2-digit';
          }

          return new Intl.DateTimeFormat(lng, options).format(value);
        }

        return value;
      },
    },

    // Additional configuration
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],
      // Where to store language selection
      lookupLocalStorage: 'drivingLessonTracker_language',
      // Cache selection
      caches: ['localStorage'],
    },

    // React specific options
    react: {
      useSuspense: true,
    },
  } as InitOptions);

export default i18n;
