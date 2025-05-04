# AjoKamu - Driving Instruction Assistant PWA

A Progressive Web Application (PWA) designed to assist driving instructors in teaching and tracking student progress. This project was developed using agent-based software development methodologies as part of research into AI-assisted programming.

![AjoKamu App Icon](public/ajokamu-icon.svg)

![AjoKamu Screenshot](docs/Screenshot%202025-04-28%20at%2016.20.06.png)

## Project Overview

AjoKamu is a driving instruction management tool that runs as a PWA with complete offline functionality, storing all data locally on the device. It allows instructors to:

- Track multiple students and their progress
- Record and manage driving lessons
- Monitor skill development across different driving topics
- Access teaching tips and educational content
- Visualize student improvement over time
- Export and import data for backup purposes

## Development Approach

This project was developed entirely using agent-based development:

1. **Initial Research Phase**: Conducted deep research on Finnish driving instruction requirements and methodologies using AI.
2. **Technology Selection**: Used AI to research and select the best technologies for PWA development in this context.
3. **Project Planning**: Created plans in Epic-Story format for systematic implementation.
4. **Iterative Development**: Implemented features one by one, with continuous testing.
5. **Multi-Agent Problem Solving**: Used multiple AI models (Claude 3.7 Sonnet, Gemini 2.5 Pro) to troubleshoot implementation challenges.

The project utilized [BMad's Cursor Custom Agents and Rules Generator](https://github.com/bmadcode/cursor-custom-agents-rules-generator) for creating development rules and documentation templates.

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: React Context API
- **Local Database**: Dexie.js (IndexedDB wrapper)
- **i18n**: Internationalization with support for Finnish, Swedish, and English
- **PWA Features**: Service workers, manifest, offline capability
- **Code Quality**: ESLint, Prettier

## Project Status

As of May 4, 2025, the project is functional but still under development. Key features implemented include:

- Student management functionality
- Lesson recording and tracking
- Progress visualization
- Multi-language support
- Import/export functionality
- Full mobile responsiveness
- Offline capability

![AjoKamu Mobile View](docs/Screenshot%202025-04-30%20at%2015.40.02.png)

Recent development work has focused on:
- Fixing TypeScript build errors
- Improving iOS UI contrast issues
- Implementing proper student deletion with cascade functionality
- Enhancing user feedback systems

## Academic Context

This project serves as a case study for a Master's thesis on agent-based software development, demonstrating that modern AI tools can generate functional, production-quality code when guided by someone with domain knowledge and clear requirements.

## Development Timeline

This project was developed in a remarkably short timeframe using agent-based development approaches:

- **Total Development Time**: Approximately 14 hours
  - Initial intensive session: ~7 hours on April 27, 2025 (28 commits)
  - Additional development: ~7 hours spread across April 28 - May 4, 2025

The git history shows active development across the following dates:
- April 27, 2025: Initial project setup and core functionality
- April 28-30, 2025: Feature expansion and refinement
- May 3-4, 2025: Bug fixes, TypeScript error resolution, and documentation improvements

This efficient development timeline demonstrates the potential of agent-based software development to dramatically reduce development time while maintaining code quality.

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
```

## Installation and Usage

```bash
# Clone the repository
git clone https://github.com/tonihintikka/opetuslupa_apu.git

# Navigate to the project directory
cd opetuslupa_apu

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application can be accessed at `http://localhost:5173` (or the next available port) during development.

## Internationalization (i18n)

The application uses `react-i18next` for internationalization.

- **Languages**: Finnish (primary), Swedish, and English.
- **Namespaces**: Translations organized by feature (`common`, `students`, `lessons`, `settings`).
- **Detection**: Browser language detection with localStorage persistence.
- **Formatting**: Locale-aware date formatting.

Translations are located in `src/locales/{language}/{namespace}.json`.

## Future Development

Planned improvements include:
- Enhanced data visualization
- Additional educational content
- Further UI/UX refinements
- Performance optimizations
- Expanded testing coverage

## License

[MIT License]

## Acknowledgements

- [BMad's Cursor Custom Agents and Rules Generator](https://github.com/bmadcode/cursor-custom-agents-rules-generator) for development methodology
- Various AI models (Claude 3.7 Sonnet, Gemini 2.5 Pro) that contributed to development
- Finnish driving education resources for domain knowledge

## Known Issues

### Mobile Layout

- **Settings Page Header Spacing**: There's an inconsistency in how the settings page header is displayed on iOS devices. While other pages (Students, Lessons, Tips) display correctly, the Settings page may require additional padding/margin adjustments for the first element to be properly visible. This is related to how iOS Safari handles safe areas and status bar spacing in PWA mode.

- **iOS PWA Display**: On iOS when running as a PWA, some devices may experience layout variations due to differences in status bar height, notch dimensions, and safe area insets.
