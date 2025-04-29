# Epic-5 - Story-1

# Implement Teaching Tips ('Vinkit') Tab

**As a** Driving Instructor
**I want** to access a dedicated 'Vinkit' (Tips) section with categorized teaching advice
**so that** I can easily find relevant strategies to help students learn specific driving skills effectively.

## Status

Draft

## Context

- **Background:** The application currently shows student progress via the `ProgressDashboard` on the `LessonsPage` when a student is selected. There's a need to provide support material for instructors.
- **Goal:** Replace the previous concept of "Tavoitteet" (Goals) with a new, instructor-focused "Vinkit" (Tips) tab.
- **Justification:** Providing readily accessible teaching tips helps instructors enhance their lesson quality and tailor guidance to specific student needs.
- **Plan:** Introduce MUI Tabs ("Overview", "Topics", "Vinkit") on the `LessonsPage`. The "Vinkit" tab will contain expandable sections for different driving topics, offering practical teaching advice. A search function is also planned. Initial research for tip content has been conducted (see `docs/teaching_tips_epic.md`).

## Estimation

Story Points: 2 (Initial structure, placeholders, basic content display)

## Tasks

1.  - [ ] Modify `LessonsPage.tsx`
    1.  - [ ] Add MUI `Tabs` and `Tab` components.
    2.  - [ ] Implement state (`activeTab`) to manage tab selection.
    3.  - [ ] Conditionally render content based on the active tab.
2.  - [ ] Create `TeachingTips.tsx` Component (`src/components/lesson/tips/`)
    1.  - [ ] Set up basic component structure (`Box`, `Typography` for title).
    2.  - [ ] Implement placeholder content display.
3.  - [ ] Create `TipAccordion.tsx` Component (`src/components/lesson/tips/`)
    1.  - [ ] Implement reusable MUI `Accordion` for topic sections.
    2.  - [ ] Structure to accept title and content (tips).
4.  - [ ] Integrate Components
    1.  - [ ] Use `TipAccordion` within `TeachingTips.tsx` to display initial topic areas from the epic.
    2.  - [ ] Replace placeholder in `LessonsPage.tsx` (tab index 2) with `<TeachingTips />`.
5.  - [ ] Add Translations
    1.  - [ ] Add keys (`lessons:tabs.overview`, `lessons:tabs.topics`, `lessons:tabs.tips`) to locale files (`src/locales/`).
    2.  - [ ] Add keys for topic area titles within the Tips tab.

## Constraints

- Must adhere to the existing tech stack (React, TypeScript, MUI v7).
- Follow established project coding standards and rules (e.g., `mui-standards-agent`, `ts-rules/typescript-best-practices-agent`).
- UI must be responsive and work in both light/dark themes.

## Data Models / Schema

```typescript
// Potential interface for structuring tip data (initially static)
interface TeachingTipSection {
  id: string; // e.g., 'basicHandling', 'parking'
  titleKey: string; // Translation key for the section title
  overviewKey: string; // Translation key for the brief overview
  tips: string[]; // Array of tips (can be plain strings or translation keys)
}
```

## Structure

- New components will reside under `src/components/lesson/tips/` as outlined in the epic:
  - `TeachingTips.tsx`
  - `TipAccordion.tsx`
  - `TipSearch.tsx` (Implementation deferred to a later story)
- Modifications primarily in `src/components/pages/LessonsPage.tsx`.
- New translation keys added to `src/locales/`.

## Diagrams

N/A for this story.

## Dev Notes

- The initial tip content added in this story will be based on the research summary in `docs/teaching_tips_epic.md`. Refinement, expansion, and localization of content will be handled in subsequent stories/tasks.
- Search functionality (`TipSearch.tsx` implementation and integration) is planned but deferred to a later story.
- Ensure MUI components (`Tabs`, `Accordion`) follow project standards.

## Chat Command Log

- User: Suggested replacing "Tavoitteet" with "Vinkit" tab containing teaching tips.
- Agent: Confirmed understanding, researched component structure (`LessonsPage.tsx`, `ProgressDashboard.tsx`).
- Agent: Proposed modifying `LessonsPage.tsx` to add Tabs.
- User: Requested research on tips using Perplexity and creation of an epic document.
- Agent: Performed research, created `docs/teaching_tips_epic.md`.
- User: Requested addition of tech stack to the epic.
- Agent: Updated epic with tech stack details.
- User: Requested creation of this story file using the template. 