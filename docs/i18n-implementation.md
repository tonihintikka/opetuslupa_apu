# Internationalization (i18n) Implementation

This document describes the internationalization architecture and implementation details for the Driving-Lesson Tracker application.

## Overview

The application uses the `react-i18next` library (built on top of `i18next`) to handle translations and language-specific formatting. The implementation follows an "internationalization from day one" approach, where all UI text is externalized to translation files from the beginning of development.

## Key Features

- **Multiple Language Support**: Finnish (primary), English and Swedish (secondary)
- **Namespace Organization**: Translations separated by feature area
- **Dynamic Language Switching**: Users can switch languages at runtime
- **Persistence**: Language preference stored in localStorage
- **Auto-Detection**: Automatic language detection based on browser settings
- **Pluralization**: Support for singular/plural forms using ICU message format
- **Interpolation**: Dynamic content insertion with type-safe values
- **Formatting**: Date, time, and number formatting according to locale
- **Performance Optimization**: Language resources loaded on demand

## Directory Structure

```
src/
├── locales/
│   ├── fi/            # Finnish translations (primary)
│   │   ├── common.json
│   │   ├── students.json
│   │   ├── lessons.json
│   │   └── settings.json
│   ├── en/            # English translations
│   │   └── ...
│   └── sv/            # Swedish translations
│       └── ...
├── i18n.ts            # i18n configuration
└── components/
    ├── LanguageSwitcher.tsx   # Language selection component
    └── TranslatedText.tsx     # Reusable translation component
```

## Core Configuration

The `i18n.ts` file contains the core configuration:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Finnish translations
import commonFI from './locales/fi/common.json';
import studentsFI from './locales/fi/students.json';
import lessonsFI from './locales/fi/lessons.json';
import settingsFI from './locales/fi/settings.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fi: {
        common: commonFI,
        students: studentsFI,
        lessons: lessonsFI,
        settings: settingsFI
      }
    },
    fallbackLng: 'fi',
    defaultNS: 'common',
    pluralSeparator: '_',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        // Formatting logic for dates, numbers, etc.
      }
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'drivingLessonTracker_language',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: true,
    }
  });

export default i18n;
```

## Translation JSON Structure

Translations are organized by namespace in JSON files:

### common.json

Contains general UI elements used across the application:

```json
{
  "app": {
    "name": "Opetuslupa-sovellus",
    "loading": "Ladataan..."
  },
  "navigation": {
    "students": "Oppilaat",
    "lessons": "Ajotunnit"
  },
  "actions": {
    "add": "Lisää",
    "edit": "Muokkaa"
  }
}
```

### Feature-specific namespaces

Each feature area has its own namespace with related translations:

```json
// students.json
{
  "studentManagement": "Oppilaiden hallinta",
  "addStudent": "Lisää oppilas",
  "studentInfo": {
    "name": "Nimi",
    "email": "Sähköposti"
  }
}
```

## Usage in Components

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

function StudentList() {
  const { t } = useTranslation(['common', 'students']);
  
  return (
    <div>
      <h1>{t('students:studentManagement')}</h1>
      <button>{t('common:actions.add')}</button>
    </div>
  );
}
```

### Complex Translations with HTML

```tsx
import { Trans } from 'react-i18next';

function LessonSummary({ lesson }) {
  return (
    <p>
      <Trans 
        i18nKey="lessons:summary"
        values={{ 
          date: lesson.date,
          minutes: lesson.durationMinutes,
          instructor: lesson.instructor
        }}
        components={{ 
          strong: <strong />,
          link: <a href={`/instructors/${lesson.instructorId}`} />
        }}
      >
        Lesson on <strong>{{ date }}</strong> lasted for {{ minutes }} minutes 
        with <link>{{ instructor }}</link>.
      </Trans>
    </p>
  );
}
```

### Pluralization

```tsx
function LessonCount({ count }) {
  const { t } = useTranslation('students');
  
  return (
    <span>
      {t('studentStats.lessonsCount', { count })}
    </span>
  );
}
```

In the translation file:
```json
{
  "studentStats": {
    "lessonsCount": "{{count}} ajotuntia",
    "lessonsCount_1": "{{count}} ajotunti"
  }
}
```

### Date and Number Formatting

```tsx
function LessonDate({ date }) {
  const { t } = useTranslation();
  
  return (
    <span>
      {t('dateTime.formattedDate', { 
        date, 
        formatParams: {
          date: { format: 'long' }
        } 
      })}
    </span>
  );
}
```

## Reusable Components

### TranslatedText Component

A reusable component that combines translation with Material-UI Typography:

```tsx
import { useTranslation } from 'react-i18next';
import { Typography, TypographyProps } from '@mui/material';

interface TranslatedTextProps extends Omit<TypographyProps, 'children'> {
  textKey: string;
  ns?: string | string[];
  values?: Record<string, any>;
  component?: React.ElementType;
  formatter?: (text: string) => React.ReactNode;
  defaultText?: string;
}

const TranslatedText = ({
  textKey,
  ns,
  values,
  variant,
  component = 'p',
  formatter,
  defaultText,
  ...typographyProps
}: TranslatedTextProps) => {
  const { t } = useTranslation(ns);
  
  const translatedText = t(textKey, values || {});
  const formattedText = formatter ? formatter(translatedText) : translatedText;
  
  return (
    <Typography variant={variant} component={component} {...typographyProps}>
      {formattedText}
    </Typography>
  );
};
```

### LanguageSwitcher Component

Allows users to change the application language:

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation('settings');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleMenuClose();
  };

  return (
    <>
      <Button onClick={handleMenuOpen}>
        {t(`language.${i18n.language}`)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => changeLanguage('fi')}>Suomi</MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage('sv')}>Svenska</MenuItem>
      </Menu>
    </>
  );
};
```

## Best Practices

1. **Use Namespaces**: Organize translations by feature area to maintain clarity
2. **Consistent Key Naming**: Use consistent naming patterns (camelCase, dot notation)
3. **Interpolation**: Use `{{variable}}` syntax for dynamic content
4. **Context for Translators**: Add comments for potentially ambiguous translations
5. **Avoid String Concatenation**: Never concatenate translated strings
6. **Singular Keys**: Use a single key with pluralization rather than separate keys
7. **Test with Pseudo-Localization**: Test UI layouts with longer text strings
8. **Document Conventions**: Create and maintain documentation on translation practices

## Future Enhancements

1. **Translation Management System**: Integration with a TMS like Locize or SimpleLocalize
2. **Auto-Extract Keys**: Automatically extract translation keys from the codebase
3. **Missing Translation Detection**: Runtime warnings for missing translations
4. **RTL Support**: Right-to-left language support for future language additions
5. **Server-Side Translation**: Pre-translate on the server for better performance

## References

- [react-i18next documentation](https://react.i18next.com/)
- [i18next documentation](https://www.i18next.com/)
- [Material-UI Localization Guide](https://mui.com/material-ui/guides/localization/)
- [ICU Message Format](https://formatjs.io/docs/core-concepts/icu-syntax/) 