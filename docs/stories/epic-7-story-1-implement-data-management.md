# Epic-7 - Story-1

# Implement Data Management Actions

**As a** Driving Instructor
**I want** to be able to export/import student data and separately backup/restore my entire application state (data + settings)
**so that** I can manage my data safely, transfer core data, and have complete recovery options.

## Status

Completed

## Context

- **Background:** The Data Management page (`/export-import`) currently exists with placeholder buttons. Settings are not currently persisted.
- **Goal:** Implement distinct functionalities:
    1.  **Export/Import (Vie/Tuo tiedot):** For transferring *only* student and lesson data between instances/devices.
    2.  **Backup/Restore (Luo/Palauta varmuuskopio):** For creating/restoring a *complete snapshot* including students, lessons, AND application settings (theme, language, etc.).
    3.  **Delete All Data:** For resetting the application.
- **Justification:** Provides granular control for data transfer (export/import) and comprehensive safety/recovery (backup/restore).
- **Plan:** 
    1. Persist application settings (e.g., using `localStorage`).
    2. Modify `DataManagementPage.tsx` to handle the different actions.
    3. Create service functions to interact with Dexie.js (for data) and settings storage.

## Estimation

Story Points: 8 (Increased complexity due to settings persistence, separate flows for data vs. full backup, more robust validation)

## Tasks

1.  - [x] **Persist Application Settings**
    1.  - [x] **Use Dexie:** Create a new `settings` table in `db.ts` to store settings (e.g., key-value pairs).
    2.  - [x] Modify `SettingsPage.tsx` (and potentially theme/language providers/hooks) to save setting changes to the chosen storage.
    3.  - [x] Ensure settings are loaded from storage when the application starts.
2.  - [x] **Implement Export Data (Students & Lessons Only)**
    1.  - [x] Create a service function (e.g., `dataService.exportStudentData()`) for students/lessons.
    2.  - [x] Format into JSON (e.g., `{ type: "studentData", version: 1, students: [...], lessons: [...] }`).
    3.  - [x] Implement button handler in `DataManagementPage.tsx` to call service and trigger download.
    4.  - [x] Add UI feedback.
3.  - [x] **Implement Import Data (Students & Lessons Only)**
    1.  - [x] Add file input triggered by "Tuo tiedot".
    2.  - [x] Implement file reading/parsing.
    3.  - [x] Add confirmation dialog (Replace student/lesson data?).
    4.  - [x] Create service function (e.g., `dataService.importStudentData(jsonData)`) to:
        1.  - [x] Validate JSON `type` and `version`.
        2.  - [x] Clear existing `students` and `lessons` tables.
        3.  - [x] Bulk-insert validated data.
    5.  - [x] Handle errors and provide UI feedback.
4.  - [x] **Implement Create Backup (Data + Settings)**
    1.  - [x] Create a service function (e.g., `backupService.createFullBackup()`) to:
        1.  - [x] Fetch all student/lesson data from Dexie.
        2.  - [x] Fetch all settings from their storage location.
    2.  - [x] Format into JSON (e.g., `{ type: "fullBackup", version: 1, settings: {...}, students: [...], lessons: [...] }`).
    3.  - [x] Implement button handler for "Luo varmuuskopio" to call service and trigger download.
    4.  - [x] Add UI feedback.
5.  - [x] **Implement Restore Backup (Data + Settings)**
    1.  - [x] Add file input triggered by "Palauta varmuuskopio".
    2.  - [x] Implement file reading/parsing.
    3.  - [x] Add confirmation dialog (Replace ALL data and settings?).
    4.  - [x] Create service function (e.g., `backupService.restoreBackup(jsonData)`) to:
        1.  - [x] Validate JSON `type` and `version`.
        2.  - [x] Clear existing `students` and `lessons` tables.
        3.  - [x] Clear existing settings storage.
        4.  - [x] Bulk-insert validated student/lesson data.
        5.  - [x] Save validated settings to storage.
    5.  - [x] Handle errors and provide UI feedback. *Force reload/refresh was implemented with a prompt after settings restoration.* 
6.  - [x] **Implement Delete All Data**
    1.  - [x] Add confirmation dialog (irreversible, delete ALL data?).
    2.  - [x] Create service function (e.g., `dataService.clearAllData()`) to clear `students` and `lessons` tables. *(By default it preserves settings, but can optionally clear them too)*
    3.  - [x] Implement button handler for "Tyhjennä kaikki tiedot".
    4.  - [x] Add UI feedback.
7.  - [x] **Refine UI and Error Handling**
    1.  - [x] Ensure buttons are disabled during operations.
    2.  - [x] Provide loading indicators.
    3.  - [x] Display informative error messages.
    4.  - [x] Update translations for new buttons, dialogs, and messages.

## Implementation Notes

