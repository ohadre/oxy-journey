# 02_architecture_overview.md
## 1. Introduction

This document outlines the architecture for the "Oxy Journey" project. It is divided into two main parts:
1.  The architecture of the **"Oxy Journey" educational game** itself, covering its conceptual design, user experience, and technical implementation.
2.  The architecture and application of the **"Vibe Coding Infrastructure"** used to develop this project, detailing its components, workflows, and how it facilitates AI-augmented solo development.

The goal is to provide a clear overview for both understanding the game's structure and guiding its development using the Vibe Coding methodology.

## 2. "Oxy Journey" Game Architecture

### 2.1. Conceptual Architecture & Gameplay

"Oxy Journey" is a 3D educational game designed for 6th-grade students (ages 11-12) to learn about the human respiratory system.

* **Player Experience:** Players control "Oxy," a character representing an oxygen molecule, navigating a stylized 3D representation of a part of the human respiratory system.
* **Core Loop:**
    1.  **Navigate:** Player guides Oxy through a single 3D level.
    2.  **Avoid Obstacles:** Player must avoid "germs" and "dust" particles.
    3.  **Collision & Q&A:** Upon collision with an obstacle, a question related to the respiratory system appears in a modal.
    4.  **Consequence:**
        * Correct Answer: Oxy maintains health, gameplay continues.
        * Incorrect Answer: Oxy loses a life. The game ends if all lives are lost.
* **Educational Goal:** To reinforce learning about the parts and functions of the respiratory system through interactive engagement and Q&A.
* **Game Scope (PoC):**
    * Single, continuous 3D level.
    * Core gameplay loop implemented.
    * Varied Q&A types (Yes/No, Multiple Choice).
    * Basic UI (HUD for lives, Q&A modal).
    * Basic sound effects for key interactions.

### 2.2. Technical Architecture

The game will be developed as a web application using the following stack:

* **Frontend Framework:** Next.js (with React and TypeScript)
    * Manages the overall application structure, routing (if needed beyond a single page), and component-based UI.
    * TypeScript for type safety and better developer experience.
* **3D Rendering Engine:** Three.js
    * The core library for creating and rendering the 3D game world, characters, and objects.
* **React Renderer for Three.js:** @react-three/fiber (R3F)
    * Allows declarative creation of Three.js scenes using React components, making it easier to manage complex 3D environments within the React ecosystem.
* **R3F Helpers:** @react-three/drei
    * Provides pre-built helpers, abstractions, and components for common 3D tasks (e.g., camera controls, UI embedding, loaders).
* **UI & Game Overlay:** React Components (styled with Tailwind CSS)
    * The HUD (Heads-Up Display for lives, etc.) and the Q&A modal will be built using React components.
    * `@react-three/drei`'s `<Html>` component might be used to embed these React UIs within the 3D scene or as overlays.
* **Animations:**
    * **3D Animations:** Handled by Three.js / R3F for character/object movements.
    * **UI Animations:** Framer Motion for smooth transitions and effects in the 2D UI elements (Q&A modal, HUD feedback).
* **Sound:** Tone.js
    * For implementing basic sound effects (collision, correct/incorrect answer, background ambience if any).
* **Styling:** Tailwind CSS
    * For utility-first styling of all 2D UI components.

### 2.3. Key Game Modules & Components (Final Implementation)

*   **State Management (`Scene3D.tsx`):**
    *   Central hub for core gameplay state using `useState`.
    *   Manages `oxyPosition`: Player's current `[x, y, z]` coordinates.
    *   Manages `germs`: An array of `GermInstance` objects, each containing `id`, `position`, `size`, `speed`, `target`, `timeAlive`, and `maxLifetime`.
    *   Provides callbacks (`handleOxyPositionChange`, `handleGermsChange`, `handleCollision`) passed down to child components for state updates.

*   **Player (`Oxy.tsx`):**
    *   Renders Oxy's 3D model.
    *   Handles player movement based on keyboard input (`useKeyboardControls`).
    *   Clamps Oxy's position within tunnel boundaries.
    *   Calls `handleOxyPositionChange` when position updates.

