# Oxy Journey (Vibe Coding Infrastructure PoC)

## 🚀 Overview

"Oxy Journey" is a 3D educational game designed for 6th-grade level students to learn about the human respiratory system. Players navigate as "Oxy" through a single level, avoiding germs and dust. Upon collision, a question related to the respiratory system appears. Correctly answering allows Oxy to maintain health, while incorrect answers result in losing a life.

This game project serves as the primary **Proof of Concept (PoC)** for developing, testing, and refining the **Vibe Coding Infrastructure**. The goal is to build this game from scratch using the Vibe Coding methodologies to validate their effectiveness for solo, AI-augmented product development.

## ✨ Core Goals

-   **Goal 1 (Infrastructure Validation):** To implement and validate all components of the Vibe Coding Infrastructure (templates, protocols, AI configurations) through the development of "Oxy Journey."
-   **Goal 2 (Process Refinement):** To identify and refine best practices for solo, AI-augmented development, specifically focusing on context management, incremental building, session resumption, and efficient AI collaboration while building a functional game.
-   **Goal 3 (Product Delivery PoC):** To develop a complete and functional single-level 3D educational game ("Oxy Journey") that includes core gameplay (navigation, collision, Q&A mechanics with varied question types - e.g., yes/no, multiple choice), and delivers on its educational premise for the respiratory system.

## STATUS

**Current Status:** PoC - Active Development (Focus: Infrastructure Setup & Component Migration)
**Last Updated:** 2024-03-19

## 🗺️ Navigating This Project (Key Context Pointers)

To understand this project in depth, please refer to the following:

-   **Project Brief & Vision:** [`./docs_ai/01_project_brief.md`](./docs_ai/01_project_brief.md)
-   **Architecture Overview (Game & Infra):** [`./docs_ai/02_architecture_overview.md`](./docs_ai/02_architecture_overview.md)
-   **Key Terms & Glossary:** [`./docs_ai/03_domain_glossary.md`](./docs_ai/03_domain_glossary.md)
-   **Coding Conventions & Patterns:** [`./docs_ai/04_coding_conventions_and_patterns.md`](./docs_ai/04_coding_conventions_and_patterns.md)
-   **Development Journal:** [`./docs/development-journal.md`](./docs/development-journal.md)
-   **Current Tasks & Priorities:** [`./tasks/current_tasks.md`](./tasks/current_tasks.md)
-   **Session Log (Recent Activity):** [`./docs_ai/session_log.md`](./docs_ai/session_log.md)

## 🛠️ Tech Stack (High Level)

-   **Core Framework & Language:**
    -   Next.js 15.3.2 (React framework for SSR/SSG, page routing)
    -   React 19.0.0 (UI library)
    -   TypeScript 5.0.0 (Static typing)
-   **3D Game Engine & Rendering:**
    -   three.js 0.176.0 (Core WebGL 3D library)
    -   @react-three/fiber 9.1.2 (React renderer for three.js)
    -   @react-three/drei 10.0.7 (Helpers and abstractions for @react-three/fiber)
-   **UI, Q&A Mechanics & Animation:**
    -   React (for 2D UI elements like Q&A, HUD)
    -   framer-motion 12.10.5 (UI animations)
    -   HTML/CSS (via React & Drei's `<Html>` for overlays)
-   **Sound Engine:**
    -   Tone.js 15.1.22 (Web Audio framework for sound effects)
-   **Styling:**
    -   Tailwind CSS (via @tailwindcss/postcss 4.0.0)
    -   PostCSS 8.4.35
    -   Autoprefixer 10.4.17
-   **Testing:**
    -   Jest 29.7.0
    -   React Testing Library 16.3.0
    -   Jest DOM 6.6.3
-   **AI Tool:** Cursor

## 🏁 Getting Started / Setup

1.  Clone the repository: `git clone [YOUR_OXY_JOURNEY_REPO_URL]`
2.  Navigate to the project directory: `cd oxy-journey`
3.  Install dependencies: `npm install`
4.  Run the development server: `npm run dev`
5.  Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔗 Key Links

-   Live Deployment: [LINK_TO_VERCEL_PREVIEW_WHEN_AVAILABLE]
-   Progress Snapshots: [`./docs_internal/progress_snapshots.md`](./docs_internal/progress_snapshots.md)
-   Vibe Coding Infrastructure Canvas: [LINK_TO_YOUR_CANVAS_DOC_IF_EXTERNAL]

## 📝 Notes for AI Assistant

-   When referencing project goals, always consult `docs_ai/01_project_brief.md`. Note the dual focus: validating the Vibe Coding Infrastructure *through* the successful development of the "Oxy Journey" game.
-   For architectural questions related to the *game concept*, see `docs_ai/02_architecture_overview.md`. 
-   The educational content should be appropriate for a 6th-grade level, focusing on the respiratory system.
-   Q&A mechanics will involve 2D UI overlays and should support various question formats (yes/no, multiple choice, etc.).
-   My current focus can usually be found in `tasks/current_tasks.md` and the latest entries in `docs_ai/session_log.md`. This will often relate to building specific game features or testing a part of the Vibe Coding Infrastructure.

---
*This README is part of the Vibe Coding Infrastructure. Last update: 2024-03-19*
