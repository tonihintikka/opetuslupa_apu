# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Driving-Lesson Tracker

A Progressive Web Application for tracking driving lessons, designed for driving instructors to monitor student progress.

## Features

- **Offline-First**: Works without internet connection
- **PWA**: Installable on mobile devices
- **Privacy-Focused**: All data stored locally on your device
- **Responsive Design**: Works on desktop and mobile
- **Multi-language Support**: Finnish (primary), with English and Swedish support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/driving-lesson-tracker.git

# Navigate to the project directory
cd driving-lesson-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Internationalization (i18n)

The application uses react-i18next for internationalization with the following features:

- **Multiple Languages**: Finnish as primary, with English and Swedish support
- **Namespace Organization**: Translations organized by feature area
- **Language Detection**: Auto-detects browser language with manual override
- **Date & Number Formatting**: Locale-aware formatting of dates and numbers

### Translation Structure

Translations are organized in JSON files under `src/locales/{language}/{namespace}.json`:

```
src/locales/
├── fi/         # Finnish (primary)
│   ├── common.json
│   ├── students.json
│   ├── lessons.json
│   └── settings.json
├── en/         # English
└── sv/         # Swedish
```

### Adding New Translations

1. Add translation keys to the appropriate namespace files
2. Use keys consistently across components
3. For nested keys, use dot notation: `namespace:section.subsection.key`

### Usage in Components

```tsx
// Basic usage
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation(['common', 'students']);
  
  return (
    <div>
      <h1>{t('common:app.title')}</h1>
      <p>{t('students:studentDetails')}</p>
    </div>
  );
}

// For complex content with HTML
import { Trans } from 'react-i18next';

function ComplexContent() {
  return (
    <Trans i18nKey="lessons:summary" values={{ date: '2023-06-01', minutes: 45 }}>
      Lesson on <strong>{{ date }}</strong> lasted for {{ minutes }} minutes.
    </Trans>
  );
}
```

## Project Structure

```
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, fonts, etc.
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   ├── locales/     # Translation files
│   ├── services/    # Business logic services
│   ├── theme/       # Material-UI theme
│   ├── types/       # TypeScript definitions
│   ├── utils/       # Utility functions
│   ├── App.tsx      # Main component
│   ├── i18n.ts      # i18n configuration
│   └── main.tsx     # Entry point
├── docs/            # Documentation
└── ...
```

## Tech Stack

- **Vite**: Fast development and building
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Material-UI**: Component library
- **Dexie.js**: IndexedDB wrapper
- **react-i18next**: Internationalization
- **ESLint/Prettier**: Code quality tools

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
