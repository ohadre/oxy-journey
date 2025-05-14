# Development Journal

## Home Page Redesign & Theming (YYYY-MM-DD) Current Date

### Goals
- Implement a new v0 design for the home page (`src/app/page.tsx`).
- Integrate a new Tailwind CSS theming system based on Shadcn/ui principles.
- Ensure existing functionality (language selection, navigation to game) is preserved.
- Resolve any resulting technical issues (build errors, runtime errors, visual glitches).

### Implementation Details
- **UI & Styling:**
    - Replaced the previous home page structure with a new layout using `next/image` for background and animated character elements (Oxy, Dust, Germ) and `framer-motion` for animations.
    - Applied the `.font-game` class (Bangers font) to titles and buttons for a consistent game aesthetic.
    - Updated `tailwind.config.ts` with a new theme structure based on CSS variables (e.g., `hsl(var(--border))`), added new animations, and included the `tailwindcss-animate` plugin.
    - Replaced content of `src/styles/globals.css` with new base styles, CSS variable definitions for light/dark themes, and the `.font-game` definition.
- **Theming Infrastructure:**
    - Created `src/components/theme-provider.tsx` to manage light/dark mode using `next-themes`.
    - Updated `src/app/layout.tsx` to include the `ThemeProvider`, new Google Fonts link (Bangers), and to import the updated global styles.
- **Functionality Preservation:**
    - Integrated the existing language selection dropdown (English/Hebrew) into the new design.
    - Ensured the main page title dynamically changes based on the selected language (e.g., "Oxy's Journey" to "המסע של חמצנון").
    - Kept the `isLoading` state and immediate loading screen feedback upon clicking the "START" button.
    - Maintained navigation to `/game?lang=[selectedLang]`.

### Debugging & Fixes
- **Dependency Management:**
    - Installed missing `next-themes` and `tailwindcss-animate` packages.
- **Tailwind Configuration:**
    - Corrected `content` paths in `tailwind.config.ts` to ensure proper scanning of `src` directory files, resolving issues where utility classes like `border-border` were not found.
    - Ensured `components.json` was updated to point to `tailwind.config.ts` instead of a non-existent/outdated `.js` version, which was critical for the new theme to be applied.
- **Image Loading:**
    - Resolved 404 errors for page images by updating `src` paths in `src/app/page.tsx` to point to the correct `/textures/` directory and existing image filenames (e.g., `main page bg.png`).
- **Hydration Errors:**
    - Fixed React hydration mismatch errors in `src/app/layout.tsx` (caused by `next-themes` modifying `<html>` attributes) by adding `suppressHydrationWarning` to the `<html>` tag.
- **Deployment Error (Initial):**
    - Fixed a TypeScript error (`'searchParams' is possibly 'null'`) in `src/components/GameSceneLoader.tsx` by using optional chaining (`searchParams?.get('lang')`).

### Current Status
- New home page design is implemented and functional.
- Theming system is in place.
- Language selection and navigation work as expected.
- Major bugs related to the redesign have been addressed.

### Next Steps
- (If any) Minor style adjustments to the language selector to better match the new theme.
- Proceed with other tasks from `tasks/current_tasks.md`.

## Project Migration and Setup (2024-03-19)

### Project Structure Changes
- Migrated codebase from `next-app` directory to root folder
- Established proper Next.js project structure with `src` directory
- Set up essential configuration files:
  - `next.config.ts`
  - `tsconfig.json`
  - `tailwind.config.js`
  - `postcss.config.js`

### Dependencies and Configuration
- Updated package.json with correct dependencies
- Configured Tailwind CSS with proper PostCSS integration
- Added necessary type definitions for Next.js and TypeScript
- Set up testing environment with Jest and React Testing Library

### Component Migration
- Successfully moved all components to `src/components`
- Implemented proper client-side rendering for 3D components
- Fixed TypeScript errors in components
- Resolved hydration issues with dynamic imports

### Recent Fixes
- Resolved `TypeError` in `Oxy.tsx` related to `getKeys` function
- Fixed Tailwind CSS configuration issues
- Updated PostCSS configuration to use `@tailwindcss/postcss`
- Implemented proper type definitions for Next.js

### Current Status
- Project structure is properly organized
- All components are successfully migrated
- Development environment is configured correctly
- Testing setup is in place

### Next Steps
- [ ] Implement Oxy movement constraints within tunnel boundaries
  - Add collision detection with tunnel walls
  - Implement smooth movement restrictions
  - Add visual feedback for boundary proximity
- [ ] Design and implement Oxy's visual representation
  - Consider options: particle system, 3D model, or stylized shape
  - Ensure visibility against tunnel background
  - Add appropriate animations for movement
- [ ] Complete testing suite implementation
- [ ] Add documentation for component usage
- [ ] Implement remaining features
- [ ] Optimize performance
- [ ] Add error boundaries and logging

### Known Issues
- Need to monitor for any hydration-related issues
- May need to optimize 3D component loading
- Consider implementing proper error handling for WebGL context
- Oxy movement currently lacks proper boundary constraints
- Visual representation of Oxy needs to be defined and implemented

### Technical Decisions
- Using Next.js 15.3.2 for latest features and improvements
- Implemented client-side rendering for 3D components to avoid hydration issues
- Using TypeScript for better type safety and development experience
- Tailwind CSS for styling with proper PostCSS integration

