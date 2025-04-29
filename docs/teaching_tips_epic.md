# Epic: Teaching Tips Feature ("Vinkit" Tab)

## 1. Goal

To replace the current "Tavoitteet" (Goals) concept with a dedicated "Vinkit" (Tips) tab within the student progress view (`LessonsPage.tsx` when a student is selected). This tab will provide driving instructors with readily accessible, structured teaching tips and strategies for various driving lesson topics, categorized by learning stage or topic area.

## 2. Features

*   **New Tab:** Introduce a "Vinkit" tab alongside "Overview" and "Topics" in the `LessonsPage.tsx` when a student is selected.
*   **Content Structure:**
    *   Display tips organized by the main driving topic areas (e.g., Vehicle Handling, Traffic Situations, Parking, Special Conditions, Risk Management).
    *   Use expandable sections (e.g., MUI `Accordion`) for each topic area to keep the interface clean.
    *   Each section should contain:
        *   A brief overview or goal for the topic area.
        *   A bulleted list of actionable teaching tips for instructors.
*   **Search/Filter:** Implement a search bar within the "Vinkit" tab to allow instructors to quickly find tips related to specific keywords (e.g., "parallel parking", "roundabout", "slippery").
*   **UI Component:** Create a new component, likely `src/components/lesson/tips/TeachingTips.tsx`, to encapsulate the logic and rendering of this tab's content.

## 3. Content Outline (Initial Research Summary)

This is a starting point based on initial Perplexity research. Content needs refinement and potentially localization/contextualization for Finland.

### 3.1. Basic Vehicle Handling
*(Topics: Ajoasento, Liikkeellelähtö, Vaihteet, Ohjaus, Peruutus, Mäkilähtö)*

*   **Overview:** Mastering fundamental control of the vehicle.
*   **Tips:**
    *   Start in safe, open areas (e.g., parking lots).
    *   Ensure understanding of basic controls (clutch, accelerator, brakes).
    *   Emphasize smooth, controlled movements (acceleration, braking, steering).
    *   Practice basic maneuvers repeatedly until comfortable.
    *   Provide clear, step-by-step instructions for maneuvers like reversing and hill starts.
    *   Use visual aids if helpful.
    *   Give consistent, constructive feedback.

### 3.2. Traffic Situations
*(Topics: Taajama-ajo, Risteysajo, Liikennevalot, Liikenneympyrät, Kaistanvaihto)*

*   **Overview:** Navigating common urban and suburban traffic scenarios safely and efficiently.
*   **Tips:**
    *   Emphasize constant observation and anticipation (scanning, mirror checks).
    *   Teach proper procedures for intersections, roundabouts, and traffic lights.
    *   Practice lane changes in various traffic densities.
    *   Reinforce signaling rules and right-of-way.
    *   Focus on maintaining safe following distances.
    *   Teach defensive driving techniques – anticipating others' actions.
    *   Practice in progressively more complex traffic environments.

### 3.3. Highway Driving
*(Topics: Maantieajo, Moottoritieajo)*

*   **Overview:** Safe driving at higher speeds, merging, exiting, and lane discipline.
*   **Tips:**
    *   Teach proactive awareness: constant scanning (mirrors, blind spots), anticipating flow.
    *   Practice merging and exiting at appropriate speeds.
    *   Reinforce strict lane discipline (stay right unless overtaking).
    *   Drill proper overtaking procedures.
    *   Emphasize maintaining consistent speed and safe distances.
    *   Discuss fatigue management for longer drives.
    *   Start on quieter highways or during off-peak hours.

### 3.4. Parking
*(Topic: Pysäköinti - tasku, vino, ruutu)*

*   **Overview:** Confidently executing various parking maneuvers.
*   **Tips:**
    *   Break down each maneuver (parallel, bay, angled) into clear, sequential steps.
    *   Use reference points (aligning mirrors, specific points on the car/space).
    *   Emphasize slow, controlled speed during maneuvers.
    *   Stress the importance of all-around checks (mirrors, blind spots, physically looking).
    *   Practice in different space sizes and orientations.
    *   Encourage minor corrections rather than restarting entirely.

### 3.5. Special Conditions
*(Topics: Ajopimealla, Ajosateella, Liukaskeli)*

*   **Overview:** Adapting driving techniques for adverse conditions.
*   **Tips:**
    *   Teach proper use of lights (headlights, high beams, fog lights).
    *   Explain reduced visibility challenges and how to compensate (slower speed, increased distance).
    *   Discuss hydroplaning (rain) and loss of traction (ice/snow).
    *   Emphasize gentle inputs (steering, braking, accelerating) in slippery conditions.
    *   Advise on checking weather forecasts and road conditions before driving.
    *   Practice theoretical or simulated slippery conditions if available.

### 3.6. Risk Management
*(Topics: Riskientunnistus, Hätäjarrutus, Väistämistilanteet)*

*   **Overview:** Identifying, assessing, and responding to potential hazards proactively.
*   **Tips:**
    *   Teach systematic hazard identification (scanning patterns, common risk areas).
    *   Discuss risk assessment (likelihood vs. severity).
    *   Promote defensive driving principles (anticipation, space management).
    *   Practice emergency braking techniques in a safe environment.
    *   Simulate or discuss responses to sudden events (e.g., pedestrian stepping out, car pulling out).
    *   Reinforce adherence to traffic laws as a primary risk reduction strategy.
    *   Encourage continuous learning and self-assessment of risky situations.

## 4. Proposed Component Structure

```
src/
└── components/
    └── lesson/
        └── tips/
            ├── TeachingTips.tsx       # Main component for the "Vinkit" tab
            ├── TipAccordion.tsx     # Reusable accordion component for each topic area
            └── TipSearch.tsx        # Search input component
```

## 5. Tech Stack Considerations

This feature will be implemented using the existing project tech stack:

*   **Framework**: React with TypeScript
*   **UI Library**: Material-UI (MUI) v7 (Components like `Tabs`, `Tab`, `Accordion`, `TextField` for search)
*   **State Management**: React Context API or local component state (`useState`) for managing active tab and search term.
*   **Internationalization**: `react-i18next` for tab labels and potentially tip content if needed.
*   **Build Tool**: Vite

## 6. Next Steps

*   Refine and expand the teaching tips content with more detail and Finland-specific context.
*   Implement the `TeachingTips.tsx` component structure.
*   Integrate the search functionality.
*   Add necessary translations for UI elements.
*   Replace the placeholder in `LessonsPage.tsx` with the actual `<TeachingTips />` component. 