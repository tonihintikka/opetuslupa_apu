# Epic-8 - Story-1

# Implement Dark Mode Theme

**As a** User
**I want** to be able to switch between light and dark themes
**so that** I can use the application comfortably in different lighting conditions and according to my preference.

## Status

Draft

## Context

- **Background:** The application currently uses a light theme by default. The settings page has a placeholder switch for Dark Mode, but it's not functional and the setting isn't persisted.
- **Goal:** Implement a fully functional dark mode, allowing users to toggle between light and dark themes, with their preference saved.
- **Justification:** Improves user experience, accessibility, and caters to user preferences for visual themes.
- **Plan:** Utilize MUI's theming capabilities, create a theme context/provider, persist the setting using Dexie, and ensure components adapt correctly.

## Estimation

Story Points: 5 (Theme definition, context setup, Dexie persistence, component review)

## Tasks

1.  - [ ] **Define Theme Objects**
    1.  - [ ] In `src/theme/theme.ts` (or create if needed), define `lightTheme` options using `createTheme`.
    2.  - [ ] Define `darkTheme` options, paying attention to background colors, text colors, primary/secondary shades, and component default styles suitable for dark mode.
2.  - [ ] **Create Theme Context & Provider**
    1.  - [ ] Create `src/context/ThemeContext.tsx` (or similar).
    2.  - [ ] Define the context shape (e.g., `{ mode: 'light' | 'dark', toggleTheme: () => void }`).
    3.  - [ ] Create a `ThemeProviderComponent` that:
        1.  - [ ] Holds the current mode state (`useState`).
        2.  - [ ] Reads the persisted theme preference from Dexie on initial load (`useEffect`).
        3.  - [ ] Provides a `toggleTheme` function that updates the state and saves the new preference to Dexie.
        4.  - [ ] Selects the appropriate theme object (`lightTheme` or `darkTheme`) based on the current mode state.
        5.  - [ ] Wraps its children with MUI's `<ThemeProvider theme={selectedTheme}>`.
        6.  - [ ] Provides the `mode` and `toggleTheme` function via the React Context Provider.
3.  - [ ] **Integrate Theme Provider**
    1.  - [ ] Wrap the application's root (`AppShell` or in `main.tsx`) with the `ThemeProviderComponent`.
4.  - [ ] **Implement Dexie Persistence for Theme**
    1.  - [ ] Ensure the `settings` table exists in `src/services/db.ts` (from Epic-7).
    2.  - [ ] Create service functions (e.g., in `src/services/settingsService.ts`) to get/set the theme preference (e.g., `getSetting('themeMode')`, `setSetting('themeMode', 'dark')`).
    3.  - [ ] Call these service functions within the `ThemeProviderComponent` for loading and saving the theme mode.
5.  - [ ] **Connect Settings Page Toggle**
    1.  - [ ] In `SettingsPage.tsx`, consume the `ThemeContext`.
    2.  - [ ] Set the Dark Mode switch's `checked` state based on `context.mode === 'dark'`.
    3.  - [ ] Call `context.toggleTheme` in the switch's `onChange` handler.
    4.  - [ ] *Re-enable* the switch component (it will be disabled in the next step).
6.  - [ ] **Component Styling Review & Refinement**
    1.  - [ ] Thoroughly test all application pages and components in both light and dark modes.
    2.  - [ ] Identify components that don't adapt well (e.g., hardcoded colors, poor contrast).
    3.  - [ ] Refactor component styling to use theme variables (`theme.palette`, `theme.spacing`, `sx` prop) according to `mui-standards-agent` rule.
    4.  - [ ] Pay special attention to custom components, charts, or elements not directly based on MUI.

## Constraints

- Must integrate with the planned Dexie `settings` table for persistence.
- Must use MUI's standard theming approach.
- Components must adhere to `mui-standards-agent` to minimize refactoring.

## Structure

- New files/modifications:
  - `src/theme/theme.ts`
  - `src/context/ThemeContext.tsx` (or similar)
  - `src/services/settingsService.ts` (or functions in `db.ts`)
  - `src/main.tsx` or `src/App.tsx` (to add provider)
  - `src/components/pages/SettingsPage.tsx`
- Potential modifications to various components if styling needs adjustment.

## Dev Notes

- Test contrast ratios, especially for text on different backgrounds.
- Consider using MUI's `CssBaseline` component to apply baseline styles consistent with the theme.
- Leverage browser dev tools to inspect styles and theme variables. 