*   **Germ Logic (`GermManager.tsx`):**
    *   **Function:** Manages the lifecycle and movement of all active germs. Does *not* render visually (`return null`).
    *   **Inputs:** Takes the current `germs` array and the `onGermsChange` callback from `Scene3D`.
    *   **Frame Update (`useFrame`):**
        *   Calculates the next `position` for each germ based on its `speed` and `delta` time, moving towards its `target` Z coordinate. Movement logic ensures germs move smoothly to the target without overshooting, even with variable frame times.
        *   Increments `timeAlive` for each germ.
        *   Filters the `germs` array, removing any germ where `position.z >= OUT_OF_BOUNDS_Z` (160) or `timeAlive >= maxLifetime` (240-300s).
        *   Checks if new germs can be spawned (`currentGerms.length < MAX_GERMS` and `spawnTimer >= SPAWN_INTERVAL`).
        *   Spawns new germs at `SPAWN_Z` (-140) with random properties (speed, size, lifetime, target) when conditions are met.
        *   Calls `onGermsChange` with the final, updated list of germs (moved, filtered, newly spawned).
    *   **Tuned Parameters:**
        *   `MAX_GERMS`: 20
        *   `SPAWN_INTERVAL`: 1.5 seconds
        *   `randomSpeed`: 40-60 units/sec
        *   `randomLifetime`: 240-300 seconds

*   **Germ Visuals (`Germ.tsx`):**
    *   **Function:** Purely visual component responsible for rendering a single germ.
    *   **Inputs:** Takes `position` and `size` props from `Scene3D`'s mapping of the `germs` state.
    *   **Rendering:** Renders a textured `planeGeometry` mesh at the specified `position`.
    *   **Orientation:** Uses `useFrame` to make the mesh `lookAt(camera.position)`, ensuring it always faces the player.

*   **Collision Logic (`CollisionManager.tsx`):**
    *   **Function:** Checks for collisions between Oxy and Germs each frame. Does *not* render visually (`return null`).
    *   **Inputs:** Takes `oxyPosition`, `germs` array, and `onCollision` callback from `Scene3D`.
    *   **Frame Update (`useFrame`):**
        *   Iterates through the `germs` array.
        *   Calculates the Euclidean distance between `oxyPosition` and each `germ.position`.
        *   Calculates the combined radii (`oxyRadius` (0.5) + `germRadius` (`germ.size * 0.5`)).
        *   **Collision Condition:** If `distance < combinedRadius`, a collision is detected.
        *   Calls `onCollision(collidedGerm.id)` upon detection.
        *   Implements a `collisionCooldown` (500ms) using `useRef` to prevent multiple triggers from a single impact.

*   **Scene Rendering & Flow (`Scene3D.tsx` continued):**
    *   Renders the main `Canvas`, `Oxy`, `Tunnel`, `DustManager`, `GermManager`, and `CollisionManager`.
    *   Maps the `germs` state array to render active `<Germ>` components, passing the necessary props (`key`, `position`, `size`).
    *   The `handleCollision` callback filters the germ with the matching `germId` from the `germs` state array, causing it to be removed visually on the next render.

* **Q&A System (`QASystem`, `QuestionModal`):** (Conceptual - Implementation Pending)
    * Stores and retrieves questions.
    * Displays the Q&A modal upon collision (triggered via `handleCollision`).
    * Processes answers and communicates outcomes.

* **UI System (`HUD`, `UImanager`, `LivesIndicator`):** (Partially Implemented)
    * Renders the Heads-Up Display (`LivesIndicator` exists).
    * Manages the presentation of the Q&A modal (Implementation Pending).

* **Loading System (`LoadingManager`, `LoadingScreen`):** (Implemented)
    * Centralizes asset preloading (textures).
    * Provides visual progress feedback and smooth transition.
    * Uses React Context (`useLoading`) to gate rendering of components like `GermManager` until loading is complete.

* **Tunnel System (`Tunnel`):** (Implemented)
    * Renders the animated tunnel environment.

* **Camera Controller (`CameraController`):** (Implemented)
    * Manages the camera's position and follows Oxy.

* **Dust Particles (`DustManager`):** (Implemented)
    * Manages the visual dust particles in the environment.

## 3. "Vibe Coding Infrastructure" Architecture & Application

The "Vibe Coding Infrastructure" is a methodology and set of organizational templates designed to optimize solo product development where an AI (Cursor) acts as the lead developer and the human acts as a Product Manager/Decision-Maker.