1. **Settings Storage**:
   - Created a new `settings` table in the Dexie database (version 6)
   - Added a `settingsService` to handle saving and retrieving settings
   - Settings service includes a fallback to localStorage if the table doesn't exist yet

2. **Data/Backup Structure**:
   - Implemented distinct data types for exports vs backups
   - `studentData` format for export/import contains only students, lessons, milestones
   - `fullBackup` format includes all the above plus settings

3. **UX Considerations**:
   - Added confirmation dialogs for destructive actions
   - Implemented loading indicators during data operations
   - Added Snackbar notifications for operation feedback
   - Prompt to reload the application after restoring settings

4. **Resilience**:
   - Added error handling throughout the service functions
   - Validation of data structure before processing
   - Automatic backup creation before data deletion

5. **Potential Improvements for Future**:
   - Consider adding a progress indicator for large backups
   - Add support for selective import/backup restoration
   - Implement export/import of specific students

## Constraints

- Use Dexie.js via service layer for student/lesson data.
- Use chosen mechanism for settings persistence.
- Robust user confirmation for destructive actions.
- Browser PWA compatibility for file handling.

## Data Models / Schema

- Define distinct JSON structures for export vs. backup:
  ```json
  // For Export/Import (Data Only)
  {
    "type": "studentData",
    "version": 1,
    "exportedAt": "YYYY-MM-DDTHH:mm:ssZ",
    "students": [ { ... } ],
    "lessons": [ { ... } ]
  }
  
  // For Backup/Restore (Full Snapshot)
  {
    "type": "fullBackup",
    "version": 1,
    "exportedAt": "YYYY-MM-DDTHH:mm:ssZ",
    "settings": { "language": "fi", "darkMode": false, ... },
    "students": [ { ... } ],
    "lessons": [ { ... } ]
  }
  ```

## Structure

- Modifications in:
  - `src/components/pages/DataManagementPage.tsx`
  - `src/components/pages/SettingsPage.tsx` (and related hooks/providers)
- New functions likely needed in:
  - `src/services/db.ts` (or `dataService.ts`, `backupService.ts`)
  - New service/utils for settings persistence (e.g., `src/services/settingsService.ts`)
- Translation updates in:
  - `src/locales/fi/settings.json`

## Diagrams

```mermaid
sequenceDiagram
    participant User
    participant DataMgmtPage
    participant SettingsPage
    participant SettingsService
    participant DataService
    participant BackupService
    participant DexieDB
    participant SettingsStore

    Note over User, SettingsStore: Settings Persistence Flow
    User->>SettingsPage: Changes setting (e.g., dark mode)
    SettingsPage->>SettingsService: saveSetting('darkMode', true)
    SettingsService->>SettingsStore: Store setting

    Note over User, DexieDB: Data Export Flow
    User->>DataMgmtPage: Clicks Export Data
    DataMgmtPage->>DataService: exportStudentData()
    DataService->>DexieDB: Read students & lessons
    DexieDB-->>DataService: Data
    DataService-->>DataMgmtPage: JSON (type: studentData)
    DataMgmtPage->>User: Trigger download
    
    Note over User, SettingsStore: Full Backup Flow
    User->>DataMgmtPage: Clicks Create Backup
    DataMgmtPage->>BackupService: createBackup()
    BackupService->>DataService: exportStudentData()
    DataService-->>BackupService: Student/Lesson Data
    BackupService->>SettingsService: getAllSettings()
    SettingsService->>SettingsStore: Read all settings
    SettingsStore-->>SettingsService: Settings data
    SettingsService-->>BackupService: Settings data
    BackupService-->>DataMgmtPage: JSON (type: fullBackup, with settings)
    DataMgmtPage->>User: Trigger download

    Note over User, SettingsStore: Full Restore Flow
    User->>DataMgmtPage: Clicks Restore Backup
    User->>DataMgmtPage: Selects backup file
    DataMgmtPage->>User: Confirm Replace All?
    User->>DataMgmtPage: Confirms
    DataMgmtPage->>BackupService: restoreBackup(parsedJson)
    BackupService->>DataService: importStudentData(students, lessons) // (Clears tables first)
    DataService-->>BackupService: Success/Error
    BackupService->>SettingsService: saveAllSettings(settings)
    SettingsService->>SettingsStore: Clear existing settings
    SettingsStore->>SettingsStore: Store new settings
    SettingsService-->>BackupService: Success/Error
    BackupService-->>DataMgmtPage: Overall Success/Error
    DataMgmtPage->>User: Show feedback (Suggest Refresh)
```

## Dev Notes

- Prioritize implementing settings persistence first.
- Decide if "Delete All Data" should also wipe settings.
- Use distinct filenames for data export vs. full backup (e.g., `ajokamu_data_...` vs `ajokamu_backup_...`).
- Restoring settings might require an application reload to take effect properly. This was implemented using a confirmation dialog after restoring settings with an option to reload. 