## Tunnel Boundary Debugging and Oxy Movement Fixes (2024-03-19)

- Investigated and debugged Oxy's movement and tunnel boundary logic
- Confirmed tunnel geometry: radius 6, length 300 (z = -150 to +150)
- Updated Oxy's logic to strictly clamp to tunnel's cross-section and Z range
- Added a green debug wireframe to visualize the tunnel boundary, then removed it after confirming correct behavior
- Verified Oxy cannot escape the tunnel in any direction
- Kept Oxy as a 2D circle for now, with option to revisit visuals later

## White Flash Fix During Loading and Game Transitions (2025-05-11)

### Problem Identification
- Discovered white screen flash during game transitions, particularly when spawning the first enemy
- Issue occurred after the tunnel and Oxy were shown but before the first germ spawned
- Created jarring visual experience that affected the overall game polish

### Root Cause Analysis
- Identified multiple contributing factors:
  - Textures being loaded on-demand rather than preloaded
  - Lack of a consistent black background during transitions
  - Germ component loading textures independently of main loading system
  - Immediate enemy spawning without giving the scene time to stabilize

### Comprehensive Solution
- **Loading System Implementation**:
  - Created a global `LoadingManager` component to centralize asset loading
  - Implemented `LoadingScreen` with progress tracking and visual feedback
  - Preloaded all textures before showing the game content
  - Added fade-out transitions for smoother visual experience

- **Multiple Layers of Black Background**:
  - Added black backgrounds at document level in `_app.tsx` and `_document.tsx`
  - Added component-level black backgrounds in `Scene3D` and other components
  - Added explicit black background to Three.js Canvas using `<color attach="background" args={['#000000']} />`

- **Texture Handling Improvements**:
  - Created a global TextureLoader instance for consistency
  - Updated textures to use proper `colorSpace = THREE.SRGBColorSpace`

## YYYY-MM-DD Game Win Condition Design: Efficiency Score

### Goals
- Define a clear and engaging win condition for the game that aligns with educational objectives and promotes replayability.

### Design Discussion & Decision
- Explored several options for a win condition, including purely distance-based, time-based, and survival-based mechanics.
- **Selected Approach: "Successful Delivery & Knowledge Check" with an Efficiency Score.**
    - **Core Win Requirements:**
        1.  Player navigates Oxy to a designated "Tunnel End" (specific Z-coordinate or trigger).
        2.  Player answers a minimum number of unique questions correctly (e.g., `MinCorrectUniqueQuestions = 5`) during the run.
        3.  Player has at least one life remaining upon reaching the Tunnel End.
    - **Efficiency Score for Replayability:**
        - Upon successfully meeting the win requirements, the player will be presented with an "Efficiency Score."
        - This score will be calculated based on:
            - Time taken to complete the level (less time is better).
            - Total number of unique questions answered correctly (exceeding the minimum could be a bonus).
            - Number of lives remaining (more lives is better).
        - The score aims to encourage players to improve their performance on subsequent playthroughs.
- **Rationale:**
    - This approach balances the core gameplay loop (navigation, avoiding obstacles) with the educational goal (answering questions).
    - It provides a definitive end-point to the game session.
    - The efficiency score adds a layer of "fun" and challenge without making the primary win condition overly complex or strictly time-gated, which could detract from careful consideration of questions.
    - It leverages existing systems (lives, question tracking, tunnel structure) and requires manageable new UI for a win screen/score display.

### Next Steps (Implementation Tasks)
- Detailed implementation tasks have been added to `tasks/current_tasks.md` under "Game Completion & Scoring (Iteration 1)". These include defining the tunnel end, tracking unique correct answers, implementing the win check logic, designing the win screen/score UI, and playtesting/balancing the system.

## YYYY-MM-DD Question Image Support
Today's Date

### Goals
- Enhance the Q&A system to support optional images within questions.
- Update the question data structure, service, and UI modal to handle and display these images.

### Implementation Details
- **Data Structure (`src/types/question.types.ts`):**
    - Added an optional `image_url?: string` field to the `Question` and `LocalizedQuestion` types.
- **Question Data (`public/data/questions.json`):**
    - Updated an existing question ("q1") to include an `image_url` pointing to `"/images/questions/diaphragm.png"`.
    - The image file `diaphragm.png` was placed in `public/images/questions/`.
- **Question Service (`src/lib/questionService.ts`):**
    - Modified `getLocalizedQuestionById` to pass through the `image_url` from the base question data to the localized question object.
- **UI (`src/components/ui/QuestionModal.tsx`):**
    - Updated the `QuestionModal` component to display an `<img>` tag if `currentQuestion.image_url` is present.
    - The image is displayed above the question text.
    - The `alt` text for the image is derived from the question's topic (e.g., `currentQuestion.topic`).

### Debugging & Fixes
- **Syntax Error in `questionService.ts`:**
    - Corrected a truncation error from a previous edit that removed the closing `try...catch` block and function definition, causing an `Expected '}', got '<eof>'` error. Restored the missing code.
- **Image Not Displaying (Initial):**
    - Investigated why the image for "q1" wasn't initially visible. Deduced it was due to the random question selection logic in `Scene3D.tsx` initially picking questions without images. Confirmed working once "q1" was displayed.

### Current Status
- The Q&A system now successfully supports and displays images for questions.
- All related files have been updated and tested.

### Next Steps
- Update other documentation files.