### 3.1. Core Principles

* **AI as Lead Developer:** Leveraging AI for primary coding, refactoring, and boilerplate generation.
* **Human as PM/Orchestrator:** Focusing on high-level strategy, requirements, decision-making, and review.
* **Structured Context Management:** Ensuring the AI has consistent and comprehensive access to project information.
* **Streamlined Workflows:** Implementing efficient, repeatable processes for development tasks.
* **Rapid Incremental Building:** Facilitating quick iterations and feedback loops.

### 3.2. Directory Structure & Key Documents

The project follows a standardized directory structure:

* `project-root/`
    * `.cursor/rules/`: Contains `.mdc` files for AI configuration and role definitions.
        * `project_context.mdc`: Global AI settings, always applied.
        * Role-specific files (e.g., `lead_developer_role.mdc`, `context_guardian_role.mdc`, `dev_journalist_role.mdc`, `test_assistant_role.mdc`): Define focused AI behaviors.
    * `docs_ai/`: Stores long-term AI context documents.
        * `01_project_brief.md`: Vision, goals, audience, scope, success metrics.
        * `02_architecture_overview.md`: This document.
        * `03_domain_glossary.md`: Key terms and definitions.
        * `04_coding_conventions_and_patterns.md`: Standards for code style, patterns, etc.
        * `session_log.md`: Chronological log of all "Vibe Sessions."
    * `docs_internal/`: For the human PM's private notes and reviews.
        * `progress_snapshots.md`: High-level tracking of milestones.
        * `monthly_review_YYYY_MM.md`: Structured reflection on project and infrastructure.
    * `src/`: Contains all game source code (Next.js app, components, game logic).
        * `src/tests/`: Contains tests, with a `README.md` emphasizing "Testability First."
    * `tasks/`:
        * `current_tasks.md`: Actionable task list (Priority, Next Steps, Backlog).
    * `README.md`, `.gitignore`, etc.: Standard project files.

### 3.3. AI Roles and Configuration

* **`project_context.mdc`:** Provides global, persistent context to the AI, referencing key `docs_ai/` files.
* **Role-Specific `.mdc` Files:** Allow invoking specialized AI behaviors:
    * `lead_developer_role.mdc`: For generating code, implementing features.
    * `context_guardian_role.mdc`: For ensuring consistency and adherence to defined architecture/conventions.
    * `dev_journalist_role.mdc`: For assisting with documentation and session logging.
    * `test_assistant_role.mdc`: For generating test ideas and boilerplate.

### 3.4. Development Workflow: "Vibe Session" Protocol

Development is structured around "Vibe Sessions":
1.  **Intent:** Clearly define the goal for the session based on `current_tasks.md`.
2.  **AI Briefing:** Provide the AI with the intent, relevant context, and specific instructions. Select appropriate AI role(s) if needed.
3.  **Work:** Collaborative or AI-led execution of the task (coding, writing docs, etc.).
4.  **Micro-Log & Commit:** Briefly document the session's work and outcomes in `session_log.md` and commit changes to Git with descriptive messages.

This protocol ensures focused work, clear AI guidance, and continuous documentation.

## 4. Interrelation: Vibe Coding Infrastructure & "Oxy Journey" Development

The Vibe Coding Infrastructure directly supports the efficient development of "Oxy Journey" by:

* **Maintaining Context:** The `docs_ai/` directory and `.mdc` files ensure the AI consistently understands the game's goals, architecture, and constraints.
* **Streamlining AI Collaboration:** Defined roles and the Vibe Session protocol make interactions with the AI more predictable and productive.
* **Accelerating Development:** The AI handles much of the boilerplate and detailed coding, allowing the human PM to focus on higher-level tasks and rapid iteration.
* **Ensuring Consistency:** The Context Guardian role and documented conventions help maintain code quality and architectural integrity.
* **Facilitating Observability & Review:** Documents like `session_log.md`, `progress_snapshots.md`, and `monthly_review_YYYY_MM.md` enable tracking and reflection on both the project and the infrastructure's effectiveness.

The successful implementation of "Oxy Journey" will serve as a validation of the Vibe Coding Infrastructure's efficacy for solo, AI-augmented development.