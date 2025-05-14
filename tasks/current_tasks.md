# Oxy Journey - Current Tasks
Last Updated: 2025-05-14 (Win Condition Designed, Vercel Fix)

## Introduction
This document tracks the actionable tasks for the "Oxy Journey" project. It's a living document that will be updated regularly as per the "Vibe Session" protocol.

## Key
- [x] Completed
- [ ] To Do
- [-] In Progress

## Phase 1: Foundation & Infrastructure Setup

### Recently Completed
- [x] **Project Initialization (Structure):**
    - [x] Initialize Git repository.
    - [x] Create the full project directory structure (as per Standardized Project Scaffolding).
- [x] **Core Documentation & AI Configuration (Initial Drafts - excluding task/session logs):**
    - [x] Populate `README.md`.
    - [x] Populate `.gitignore`.
    - [x] Populate `.cursor/rules/project_context.mdc`.
    - [x] Instantiate all AI Role .mdc files (`lead_developer_role.mdc`, `context_guardian_role.mdc`, `dev_journalist_role.mdc`, `test_assistant_role.mdc`).
    - [x] Create and populate `docs_ai/01_project_brief.md`.
    - [x] Create and populate `docs_ai/02_architecture_overview.md`.
    - [x] Create and populate `docs_ai/04_coding_conventions_and_patterns.md`.
    - [x] Initialize `src/tests/README.md`.
- [x] **Technical Setup (Project & Dependencies):**
    - [x] Initialize Next.js + TypeScript project within the `oxy-journey` root folder.
    - [x] Install core dependencies: Three.js, @react-three/fiber, @react-three/drei, Tone.js, Framer Motion, Tailwind CSS.
- [x] **Technical Setup (Verify Rendering Pipeline):**
    - [x] Create a basic, non-interactive 3D scene (e.g., display a simple cube or sphere using R3F) to ensure the rendering pipeline is fully functional.
        - Implemented basic orange cube with lighting and OrbitControls
        - Set up proper client-side rendering with dynamic imports
        - Verified 3D scene renders correctly in browser

### Priority Tasks (Next Up)
- [x] **Workflow Initialization (Remaining Documents):**
    - [x] Initialize `docs_ai/session_log.md` (create the file, ready for first "Vibe Session" entries).
    - [x] Initialize `docs_internal/progress_snapshots.md` (create the file, ready for the first snapshot after Phase 1 completion or a significant milestone).
    - [x] Initialize `docs_internal/monthly_review_2025_05.md` (create a template for the first monthly review, covering May 2025).

---

## Phase 2: Core Gameplay Loop - Iteration 1

### Character Implementation
- [x] Design/select simple visual representation for player character "Oxy"
  - Using a basic 2D circle as placeholder for initial movement testing
  - Note: Currently rendered as a 2D circle in the 3D space, which is sufficient for testing movement mechanics
- [x] Implement basic keyboard-controlled movement
  - Added WASD and arrow key controls
  - Implemented basic movement in all directions
  - Added unit tests for the Oxy component
- [x] Add collision detection with environment boundaries (initial flat plane) - *Note: Replaced by specific tunnel collision logic.*

### Environment Setup
- [x] Create basic 3D environment (initial tunnel structure - textured & animated)
  - [x] Design and implement tunnel structure (CylinderGeometry, solid color)
  - [-] Add tunnel boundaries / collision (deferred - player not yet moving *in* tunnel)
  - [-] Implement tunnel collision detection (deferred)
  - [x] Add basic lighting
  - [ ] Implement skybox (deferred)
- [ ] Implement scrolling texture for tunnel (deferred due to WebGL context issues)

### Obstacle & Collision System
- [x] Implement Germ spawning, movement, and visual rendering.
- [x] Implement Dust spawning, movement, and visual rendering.
- [x] Refactor Germ & Dust systems for centralized state management (`Scene3D`) and separation of logic (`GermManager`, `DustManager`) vs. visuals (`Germ`, `DustParticle`).
- [x] Implement collision detection between Oxy and both Germs & Dust (`CollisionManager`).
- [x] Connect collisions to player state (decrement `lives`).
- [x] Tune spawning parameters for continuous flow.

