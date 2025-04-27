# Architecture for Driving-Lesson Tracker (PWA)

Status: Approved

## Technical Summary

Driving-Lesson Tracker is a Progressive Web Application (PWA) that enables driving instructors to track students' lessons, topics covered, and driving minutes in an offline-first approach. The application uses a Vite + React + TypeScript stack with Material-UI (MUI) for the UI components and Dexie.js as a wrapper for IndexedDB to store data locally in the browser. The PWA features enable installation on mobile devices, offline functionality, and export/import capabilities for data backup and transfer between devices.

As a client-side only application, this solution doesn't require a backend server for the core functionality, making it privacy-focused and accessible even in poor network conditions. The architecture prioritizes a responsive design that works across desktop and mobile devices, with all data processing and storage happening directly on the client.

## Technology Table

| Technology | Description |
| ------------ | ------------------------------------------------------------- |
| Vite 6.x | Build tool and development environment for fast HMR and builds |
| React 18.x | UI library for component-based development |
| TypeScript 5.x | Typed JavaScript for improved developer experience and code safety |
| Material-UI (MUI) 5.x | React component library implementing Google's Material Design |
| Emotion | CSS-in-JS styling solution used with MUI |
| Dexie.js 3.x | Minimalistic wrapper for IndexedDB with a friendly API |
| dexie-react-hooks | React hooks for reactive data access with Dexie (useLiveQuery) |
| dexie-export-import | Extension for JSON data export and import capabilities |
| vite-plugin-pwa | PWA integration for Vite projects including service worker and manifest |
| Workbox | Library for service worker generation and caching strategies |
| Zod | TypeScript-first schema validation library for data validation |
| ESLint | Static code analysis tool for identifying problematic patterns |

## Architectural Diagrams

### Component Architecture

```mermaid
graph TD
    A[App] --> B[AppShell]
    B --> C[StudentList]
    B --> D[StudentForm]
    C --> E[LessonTimeline]
    C --> F[ProgressBars]
    B --> G[ExportImportDialog]
    
    H[MUI Theme Provider] --> A
    I[useDrivingStore Hook] --> C
    I --> D
    I --> E
    I --> F
    I --> G
    
    J[DrivingDB Service] --> I
    K[Service Worker] -.-> A
```

### Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as UI Components
    participant Hook as useDrivingStore
    participant DB as DrivingDB (Dexie)
    participant IndexedDB as Browser IndexedDB
    
    User->>UI: Interacts with app
    UI->>Hook: Call state methods
    Hook->>DB: CRUD operations
    DB->>IndexedDB: Store/Retrieve data
    IndexedDB-->>DB: Data results
    DB-->>Hook: Return data/status
    Hook-->>UI: Update UI state
    UI-->>User: Display updated view
    
    User->>UI: Export data
    UI->>Hook: Call exportDatabase()
    Hook->>DB: Retrieve all data
    DB->>Hook: Return data
    Hook->>UI: JSON data blob
    UI->>User: Download file
    
    User->>UI: Import data
    UI->>Hook: Call importDatabase()
    Hook->>UI: Validate data
    Hook->>DB: Store validated data
    DB->>IndexedDB: Save to database
    DB-->>Hook: Confirm import
    Hook-->>UI: Update UI state
    UI-->>User: Display success
```

## Data Models, API Specs, Schemas, etc...

### Student Entity

```typescript
interface Student {
  id?: string;       // Auto-generated UUID if not provided
  name: string;      // Student's full name
  email?: string;    // Optional contact email
  notes?: string;    // Optional additional notes
  createdAt: Date;   // When the student record was created
}
```

### Lesson Entity

```typescript
interface Lesson {
  id?: string;                 // Auto-generated UUID if not provided
  studentId: string;           // References Student.id
  date: Date;                  // Date of the lesson
  durationMinutes: number;     // Length of lesson in minutes
  topics: string[];            // Array of topics covered (e.g., 'basic driving', 'traffic', 'highway')
  notes?: string;              // Optional additional notes
}
```

### Export/Import JSON Schema

```typescript
interface ExportData {
  version: string;             // Schema version for future compatibility
  exportDate: string;          // ISO timestamp of when export was created
  students: Student[];         // Array of student records
  lessons: Lesson[];           // Array of lesson records
}
```

## Project Structure

```
├── /public                    # Static assets
│   ├── favicon.svg           # Favicon
│   ├── pwa-192.png           # PWA icon (192x192)
│   ├── pwa-512.png           # PWA icon (512x512)
│   └── manifest.webmanifest  # Web app manifest (auto-generated)
├── /src
│   ├── /components           # React UI components
│   │   ├── AppShell.tsx      # Main layout wrapper with navigation
│   │   ├── StudentList.tsx   # List of students
│   │   ├── StudentForm.tsx   # Modal form for adding/editing students
│   │   ├── LessonTimeline.tsx# Shows lessons for a student
│   │   ├── ProgressBars.tsx  # Visual progress indicators
│   │   └── ExportImportDialog.tsx # Data export/import UI
│   ├── /hooks                # Custom React hooks
│   │   └── useDrivingStore.ts# Data management hook
│   ├── /services             # Business logic and data services
│   │   ├── DrivingDB.ts      # Dexie database definition
│   │   └── CryptoService.ts  # Optional encryption (future)
│   ├── /theme                # MUI theme configuration
│   │   └── theme.ts          # Theme settings, colors, typography
│   ├── /types                # TypeScript type definitions
│   │   └── index.ts          # Shared type interfaces
│   ├── /utils                # Utility functions
│   │   └── validation.ts     # Data validation helpers
│   ├── App.tsx               # Main App component
│   ├── main.tsx              # Application entry point
│   ├── vite-env.d.ts         # Vite environment type declarations
│   └── sw-register.ts        # Service Worker registration
├── .eslintrc.js              # ESLint configuration
├── index.html                # HTML template
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite and PWA configuration
```

## Infrastructure

As a client-side only PWA, this application doesn't require traditional backend infrastructure. The application is statically hosted with the following considerations:

- **Hosting**: Static file hosting (Netlify, Vercel, GitHub Pages, or similar)
- **CDN**: Content Delivery Network for optimized asset delivery
- **HTTPS**: Secure connection required for PWA and Service Worker functionality
- **Cache Headers**: Proper configuration for static assets

## Deployment Plan

1. **Development Environment**:
   - Local development using `npm run dev`
   - Testing PWA features with `npm run preview`

2. **Staging Environment**:
   - Automated build and deploy to staging URL on PR creation
   - Testing on various devices and browsers

3. **Production Environment**:
   - Automated build and deploy on merge to main branch
   - PWA audit and performance checks (Lighthouse)
   - Cache strategies verification

## Change Log

| Date | Version | Description |
|------|---------|-------------|
| 2025-07-01 | 0.1.0 | Initial architecture document | 