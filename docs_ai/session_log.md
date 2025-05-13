# Oxy Journey - Session Log

## Overview
This document tracks all "Vibe Sessions" for the Oxy Journey project, maintaining context and progress between development sessions.

--- 

## 2024-03-19 Oxy Movement and Visual Representation Planning

- **Movement Constraints:**
  - Identified need for proper boundary constraints within tunnel
  - Current implementation allows Oxy to move outside tunnel boundaries
  - Planning collision detection system with tunnel walls
  - Considering smooth movement restrictions and visual feedback

- **Visual Representation:**
  - Evaluating options for Oxy's visual design:
    - Particle system (representing oxygen molecules)
    - 3D model (character-based approach)
    - Stylized shape (simple but effective)
  - Need to ensure visibility against tunnel background
  - Planning movement animations and effects

- **Next Actions:**
  - Implement collision detection system
  - Design and prototype Oxy's visual representation
  - Add movement constraints and feedback
  - Test and refine movement mechanics

---

## 2024-03-19 Project Migration and Infrastructure Setup

- **Project Structure:**
  - Migrated codebase from `next-app` directory to root folder
  - Established proper Next.js project structure with `src` directory
  - Set up essential configuration files (next.config.ts, tsconfig.json, etc.)

- **Dependencies and Configuration:**
  - Updated package.json with correct dependencies
  - Configured Tailwind CSS with proper PostCSS integration
  - Added necessary type definitions for Next.js and TypeScript
  - Set up testing environment with Jest and React Testing Library

- **Component Migration:**
  - Successfully moved all components to `src/components`
  - Implemented proper client-side rendering for 3D components
  - Fixed TypeScript errors in components
  - Resolved hydration issues with dynamic imports

- **Recent Fixes:**
  - Resolved `TypeError` in `Oxy.tsx` related to `getKeys` function
  - Fixed Tailwind CSS configuration issues
  - Updated PostCSS configuration to use `@tailwindcss/postcss`
  - Implemented proper type definitions for Next.js

- **Next Steps:**
  - Complete testing suite implementation
  - Add documentation for component usage
  - Implement remaining features
  - Optimize performance
  - Add error boundaries and logging

---

## 2024-06-10 Tunnel Visual & Technical Enhancements

- **Tunnel texture:** Applied seamless custom texture (`tunnel_tile.png`) to the tunnel interior using Three.js CylinderGeometry and meshStandardMaterial.
- **Texture tiling:** Set repeat to (4, 2) for a natural, non-stretched look.
- **Texture animation:** Animated the texture's offset (offset.y) each frame to simulate forward movement through the tunnel (`useFrame` with `texture.offset.y += delta * 0.2`).
- **Lighting:** Added a warm directional light at the tunnel entrance (`#ffd9a0`), a cool rim light at the exit (`#a0c8ff`), and ambient light for depth and realism.
- **Parameters:** All key parameters (radius, height, tiling, animation speed, light colors/intensities) are now easily adjustable for further tuning.
- **Result:** Tunnel is now immersive, dynamic, and visually clear, ready for further gameplay and visual enhancements.

## 2024-03-19 Tunnel Boundary Debugging and Oxy Movement Fixes

- Debugged Oxy's movement and tunnel boundary logic
- Confirmed tunnel geometry: radius 6, length 300 (z = -150 to +150)
- Updated Oxy's logic to strictly clamp to tunnel's cross-section and Z range
- Added a green debug wireframe for visual alignment, then removed it after confirming correct behavior
- Verified Oxy cannot escape the tunnel in any direction
- Kept Oxy as a 2D circle for now

## 2024-06-10 GitHub & Branch Protection Setup

- **Repository Setup:**
  - Initialized GitHub repository and pushed all project files.
  - Created `.gitignore` and committed initial codebase.
  - Switched default branch from `master` to `main` for modern best practices.
- **GitHub Actions:**
  - Added a workflow for automated testing on push and PR to `main`.
  - Triggered workflow with a dummy commit to register status checks.
- **Branch Protection:**
  - Configured branch protection rule for `main`.
  - Required status checks to pass before merging.
  - Required branches to be up to date before merging.
  - Confirmed rule is active and targets the correct branch.

---

## 2024-03-19 GitHub Actions Workflow Trigger

- **Triggered GitHub Actions Workflow:**
  - Executed `git push` command to trigger the GitHub Actions workflow for status check registration.

## 2024-06-10 Oxy Character Visual & Movement Update

- **Oxy Visual Update:**
  - Replaced placeholder circle with a sprite using `oxy.png` image (located in `public/textures/`).
  - Ensured Oxy always faces the camera for clarity.
