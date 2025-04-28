# Driving-Lesson Tracker (Opetuslupa Apu)

A Progressive Web Application (PWA) designed for driving instructors in Finland to track driving lessons and monitor student progress effectively.

![Driving Lesson Tracker Screenshot](docs/Screenshot%202025-04-28%20at%2016.20.06.png)

## Features

- **Student Management**: Add, edit, and view student details.
- **Lesson Tracking**: Record lesson date, time, duration, covered topics, notes, and kilometers.
- **Topic Performance Rating**: Rate student performance on each topic (1-5 stars) during a lesson.
- **Progress Dashboard**: Visualize overall and topic-specific progress for each student.
- **Smart Session Starter**: Initiate new lessons focused on topics needing the most practice, based on progress data.
- **Lesson Drafts**: Automatically save lesson progress as a draft, preventing data loss.
- **Offline-First**: Fully functional without an internet connection using IndexedDB.
- **PWA**: Installable on mobile devices for a native app-like experience.
- **Privacy-Focused**: All data is stored locally on the user's device.
- **Responsive Design**: Adapts to various screen sizes (desktop, tablet, mobile).
- **Multi-language Support**: Primarily Finnish, with English support planned.
- **Light/Dark Theme**: Supports user preference for light or dark mode.

## Getting Started

### Prerequisites

- Node.js v18.x or higher
- npm v10.x or higher

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/tonihintikka/opetuslupa_apu.git

# Navigate to the project directory
cd opetuslupa_apu

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## Internationalization (i18n)

The application uses `react-i18next` for internationalization.

- **Languages**: Finnish (primary), English planned.
- **Namespaces**: Translations organized by feature (`common`, `students`, `lessons`, `settings`).
- **Detection**: Browser language detection with localStorage persistence.
- **Formatting**: Locale-aware date formatting.

Translations are located in `src/locales/{language}/{namespace}.json`.

### Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation(['common', 'students']);
  return <h1>{t('students:title')}</h1>;
}
```

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components (layout, common, feature-specific)
│   ├── constants/      # Application constants (e.g., lesson topics)
│   ├── hooks/          # Custom React hooks (data fetching, calculations)
│   ├── locales/        # i18n translation files
│   ├── services/       # Business logic, data persistence (Dexie.js wrappers)
│   ├── theme/          # Material-UI theme configuration
│   ├── types/          # TypeScript type definitions (global, db)
│   ├── App.tsx         # Main application component, router setup
│   ├── i18n.ts         # i18n configuration
│   ├── main.tsx        # Application entry point
│   └── router.tsx      # React Router configuration
├── docs/               # Project documentation (stories, diagrams)
├── .github/            # GitHub Actions workflows
├── .husky/             # Git hooks configuration
├── .vscode/            # VSCode settings
├── eslint.config.js    # ESLint configuration
├── index.html          # Main HTML file
├── package.json        # Project dependencies and scripts
├── README.md           # This file
├── tsconfig.json       # TypeScript configuration (app)
├── tsconfig.node.json  # TypeScript configuration (node env)
└── vite.config.ts      # Vite configuration
```

## Tech Stack

- **Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: React Context API (primarily for UI coordination)
- **Local Database**: Dexie.js (IndexedDB wrapper)
- **Internationalization**: react-i18next
- **Code Quality**: ESLint, Prettier
- **Testing**: Vitest (planned)
- **Date Handling**: date-fns

## Contributing

Contributions are welcome! Please follow standard Gitflow practices and ensure code quality checks pass.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
