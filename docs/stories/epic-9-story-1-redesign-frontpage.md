# Epic-9 - Story-1

# Redesign Front Page for Better User Experience

**As a** Driving Instructor  
**I want** a more visually appealing and simplified front page  
**so that** I can quickly access important information and easily select students or create new ones.

## Status

Draft

## Context

- **Background:** The current front page (Lessons Page) shows a dropdown menu for student selection and minimal text when no student is selected. It lacks visual appeal and doesn't provide a clear workflow for users.
- **Goal:** Redesign the front page to provide a brief app description, prominently display student selection UI, and show a clear path to create new students if none exist.
- **Justification:** Improves the initial user experience, provides more immediate value, and creates a more intuitive flow for the main use cases.
- **Plan:** Create a visually attractive layout with app description, cards for student selection, and clear CTAs for common actions.

## Estimation

Story Points: 3 (UI redesign, component updates, responsive layout adjustments)

## Tasks

1. - [ ] **Create App Description Component**
   1. - [ ] Design a brief, visually appealing description of the app purpose
   2. - [ ] Include key features/benefits in a concise format
   3. - [ ] Make text translatable via i18n

2. - [ ] **Design Student Selection Cards**
   1. - [ ] Replace dropdown with visual card-based student selection
   2. - [ ] Include student name and possibly avatar/icon
   3. - [ ] Show quick-access buttons for common actions (view progress, add lesson) when a student is selected
   4. - [ ] Implement responsive grid layout for multiple students

3. - [ ] **Improve Empty State Experience**
   1. - [ ] Design visually appealing empty state when no students exist
   2. - [ ] Include clear CTA button to add a new student
   3. - [ ] Provide brief guidance text explaining the first step

4. - [ ] **Update LessonsPage Component**
   1. - [ ] Modify component structure to implement new design
   2. - [ ] Ensure all existing functionality is preserved
   3. - [ ] Maintain responsive behavior for all device sizes
   4. - [ ] Add smooth transitions/animations where appropriate
   5. - [ ] Move timer functionality to be accessible only after selecting a student

5. - [ ] **Update Navigation Flow**
   1. - [ ] Ensure proper routing when selecting a student
   2. - [ ] Maintain breadcrumb navigation for going back to student selection
   3. - [ ] Update any references to the old front page structure

## Constraints

- Must maintain all existing functionality
- Must work well on both mobile and desktop views
- Must follow MUI v7 design standards and component practices
- Must support both light and dark themes

## Structure

- Files to modify:
  - `src/components/pages/LessonsPage.tsx` (primary file for changes)
  - `src/locales/fi/lessons.json` (for new translation keys)
  - `src/locales/en/lessons.json` (for new translation keys)

## Design Mockup

### Main View (With Students)
```
┌────────────────────────────────────────────────┐
│ [Header/AppBar]                                │
├────────────────────────────────────────────────┤
│                                                │
│  Ajokamu - Driving Lesson Tracker              │
│                                                │
│  Track and manage your students' driving       │
│  progress with ease.                           │
│                                                │
│  [Add Student]                                 │
│                                                │
│  Select a student:                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │         │  │         │  │         │        │
│  │ Student │  │ Student │  │ Student │        │
│  │    A    │  │    B    │  │    C    │        │
│  │         │  │         │  │         │        │
│  │[View]   │  │[View]   │  │[View]   │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                │
└────────────────────────────────────────────────┘
```

### Student Selected View
```
┌────────────────────────────────────────────────┐
│ [Header/AppBar]                                │
├────────────────────────────────────────────────┤
│                                                │
│  < Back to Students List                       │
│                                                │
│  Student A                                     │
│                                                │
│  [Start Lesson] [Start Timer] [View Progress]  │
│                                                │
│  [Student details and information will appear  │
│   here, with tabs for different views]         │
│                                                │
└────────────────────────────────────────────────┘
```

### Empty State (No Students)
```
┌────────────────────────────────────────────────┐
│ [Header/AppBar]                                │
├────────────────────────────────────────────────┤
│                                                │
│  Ajokamu - Driving Lesson Tracker              │
│                                                │
│  Track and manage your students' driving       │
│  progress with ease.                           │
│                                                │
│  [illustration/icon]                           │
│                                                │
│  No students yet                               │
│                                                │
│  Get started by adding your first student      │
│                                                │
│  [Add Student]                                 │
│                                                │
└────────────────────────────────────────────────┘
```

## Dev Notes

- Consider using MUI's Card components for student selection
- Add subtle animation/hover effects for better interactivity
- Use theme.spacing consistently for layout margins and padding
- Ensure all text is properly translated through i18n
- Make sure "Start Lesson" and "Start Timer" buttons are only available after selecting a student
- Test thoroughly on different screen sizes and orientations 