- **Movement Fix:**
  - Updated movement logic to use the correct mesh reference (`meshRef.current`), restoring keyboard controls.
  - Confirmed Oxy moves as expected in the tunnel.
- **Next:**
  - Proceeding to Vercel deployment and integration.

## 2024-06-11 Vercel Deployment Success & Asset Fix

- **Vercel Deployment:**
  - Successfully deployed the Oxy Journey app to Vercel from the main branch.
  - Confirmed that Vercel builds and deploys automatically on push to main.
- **Static Asset Fix:**
  - Resolved 404 error for Oxy character image by staging, committing, and pushing `public/textures/oxy.png`.
  - Verified that Oxy now appears correctly in the deployed app.
- **Branch Protection & Workflow:**
  - Temporarily removed required status checks and PR requirements to unblock solo dev workflow and deployment.
  - Direct pushes to main are now allowed for rapid iteration.

## 2025-05-10 Tunnel Visual & Technical Enhancements

- **Tunnel texture:** Applied seamless custom texture (`tunnel_tile.png`) to the tunnel interior using Three.js CylinderGeometry and meshStandardMaterial.
- **Texture tiling:** Set repeat to (4, 2) for a natural, non-stretched look.
- **Texture animation:** Animated the texture's offset (offset.y) each frame to simulate forward movement through the tunnel (`useFrame` with `texture.offset.y += delta * 0.2`).
- **Lighting:** Added a warm directional light at the tunnel entrance (`#ffd9a0`), a cool rim light at the exit (`#a0c8ff`), and ambient light for depth and realism.
- **Parameters:** All key parameters (radius, height, tiling, animation speed, light colors/intensities) are now easily adjustable for further tuning.
- **Result:** Tunnel is now immersive, dynamic, and visually clear, ready for further gameplay and visual enhancements.

## 2025-05-10 GitHub & Branch Protection Setup

- **Repository Setup:**
  - Initialized GitHub repository and pushed all project files.
  - Created `.gitignore` and committed initial codebase.
  - Switched default branch from `master` to `main` for modern best practices.
- **GitHub Actions:**
  - Added a workflow for automated testing on push and PR to `main`.
  - Triggered workflow with a dummy commit to register status checks.
- **Branch Protection:**
  - Configured branch protection rule for `main`.
  - Required status checks to pass before merging.
  - Required branches to be up to date before merging.
  - Confirmed rule is active and targets the correct branch.

## 2025-05-10 Oxy Character Visual & Movement Update

- **Oxy Visual Update:**
  - Replaced placeholder circle with a sprite using `oxy.png` image (located in `public/textures/`).
  - Ensured Oxy always faces the camera for clarity.
- **Movement Fix:**
  - Updated movement logic to use the correct mesh reference (`meshRef.current`), restoring keyboard controls.
  - Confirmed Oxy moves as expected in the tunnel.
- **Next:**
  - Proceeding to Vercel deployment and integration.

## 2025-05-11 Vercel Deployment Success & Asset Fix

- **Vercel Deployment:**
  - Successfully deployed the Oxy Journey app to Vercel from the main branch.
  - Confirmed that Vercel builds and deploys automatically on push to main.
- **Static Asset Fix:**
  - Resolved 404 error for Oxy character image by staging, committing, and pushing `public/textures/oxy.png`.
  - Verified that Oxy now appears correctly in the deployed app.
- **Branch Protection & Workflow:**
  - Temporarily removed required status checks and PR requirements to unblock solo dev workflow and deployment.
  - Direct pushes to main are now allowed for rapid iteration.

## 2025-05-11 Oxy Movement Clamping & Deployment

- **Oxy Movement Update:**
  - Adjusted Z-clamping logic so Oxy can move closer to the camera (2 unit buffer), improving player freedom while keeping Oxy visible.
- **Deployment:**
  - Successfully pushed and deployed the latest changes to Vercel.
  - Confirmed live deployment is working as expected.

## 2025-05-11 White Flash Fix and Loading System Implementation

- **Problem Identification:**
  - Discovered white flashes during game transitions, particularly when spawning the first enemy.
  - Issue occurred after the tunnel and Oxy were shown but before the first germ spawned.
  - Created jarring visual experience that affected the overall game polish.

- **Loading System Implementation:**
  - Created a global `LoadingManager` component to centralize asset loading.
  - Implemented `LoadingScreen` with progress tracking and visual feedback.
  - Added fade-out transitions for smoother visual experience.
  - Preloaded all textures before showing the game content.

- **Multiple Layers of Black Background:**
  - Added black backgrounds at document level in `_app.tsx` and `_document.tsx`.
  - Added component-level black backgrounds in `Scene3D` and other components.
  - Added explicit black background to Three.js Canvas.

