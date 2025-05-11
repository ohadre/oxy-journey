# Oxy Journey - Current Tasks
Last Updated: 2025-05-10

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
- [x] Add collision detection with environment boundaries (initial flat plane)
  - Defined world boundaries
  - Implemented collision response
  - Added visual feedback for collisions

### Environment Setup
- [x] Create basic 3D environment (initial tunnel structure - no texture)
  - [x] Design and implement tunnel structure (CylinderGeometry, solid color)
  - [-] Add tunnel boundaries / collision (deferred - player not yet moving *in* tunnel)
  - [-] Implement tunnel collision detection (deferred)
  - [ ] Add basic lighting (restored)
  - [ ] Implement skybox (deferred)
- [ ] Implement scrolling texture for tunnel (deferred due to WebGL context issues)

### Game Mechanics
- [ ] Implement basic oxygen mechanics
- [ ] Position player (Oxy) inside the tunnel
- [ ] Implement camera follow for tunnel gameplay

### UI/UX
- [ ] Design and implement basic HUD
  - Show oxygen levels
  - Display current position
  - Add basic instructions

### Testing
- [x] Set up testing environment for React Three Fiber components
  - Configured Jest with necessary mocks
  - Added basic component tests
  - Documented R3F testing guidelines
- [ ] Add integration tests for movement and collision
- [ ] Implement end-to-end testing for basic gameplay loop

### Deployment & CI/CD
- [ ] Set up GitHub repository
  - [ ] Initialize repository with proper .gitignore
  - [ ] Set up branch protection rules
  - [ ] Configure GitHub Actions for automated testing
- [ ] Configure Vercel deployment
  - [ ] Connect GitHub repository to Vercel
  - [ ] Set up environment variables
  - [ ] Configure build settings for Next.js
  - [ ] Set up preview deployments for pull requests
- [ ] Implement deployment workflow
  - [ ] Create deployment documentation
  - [ ] Set up staging environment
  - [ ] Configure production deployment process

## Next Steps
1. Position player (Oxy) inside the tunnel entrance.
2. Implement a camera system that follows Oxy smoothly within the tunnel.
3. Adapt Oxy's movement and collision to work within the cylindrical tunnel walls.

---
This task list will be reviewed and updated at the beginning and end of each "Vibe Session."
