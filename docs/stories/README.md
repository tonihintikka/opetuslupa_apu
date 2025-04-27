# Driving-Lesson Tracker Stories

This directory contains detailed story documents for the Driving-Lesson Tracker PWA project. Each story follows a consistent template and provides comprehensive information about implementation details, tasks, constraints, and technical specifications.

## Project Overview

The Driving-Lesson Tracker is a Progressive Web Application designed for driving instructors to track student progress, lesson details, and driving minutes. It features offline-first functionality, local data storage, and a responsive design that works across devices.

## Core Workflow

Based on research into best practices for driving instruction applications, the primary workflow is lesson-centric rather than student-centric:

1. **Daily workflow starts with lessons**: Instructors typically plan and conduct multiple lessons each day, so the app prioritizes lesson management as the default entry point
2. **Student management as supporting function**: While student records are essential, they're referenced within the lesson workflow rather than being the primary focus
3. **Progress visualization**: Both lesson history and student progress views provide different perspectives on the same underlying data

This lesson-centric approach is reflected in the navigation structure and default landing pages throughout the application.

## Epic Structure

### Epic-1: Core Application Foundation
- [Story 1: Project Setup and Configuration](./Epic-1-Story-1.md)
- [Story 2: Database Implementation](./Epic-1-Story-2.md)
- [Story 3: Basic UI Navigation](./Epic-1-Story-3.md)

### Epic-2: Student and Lesson Management
- [Story 1: Student Management UI](./Epic-2-Story-1.md)
- [Story 2: Lesson Recording Functionality](./Epic-2-Story-2.md)
- [Story 3: Student-Lesson Relationship](./Epic-2-Story-3.md)

### Epic-3: Data Visualization and Reporting
- [Story 1: Enhanced Lesson Recording Experience](./Epic-3-Story-1.md)

### Epic-4: PWA Implementation
- Coming soon

### Epic-5: Future Enhancements
- Coming soon

## Story Template

All stories follow a standardized template that includes:

- User story (As a/I want/so that)
- Current status
- Context and background
- Story points estimation
- Detailed tasks with checkboxes
- Constraints
- Data models and schemas
- File structure
- Diagrams
- Developer notes

## Workflow

Stories are worked on in order of priority, with dependencies noted in the Context section. Each story document serves as both a planning tool and documentation for completed work.

For more information about the overall project, please refer to the [PRD document](../PRD.md) in the parent directory. 