### Game Mechanics
- [ ] Implement basic oxygen mechanics (If applicable beyond lives)
- [x] Position player (Oxy) inside the tunnel
- [x] Implement camera follow for tunnel gameplay (`CameraController`)
- [-] Implement Q&A mechanic triggered on collision.
    - [x] Define Question data structure and localization support (`src/types/question.types.ts`, `public/data/questions.json`)
    - [x] Implement question loading and resolving service (`src/lib/questionService.ts`)
    - [x] Implement Q&A state management in `Scene3D.tsx` (loading, current question, answered questions)
    - [-] Implement logic in `Scene3D.tsx` to select and display a question upon collision event
    - [ ] Implement logic in `Scene3D.tsx` to handle answer from modal and update game state (e.g., hide modal, proceed game)
- [ ] Implement Game Over logic (when lives reach 0).

### Game Completion & Scoring (Iteration 1)
-   **Status:** In Progress
-   **Last Update:** May 14, 2025
-   **Goal:** Implement the agreed-upon "Efficiency Score" win condition and a basic game over/restart flow.
-   **Sub-Tasks:**
    -   ✅ `DONE` 1. Define Tunnel End & Test UI Trigger (`TUNNEL_END_Z`, `gameState = 'level_complete_debug'`, `LivesIndicator` shows end).
    -   ✅ `DONE` 2. Track Unique Correct Answers (`answeredCorrectlyIds` set, `MIN_CORRECT_UNIQUE_QUESTIONS` const).
    -   ✅ `DONE` 3. Implement Win Check Logic (`checkWinConditionsAndProceed()`, sets `gameState` to `'won'` or `'game_over'`).
    -   ✅ `DONE` 4. Implement Game Restart Logic (Reset timer, entities via re-keying, invincibility, `gameState` to `loading`).
    -   ✅ `DONE` 5. Display Win Modal with Score & Restart Option.
    -   ⏳ `PENDING USER FEEDBACK` 6. Refine/Confirm Win/Loss/Restart flow based on testing.
    -   📄 `TODO` 7. Create a basic scoring display/calculation (details TBD post-win condition implementation).
    -   📄 `TODO` 8. Add placeholder for win/game over celebratory images/sounds (assets to be provided by user).
    -   📄 `TODO` 9. Documentation update for new game mechanics.

### UI/UX
- [x] Design and implement basic HUD (`LivesIndicator`)
- [-] Design and implement Q&A modal.
    - [x] Create basic `QuestionModal.tsx` structure and props
    - [x] Implement rendering for multiple-choice, yes/no, and open-question types (basic layout)
    - [x] Integrate `QuestionModal.tsx` into `Scene3D.tsx` (visibility toggle, passing question data)
    - [x] Add image display support to `QuestionModal.tsx`
    - [ ] Style `QuestionModal.tsx` for all question types (including input fields, buttons)
    - [ ] Implement answer submission logic within `QuestionModal.tsx` (calling `onAnswer` prop)
    - [ ] Add animations (e.g., using Framer Motion) for modal appearance/disappearance

### Testing
- [x] Set up testing environment for React Three Fiber components
  - Configured Jest with necessary mocks
  - Added basic component tests
  - Documented R3F testing guidelines
- [ ] Add integration tests for movement and collision
- [ ] Implement end-to-end testing for basic gameplay loop

### Deployment & CI/CD
- [x] Set up GitHub repository
  - [ ] Initialize repository with proper .gitignore
  - [ ] Set up branch protection rules
  - [ ] Configure GitHub Actions for automated testing
- [x] Configure Vercel deployment
  - [ ] Connect GitHub repository to Vercel
  - [ ] Set up environment variables
  - [ ] Configure build settings for Next.js
  - [ ] Set up preview deployments for pull requests
- [ ] Implement deployment workflow
  - [ ] Create deployment documentation
  - [ ] Set up staging environment
  - [ ] Configure production deployment process

## Next Steps
1. Implement the "Game Win" condition and Efficiency Score system (all sub-tasks under "Game Completion & Scoring (Iteration 1)").
2. Complete any remaining styling or animation tasks for `QuestionModal.tsx` if not fully done.
3. Conduct thorough playtesting and balancing for all implemented game mechanics (Q&A, Game Over, Game Win, Scoring).

---
This task list will be reviewed and updated at the beginning and end of each "Vibe Session."

### Language & Content (Ongoing)