- **Germ and Enemy Improvements:**
  - Updated `Germ.tsx` to use preloaded textures instead of on-demand loading.
  - Added delayed spawning in `GermManager.tsx` to ensure scene stability.
  - Improved error handling for texture loading failures.

- **Deployment Consolidation:**
  - Consolidated multiple Vercel projects to a single deployment.
  - Cleaned up deployment pipeline for better maintainability.
  - Successfully deployed and verified the fix in production.

## 2024-06-11 Entity System & Collision Refactor

- **Goal:** Implement robust collision detection and refactor entity (Germs, Dust) management for better state control, separation of concerns, and continuous gameplay flow.

- **Key Changes & Implementations:**
    - **State Centralization (`Scene3D.tsx`):**
        - Managed `germs`, `dustParticles`, and `lives` state.
        - Implemented `handleGermsChange`, `handleDustChange`, `handleCollision` callbacks.
    - **Logic-Only Managers (`GermManager.tsx`, `DustManager.tsx`):
        - Refactored to handle all entity logic (movement, spawning, filtering based on lifetime/bounds) without direct rendering.
        - Adjusted movement algorithms to prevent visual snapping and ensure smooth progression.
        - Tuned spawning parameters (`MAX_GERMS`, `MAX_DUST`, `SPAWN_INTERVAL`, speeds, lifetimes) after multiple iterations to achieve a continuous flow of entities.
    - **Visual Components (`Germ.tsx`, `DustParticle.tsx`):
        - `Germ.tsx` updated to be purely visual.
        - New `DustParticle.tsx` created for rendering dust as textured, camera-facing planes.
    - **Collision System (`CollisionManager.tsx`):
        - Now checks for collisions between Oxy and both Germ and Dust entities.
        - Uses simple radius-based overlap detection.
        - Reports collision type (`'germ'` or `'dust'`) and entity `id` to `Scene3D`.
        - `handleCollision` in `Scene3D` updated to decrement `lives` and remove the correct entity from state.
    - **UI (`LivesIndicator.tsx`):
        - Connected to `lives` state in `Scene3D` to accurately reflect player health.

- **Debugging & Iteration:**
    - Addressed initial visual bugs where entities would snap to their target Z position.
    - Iteratively tuned entity spawning limits and rates to ensure a consistent presence of obstacles.
    - Resolved build errors related to prop mismatches and duplicate component instantiations.

- **Outcome:**
    - Core entity management and collision detection systems are now robust and data-driven.
    - Player lives are correctly impacted by collisions.
    - The game provides a more continuous and predictable challenge regarding obstacles.
    - Architecture documentation (`02_architecture_overview.md`) updated to reflect these changes.

## 2025-05-12 Q&A System - Initial Setup & Localization

- **Goal:** Begin implementation of the Q&A system, focusing on data structure, localization, and initial fetching.
- **Key Decisions & Refinements:**
    - Questions will be stored in `public/data/questions.json`.
    - Added support for English ('en') and Hebrew ('he') localization directly within the JSON structure and TypeScript types.
    - `QuestionType` now includes 'open-question'.
    - Question `topic` field added.
    - "Correctly answered" status will reset per game. If all unique questions are answered, they will repeat.
    - For PoC, open questions will just accept input; AI review is a future feature.
- **Implementation Steps:**
    - Created `src/types/question.types.ts` with `LanguageCode`, `LocalizedText`, `LocalizedAnswerOption`, `Question`, and `DisplayQuestion` interfaces to support multilingual questions.
    - Updated `public/data/questions.json` with a new structure supporting `LocalizedText` for `text`, `options.text`, and `explanation`. Populated sample questions with English and placeholder Hebrew.
    - Created `src/lib/questionService.ts` with:
        - `fetchAndResolveQuestions(lang: LanguageCode)` function to fetch JSON data, resolve localized strings to the target language, and handle mixed old/new question formats gracefully.
        - Helper functions `resolveText` and `resolveOptions`.
    - Created a temporary test page `src/pages/question-test.tsx` to visually verify the `questionService` functionality for both English and Hebrew.
        - Fetched and displayed lists of questions in both languages.
        - Resolved a styling issue (black text on black background) on the test page by adding a local text color style.
- **Outcome:**
    - Core data structures for multilingual Q&A are in place.
    - Question fetching and language resolution service is functional.
    - Test page confirms service behavior.
- **Next Steps:**
    - Integrate `questionService` into `Scene3D.tsx` for game state management.
    - Develop the `QuestionModal.tsx` UI component.
    - Implement Q&A trigger on collision and answer processing logic.
    - Update `tasks/current_tasks.md` with detailed sub-tasks for the Q&A system.

---