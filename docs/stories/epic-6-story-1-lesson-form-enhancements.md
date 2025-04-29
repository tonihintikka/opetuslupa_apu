---
description: `Comprehensive description that provides full context and clearly indicates when this rule should be applied. Include key scenarios, impacted areas, and why following this rule is important. While being thorough, remain focused and relevant. The description should be detailed enough that the agent can confidently determine whether to apply the rule in any given situation.`
globs: .cursor/rules/**/*.mdc OR blank
alwaysApply: {true or false}
---

# Epic-6 - Story-1

# Enhance Lesson Form with Timer and Auto-Selections

**As a** Driving Instructor
**I want** an optional timer during lessons and automatic field selections
**so that** I can track lesson duration more easily and spend less time filling out forms.

## Status

Draft

## Context

- **Background:** The current lesson form (`LessonForm.tsx`) requires manual selection of learning stage and completion status. Additionally, there's no way to track lesson time while teaching.
- **Goal:** Add three enhancements to the lesson creation process:
  1. Add an optional timer to track lesson duration in real-time
  2. Automatically select the appropriate learning stage when topics are chosen
  3. Automatically check the "Merkitse suoritetuksi" (Mark as completed) checkbox
- **Justification:** These enhancements will save time for instructors, reduce manual entry errors, and provide a better user experience.
- **Plan:** Modify the existing lesson form components to add these features while maintaining the current UI aesthetics and functionality.

## Estimation

Story Points: 3 (Timer implementation, auto-selection logic, UI changes)

## Tasks

1.  - [x] Implement Lesson Timer Feature
    1.  - [x] Create `LessonTimer.tsx` Component (`src/components/lesson/timer/`)
    2.  - [x] Design timer UI with play/pause and reset buttons using MUI components
    3.  - [x] Implement timer logic with React state and useEffect
    4.  - [x] Add option to transfer timer duration to lesson form (Updates Start/End Time)
2.  - [x] Auto-Learning Stage Selection
    1.  - [x] Modify `LessonForm.tsx` to analyze selected topics
    2.  - [x] Implement logic to determine the most appropriate learning stage
    3.  - [x] Update the learning stage select field automatically
    4.  - [x] Add override capability (user can still change if needed)
3.  - [x] Auto-Mark Completion
    1.  - [x] Modify `LessonForm.tsx` to automatically check "Mark as completed"
    2.  - [x] Ensure user can still toggle the checkbox if needed
4.  - [x] Integrate Components
    1.  - [x] Add timer to lesson form with proper styling (inside Collapse)
    2.  - [x] Ensure timer state persists during form interactions
    3.  - [ ] Test all auto-selection behaviors with various topic combinations
5.  - [x] Add Translations
    1.  - [x] Add keys for timer-related UI elements to locale files
    2.  - [x] Update any tooltips or helper text

## Constraints

- Must adhere to the existing tech stack (React, TypeScript, MUI v7).
- Follow established project coding standards and rules.
- UI must be responsive and work in both light/dark themes.
- Auto-selections must be overridable by the user.
- Timer must be optional and not disrupt current form workflow.

## Data Models / Schema

Existing models will be used. No new schema required, but the following logic will be added:

```typescript
// Auto-learning stage selection pseudocode
const determineOptimalLearningStage = (selectedTopics: string[]): LearningStage => {
  // Map topics to their stages
  const stagesFromTopics = selectedTopics.map(topicId => {
    const topic = lessonTopics.find(t => t.key === topicId);
    return topic?.stage;
  });
  
  // Find most common stage (mode)
  // Return the dominant learning stage or default if undetermined
  return findMostCommonStage(stagesFromTopics) || 'BASIC';
};
```

## Structure

- New timer component:
  - `src/components/lesson/timer/LessonTimer.tsx`
- Modifications to:
  - `src/components/lesson/LessonForm.tsx`
  - Additional translations in `src/locales/fi/lessons.json`

## Diagrams

Simple component diagram showing the integration:
```
┌────────────────────┐
│   LessonForm.tsx   │
└─────────┬──────────┘
          │
          │ includes
          ▼
┌────────────────────┐
│  LessonTimer.tsx   │
└────────────────────┘
```

## Dev Notes

- The timer should be non-intrusive, possibly placed near the start/end time fields
- Auto-selection of learning stage should be triggered after topic selection
- Consider adding a visual indicator when auto-selections occur (subtle highlight or toast)
- Ensure all new components follow the established MUI styling patterns
- Test with various screen sizes to ensure responsive behavior

## Chat Command Log

- User: Requested timer feature when starting a lesson, auto-selection of learning stage based on topics, and automatic marking as completed
- Agent: Created this story file to document implementation plan 