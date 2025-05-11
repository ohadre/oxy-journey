# Oxy Journey - Project Brief

## 1. Project Vision & Mission Statement

Our vision for "Oxy Journey" is twofold:
1.  To create an engaging and effective 3D educational game that makes learning about the human respiratory system fun and accessible for 6th-grade students.
2.  To serve as a robust Proof of Concept (PoC) for the Vibe Coding Infrastructure, demonstrating and refining a highly efficient methodology for solo, AI-augmented product development.

The mission is to successfully develop "Oxy Journey" as a functional, single-level game, thereby validating the principles, templates, and AI collaboration strategies of the Vibe Coding Infrastructure.

## 2. Core Goals

-   **Goal 1 (Infrastructure Validation):** To implement and validate all components of the Vibe Coding Infrastructure (templates, protocols, AI configurations) through the development of "Oxy Journey."
-   **Goal 2 (Process Refinement):** To identify and refine best practices for solo, AI-augmented development, specifically focusing on context management, incremental building, session resumption, and efficient AI collaboration while building a functional game.
-   **Goal 3 (Product Delivery PoC):** To develop a complete and functional single-level 3D educational game ("Oxy Journey") that includes core gameplay (navigation, collision, Q&A mechanics with varied question types - e.g., yes/no, multiple choice), and delivers on its educational premise for the respiratory system.

## 3. Target Audience

The primary users of the "Oxy Journey" game are:
-   **6th-grade students** (approximately ages 11-12).
-   Students learning about basic human biology, with a specific focus on the **human respiratory system**.
The game should be engaging, intuitive, and age-appropriate in its language, visual presentation, and complexity of questions.

## 4. Scope of "Oxy Journey" Game (PoC)

**In Scope:**
-   A single, navigable 3D level representing a stylized part of the respiratory system.
-   A player character, "Oxy," with basic keyboard-controlled movement.
-   Obstacles representing "germs" and "dust" that Oxy must avoid.
-   Collision detection between Oxy and obstacles.
-   A Question & Answer (Q&A) mechanic triggered by collisions:
    -   Questions focused on the respiratory system, appropriate for 6th-grade level.
    -   Support for varied question types (e.g., Yes/No, Multiple Choice).
    -   A 2D UI overlay for displaying questions and answer options.
-   A basic health/lives system, affected by Q&A outcomes.
-   Simple UI elements for displaying score/lives (HUD).
-   Basic sound effects (e.g., for collision, correct/incorrect answers) using Tone.js.
-   Development using the Vibe Coding Infrastructure and the specified tech stack (Next.js, React, TypeScript, Three.js, @react-three/fiber, @react-three/drei, framer-motion, Tailwind CSS).

**Out of Scope (for this PoC):**
-   Multiple levels or complex level progression.
-   Advanced AI for germs/dust (simple behaviors are sufficient).
-   Complex scoring systems, leaderboards, or achievements beyond basic feedback.
-   Player character customization.
-   User accounts or persistent progress saving across multiple sessions (unless specifically identified as a test for an infrastructure component).
-   Advanced visual effects or highly detailed 3D models (simple, clear representations are prioritized).

## 5. Key Success Metrics (for PoC)

-   **Game Functionality:**
    -   Successful implementation and playability of the core gameplay loop: navigate Oxy, collide with an obstacle, trigger a Q&A, answer the question, and see the health/life consequence.
    -   All planned Q&A types are functional.
-   **Educational Objective:**
    -   The game presents accurate information about the respiratory system in an age-appropriate manner.
    -   (Optional) Qualitative feedback from a sample 6th grader (if feasible) indicating engagement and understanding.
-   **Infrastructure Validation & Refinement:**
    -   All Vibe Coding Infrastructure templates (README, `.mdc` rules, logs, task lists, review docs) are actively and consistently used throughout the project.
    -   The defined AI roles and collaboration strategies are effectively utilized.
    -   The "Vibe Session" protocol is followed, and `session_log.md` demonstrates clear context handoff.
    -   `monthly_review_YYYY_MM.md` and `progress_snapshots.md` show evidence of iterative improvement in both the game and the infrastructure.
    -   Qualitative assessment of development efficiency, ease of context management, and effectiveness of AI collaboration using the infrastructure.
-   **Project Completion:**
    -   Delivery of the functional single-level "Oxy Journey" game PoC within a reasonable timeframe - 4 days

---
*Document Version: 1.0 (Initial Draft for Oxy Journey)*
*Last Updated: 2025-05-09*
