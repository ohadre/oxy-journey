# 04_coding_conventions_and_patterns.md

## 1. Introduction

This document defines the coding conventions, standards, and design patterns to be adopted for the "Oxy Journey" project. Adherence to these guidelines is essential for maintaining code quality, readability, consistency, and for effective collaboration with AI development partners (like Cursor). This document serves as the canonical source for all coding style and structure decisions.

## 2. General Principles

* **Readability:** Code should be easy to read and understand. Prioritize clarity over overly terse or complex solutions.
* **Simplicity (KISS - Keep It Simple, Stupid):** Design solutions that are as simple as possible but no simpler. Avoid unnecessary complexity.
* **DRY (Don't Repeat Yourself):** Avoid duplication of code by abstracting common logic into reusable functions, components, or hooks.
* **Consistency:** Apply chosen conventions and patterns uniformly across the entire codebase.
* **AI Collaboration:** Write code and comments in a way that is clear and unambiguous for AI understanding and generation. The AI is expected to adhere to these conventions.

## 3. File Naming Conventions

* **TypeScript Files (.ts, .tsx):** Use `PascalCase` for files that export React components (e.g., `PlayerCharacter.tsx`, `QAModal.tsx`). Use `camelCase` for non-component files like utilities, hooks, or plain TypeScript modules (e.g., `gameUtils.ts`, `useCollisionDetection.ts`).
* **Directories:** Use `kebab-case` or `camelCase` for directory names (e.g., `src/components/player-character` or `src/components/playerCharacter`). Prefer `kebab-case` for consistency with common web practices.
* **Test Files:** Suffix with `.test.ts` or `.test.tsx` (e.g., `QAModal.test.tsx`, `gameUtils.test.ts`). Place test files alongside the code they test or in a `__tests__` subdirectory.

## 4. TypeScript Specifics

* **Strict Mode:** Ensure `strict` mode is enabled in `tsconfig.json` for maximum type safety.
* **Type Definitions:**
    * Use `interface` for defining the shape of objects and props for public APIs of components and functions.
    * Use `type` for simpler types, unions, intersections, or when utility types are needed.
    * **Decision: Use `PascalCase` for props types without `I` prefix (e.g., `PlayerProps`).**
* **Explicit Types:** Use explicit types for all function parameters, return types, and variable declarations where type inference is not immediately obvious.
* **`any` Type:** Avoid using `any`. Prefer `unknown` and perform type checking, or use more specific types. If `any` is absolutely necessary, add a `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a comment explaining why.
* **Non-Null Assertion Operator (`!`):** Avoid using the non-null assertion operator. Prefer explicit null checks or type guards.
* **Enums:** Use string enums for better readability and debugging (e.g., `enum GameState { Playing = "PLAYING", Paused = "PAUSED" }`).

## 5. React & Next.js Conventions

* **Functional Components & Hooks:** Exclusively use functional components with React Hooks.
* **Component Structure:**
    1.  Props interface/type definition (e.g., `PlayerProps`).
    2.  Component function (e.g., `const Player: React.FC<PlayerProps> = (props) => { ... }`).
    3.  State declarations (`useState`).
    4.  Effect hooks (`useEffect`, `useLayoutEffect`).
    5.  Helper functions specific to the component.
    6.  Memoized values/callbacks (`useMemo`, `useCallback`).
    7.  Return JSX.
* **Props:**
    * Destructure props at the beginning of the component.
    * Clearly type all props.
    * Pass only necessary props to child components.
* **State Management:**
    * For local component state, use `useState`.
    * For simple global state relevant to the PoC (e.g., lives, current question), React Context (`useContext` and `useReducer`) is preferred. Avoid more complex state management libraries unless explicitly decided.
* **Directory Structure (within `src/`):**
    * `components/`: Reusable UI and game components.
        * `components/game/`: Specific to game elements (e.g., `Oxy.tsx`, `Germ.tsx`).
        * `components/ui/`: Generic UI elements (e.g., `Button.tsx`, `Modal.tsx`).
        * `components/layouts/`: Layout components for pages.
    * `hooks/`: Custom React hooks (e.g., `useGameLogic.ts`).
    * `pages/`: Next.js page components.
    * `styles/`: Global styles, Tailwind base/customizations (e.g., `globals.css`).
    * `lib/` or `utils/`: Utility functions, non-React specific logic.
    * `types/` or `interfaces/`: Shared TypeScript type definitions (if not co-located).
* **Next.js:**
    * Leverage Next.js features appropriately (e.g., `Image` component, routing).
    * For the PoC, API routes are likely not needed, but if they are, place them in `pages/api/`.

## 6. @react-three/fiber (R3F) & Three.js Conventions

* **Declarative Scene Graph:** Embrace the declarative nature of R3F.
* **Component-Based Entities:** Represent game objects (player, obstacles) as React components.
* **Drei Helpers:** Utilize `@react-three/drei` for common tasks (e.g., `<OrbitControls>`, `<Box>`, asset loading via `<useGLTF>`, `<Html>`).
* **3D Assets:**
    * Store 3D models (e.g., `.glb`, `.gltf`) in `public/models/`.
    * Store textures in `public/textures/`.
    * Use Drei's `useGLTF.preload()` for preloading critical assets.
* **Performance:**
    * Be mindful of draw calls and scene complexity.
    * Use `React.memo` for R3F components if props are stable and re-renders are costly.
    * Consider Drei's `<Instances>` or `<Merged>` for optimizing many similar geometries.

## 7. Tailwind CSS

* **Utility-First:** Primarily use Tailwind's utility classes directly in JSX.
* **Customization:** Configure `tailwind.config.js` for custom theme colors, fonts, spacing, etc., to match the game's design.
* **Clarity:** Group related utility classes for readability (e.g., layout, typography, colors).
* **`@apply`:** Use `@apply` in a global CSS file (e.g., `src/styles/globals.css`) sparingly for common, repeated combinations of utilities that form a distinct component style, to avoid overly long class strings in JSX.
* **Component-Scoped Styles:** For complex components where utilities become unwieldy, consider CSS Modules or styled-components as a last resort (not preferred for PoC to keep things simple).

## 8. Framer Motion (UI Animations)

* Use for all UI element animations (e.g., Q&A modal transitions, HUD feedback).
* Define animation variants for reusable animations.
* Prioritize smooth, non-jarring animations that enhance UX without being distracting.
* Be mindful of animation performance.

## 9. Tone.js (Sound Effects)

* Organize sound assets (e.g., `.mp3`, `.wav`) in `public/sounds/`.
* Create a central sound manager module/hook if interactions become complex (e.g., `useSoundManager.ts`).
* Ensure sounds provide clear feedback for game events (collision, correct/incorrect answer).

## 10. Code Formatting & Linting

* **Prettier:** Use Prettier for automatic code formatting. A `.prettierrc.js` or `.prettierrc.json` file should define the project's Prettier configuration. (Use common defaults: e.g., `tabWidth: 2`, `semi: true`, `singleQuote: true`, `trailingComma: 'es5'`).
* **ESLint:** Use ESLint for static code analysis. Configure with Next.js's default ESLint setup (`eslint-config-next`), and extend with plugins for TypeScript (`@typescript-eslint/eslint-plugin`), React (`eslint-plugin-react`, `eslint-plugin-react-hooks`), and accessibility (`eslint-plugin-jsx-a11y`).
* **IDE Integration:** Configure IDEs to format on save and display linting errors/warnings.

## 11. Comments & Documentation

* **When to Comment:**
    * Complex or non-obvious logic.
    * Workarounds or compromises.
    * Important decisions or justifications.
* **JSDoc/TSDoc:** Use TSDoc for documenting functions, components, props, and types. This is especially important for AI understanding.
    ```typescript
    /**
     * Represents the player character in the game.
     * @param {PlayerProps} props - The props for the Player component.
     * @returns {JSX.Element} The rendered player component.
     */
    ```
* **TODO/FIXME:** Use standard `// TODO:` and `// FIXME:` comments to mark areas needing future attention. Include a brief description.

## 12. Testing Conventions

* Reference `src/tests/README.md` for the "Testability First" principle.
* **Frameworks:** Use Jest as the test runner and React Testing Library for component testing.
* **Types of Tests (PoC Focus):**
    * **Unit Tests:** For utility functions, hooks, and core logic.
    * **Component Tests:** For React components, testing rendering, interactions, and state changes.
* **Location:** Test files should be co-located with the source files they test, or in a `__tests__` subdirectory.
* **Naming:** `*.test.tsx` or `*.test.ts`.
* **Descriptive Tests:** Test descriptions should clearly state what is being tested.

## 13. Git & Version Control

* **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat: implement player movement`, `fix: correct Q&A scoring logic`, `docs: update coding conventions`). This is crucial for changelog generation and clear history.
* **Branching Strategy:**
    * `main`: Production-ready code (or PoC deliverable).
    * `develop`: Current development integration branch (optional for solo dev, `main` can be used).
    * Feature branches: `feat/feature-name` (e.g., `feat/player-controller`, `feat/qa-modal`).
    * Bugfix branches: `fix/bug-name` (e.g., `fix/collision-bug`).
* **Commits:** Make frequent, small, atomic commits as per the Vibe Session Protocol. Each commit should represent a logical unit of work.
* **Pull Requests (PRs):** Even for solo development, consider using PRs from feature branches to `main` for a structured review point (even if self-reviewed).

## 14. AI Collaboration Specifics

* **Clarity in Prompts:** Provide clear, specific, and well-scoped instructions to the AI. Reference this document when requesting code generation or modification.
* **Iterative Refinement:** Expect to review and refine AI-generated code to ensure it meets these conventions and project requirements.
* **Feedback Loop:** If AI generates code that deviates, provide feedback by referencing specific conventions from this document.
* **Contextual Awareness:** The AI should be configured (via `.cursor/rules/`) to be aware of this document and apply its guidelines.
* **Targeted Bug Fixes & Minimal Changes:**
    * When assigning bug-fixing tasks to the AI, explicitly request minimal, localized changes. For example, state: "Fix this bug by only modifying function X" or "Correct the logic in this specific line without refactoring the surrounding component."
    * Carefully review AI-generated solutions for bug fixes to ensure they are targeted and do not introduce regressions or unintended side effects due to unnecessarily broad refactoring.
    * If the AI proposes extensive changes for a minor bug, instruct it to attempt a more constrained solution first, or ask for a clear justification if it believes a larger change is truly necessary.
    * The AI should be guided to prefer the smallest effective change when addressing specific issues, unless a broader refactor is explicitly requested and justified.

* **Task Definition & Breakdown (NEW):**
    * Before starting implementation, the AI must confirm its understanding of the current, overarching objective for the task or feature.
    * The AI should assist in or propose breaking down tasks into granular steps. Each step should aim to be independently verifiable, preferably through changes observable in the UI by the human product manager.
    * For any proposed task or sub-task, the AI should briefly state how its completion can be tested or verified through the UI.

* **High-Level Planning for Major Components (NEW):**
    * Unless explicitly working on a small bug fix, if tasked with adding a new major component or significant feature, the AI should first propose a brief, high-level plan. This plan should outline the main parts to be built and the general approach, ensuring alignment before detailed coding begins.

* **Post-Change Self-Review (NEW):**
    * After any code modifications are applied (e.g., after an `edit_file` operation), the AI should mentally (or by re-reading the diff/file if necessary) review the changes to ensure they align with the request, adhere to conventions, and don't have obvious errors.

* **Preventing Regressions (NEW):**
    * A primary goal during any change (bug fixes or feature additions) is to avoid negatively impacting existing functionality. The AI should actively consider potential side effects of its changes on other parts of the application. If a proposed change carries a risk of regression, this risk should be noted.

* **Debugging Conditionally Rendered/Dynamic Component Styling (NEW):**
    * When styles (especially utility-class based, like Tailwind CSS) do not appear to apply correctly to conditionally rendered or dynamically added UI components, the AI should guide the user through or perform the following checks:
        1.  **Confirm State/Condition:** Verify via console logs or debugging that the state variable controlling the component's rendering is changing as expected.
        2.  **Unconditional Render Test:** Temporarily render the component unconditionally to see if it appears at all.
        3.  **Style Simplification Test:** If it renders unconditionally but without correct styling, simplify the component's styling to basic, non-conflicting properties (e.g., a solid background color, fixed dimensions, high z-index using inline styles or minimal utility classes) to confirm if *any* styling is possible.
        4.  **Tailwind Configuration (`tailwind.config.js`):** Ensure the `content` array in `tailwind.config.js` correctly includes the path to the component file, enabling Tailwind's JIT compiler to scan it.
        5.  **Global CSS Import:** Verify that the main CSS file containing `@tailwind base; @tailwind components; @tailwind utilities;` is correctly imported in the project's entry point (e.g., `_app.tsx` or `layout.tsx`).
        6.  **Browser Inspector:** Guide the user to use the browser's element inspector to check if the component's HTML element is present in the DOM, what CSS classes are attached, and which specific styles are being applied or overridden (look for struck-through styles).
        7.  **CSS Specificity/Cascade:** Consider potential conflicts with more specific global CSS rules that might be overriding the utility classes.

## 15. Windows/PowerShell Command Chaining
- When running terminal commands on Windows/PowerShell, do **not** use `&&` to chain commands. Run each command separately, one at a time, to avoid errors.

This document is a living document and may be updated as the project evolves and new patterns or decisions emerge.