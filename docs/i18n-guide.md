# Internationalization Guide

This document provides guidelines for implementing and maintaining internationalization (i18n) in the Driving-Lesson Tracker application.

## Supported Languages

- Finnish (fi) - Primary language
- English (en) - Planned for future releases
- Swedish (sv) - Planned for future releases

## Setup and Configuration

The application uses `react-i18next` for internationalization. The configuration can be found in `src/i18n.ts`. Key features include:

- Namespace separation by feature area
- Browser language detection
- Local storage persistence
- Fallback to Finnish for missing translations
- Custom formatters for dates and numbers

## Translation File Structure

Translations are stored in JSON files organized by namespace and language:

```
src/
└── locales/
    ├── fi/
    │   ├── common.json     # Common UI elements, navigation, errors
    │   ├── students.json   # Student-related translations
    │   ├── lessons.json    # Lesson-related translations
    │   └── settings.json   # Settings-related translations
    ├── en/
    │   └── ... (same structure)
    └── sv/
        └── ... (same structure)
```

## Coding Guidelines

### Basic Text Translation

Use the `useTranslation` hook to get the `t` function:

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t } = useTranslation(['common']);
  
  return <h1>{t('welcome.title')}</h1>;
};
```

### Using Multiple Namespaces

```tsx
const { t } = useTranslation(['students', 'common']);

// Use translation from the students namespace
t('students:list.title');

// Use translation from the common namespace (fallback)
t('common:buttons.save');
```

### Translation with Parameters

```tsx
// In translation file
// "welcome": "Welcome, {{name}}!"

// In component
t('welcome', { name: 'John' }); // "Welcome, John!"
```

### Handling Plurals

```tsx
// In translation file
// "items": "{{count}} item",
// "items_plural": "{{count}} items"

// In component
t('items', { count: 1 }); // "1 item"
t('items', { count: 2 }); // "2 items"
```

### Date and Number Formatting

```tsx
// Date formatting
const date = new Date();
t('dateLabel', { date, formatParams: { date: { format: 'short' } } });

// Number formatting
t('price', { price: 123.45, formatParams: { price: { format: 'currency' } } });
```

### Translation Components

For complex text with HTML, use the `Trans` component:

```tsx
import { Trans } from 'react-i18next';

// In translation file
// "instructions": "Click <strong>here</strong> to continue"

// In component
<Trans i18nKey="instructions" components={{ strong: <strong /> }} />
```

## Adding New Translations

1. Create a key in the appropriate namespace file (e.g., `src/locales/fi/common.json`)
2. Follow the naming convention: camelCase with dot notation for hierarchy
3. Use descriptive keys that indicate the purpose of the text
4. Group related translations together

## Translation Key Naming Conventions

- Use camelCase for keys
- Use dot notation for hierarchy (e.g., `buttons.save`, `errors.notFound`)
- Use namespaces to separate by feature area

Example structure:

```json
{
  "app": {
    "name": "Driving-Lesson Tracker",
    "version": "Version {{version}}"
  },
  "navigation": {
    "students": "Students",
    "lessons": "Lessons"
  },
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "errors": {
    "notFound": "Not found",
    "serverError": "Server error"
  }
}
```

## Testing Translations

When adding new translations:

1. Ensure the key is present in all supported language files
2. Test with the language switcher to verify appearance in all languages
3. Check edge cases (long text, special characters)

## Language Detection and Switching

The application automatically detects the user's preferred language based on browser settings. Users can also manually switch languages using the LanguageSwitcher component.

## Best Practices

1. **Extract all user-facing strings** - Don't hardcode any text
2. **Use consistent terminology** across the application
3. **Consider text expansion** - Some languages may require more space
4. **Keep translations simple** - Avoid complex grammar constructs
5. **Provide context** for translators with comments where needed
6. **Use pluralization** for countable items
7. **Format dates and numbers** according to locale
8. **Test UI with different languages** to catch layout issues

## Common Pitfalls

- **Missing keys** - Always check that keys exist
- **Concatenating strings** - Never concatenate translated strings
- **Assuming word order** - Order of words varies by language
- **Hardcoding formats** - Use locale-aware formatting for dates and numbers
- **Forgetting context** - Same word might translate differently in different contexts 