# Driving-Lesson Tracker - Project Architecture

## Overview

The Driving-Lesson Tracker is a Progressive Web Application (PWA) designed to help driving instructors track their students' progress, lesson details, and driving minutes in an offline-first approach. This document outlines the architectural decisions, file organization, and overall structure of the application.

## Tech Stack

The application is built with the following technologies:

- **Vite**: Build tool for fast development and optimized production builds
- **React**: UI library for component-based development
- **TypeScript**: Static typing for better developer experience and code safety
- **Material-UI (MUI)**: Component library implementing Google's Material Design
- **Emotion**: CSS-in-JS styling solution used with MUI
- **Dexie.js**: IndexedDB wrapper for client-side data storage
- **ESLint/Prettier**: Code quality and formatting tools

## Project Structure

```
├── /public                    # Static assets
│   ├── favicon.svg           # Favicon
│   └── ...                   # Other static files
├── /src
│   ├── /components           # React UI components
│   │   ├── /common           # Shared components (EmptyState, LoadingIndicator, etc.)
│   │   ├── /layout           # Layout components (AppShell, Header, Footer, etc.)
│   │   └── /pages            # Page components (Dashboard, Students, Lessons, etc.)
│   ├── /hooks                # Custom React hooks
│   ├── /services             # Business logic and data services
│   │   └── /db               # Database-related services (will be added in Epic-1 Story-2)
│   ├── /theme                # MUI theme configuration
│   ├── /types                # TypeScript type definitions
│   ├── /utils                # Utility functions
│   ├── App.tsx               # Main App component
│   ├── main.tsx              # Application entry point
│   └── vite-env.d.ts         # Vite environment types
├── /docs                      # Project documentation
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── .eslintrc.js               # ESLint configuration
└── .prettierrc                # Prettier configuration
```

## Path Aliases

To improve import readability and maintainability, we've configured path aliases:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@common/*` → `src/components/common/*`
- `@layout/*` → `src/components/layout/*`
- `@pages/*` → `src/components/pages/*`
- `@hooks/*` → `src/hooks/*`
- `@services/*` → `src/services/*`
- `@theme/*` → `src/theme/*`
- `@types/*` → `src/types/*`
- `@utils/*` → `src/utils/*`
- `@assets/*` → `src/assets/*`

Example usage:
```typescript
import AppShell from '@layout/AppShell';
import EmptyState from '@common/EmptyState';
import theme from '@theme';
```

## Component Structure

- **Common Components**: Reusable UI components used across the application
- **Layout Components**: Components that define the overall structure and layout of the app
- **Page Components**: Components that represent full pages of the application

## Theme Customization

We've customized the Material-UI theme to align with the application's design:

- **Color Palette**: Primary (blue) and Secondary (orange) colors with appropriate shades
- **Typography**: Custom font sizes and weights for consistent text appearance
- **Component Overrides**: Customized styles for common components like buttons and cards
- **Responsive Breakpoints**: Defined breakpoints for responsive design

## Development Workflow

1. **Code Quality**: ESLint and Prettier are configured to enforce code quality and consistent formatting
2. **Pre-commit Hooks**: Husky and lint-staged are set up to run linting and formatting before commits
3. **Path Aliases**: Use path aliases for clean and maintainable imports

## Future Enhancements

The following enhancements will be implemented in subsequent stories:

- **Database Layer**: IndexedDB implementation with Dexie.js (Epic-1 Story-2)
- **Navigation System**: Responsive navigation with React Router (Epic-1 Story-3)
- **Student Management**: UI for managing student data (Epic-2 Story-1)
- **Lesson Recording**: UI for recording and tracking lessons (Epic-2 Story-2)
- **PWA Features**: Service worker, offline support, and installability (Epic-4)

## Design Principles

1. **Offline-First**: All data is stored locally and available without an internet connection
2. **Responsive Design**: UI works seamlessly across devices of all sizes
3. **TypeScript**: Strict typing for improved code quality and developer experience
4. **Component Reusability**: Common components are designed for maximum reusability
5. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with JS
6. **Accessibility**: UI components follow WCAG guidelines for accessibility 