# Q&A Module Design (Oxy Journey)

## 1. Overview

This document outlines the design for the Question & Answer (Q&A) module in the "Oxy Journey" game. This module pauses the game upon collision with obstacles (Germs, Dust) and presents the player with an educational question about the respiratory system. Correct answers allow the player to proceed without penalty, while incorrect answers result in losing a life.

## 2. Goals

*   Integrate educational content seamlessly with gameplay.
*   Pause game activity during the Q&A interaction.
*   Provide immediate feedback on the player's answer.
*   Implement a penalty (loss of life) for incorrect answers.
*   Manage a pool of questions, supporting different types (e.g., Multiple Choice, True/False).
*   Implement logic for question selection and repetition.

## 3. Core Components & Flow

```mermaid
graph LR
    A[Collision Detected] --> B{Signal Scene3D};
    B --> C[Scene3D: startQuestionSequence];
    C --> D{Update Game State};
    D -- Set gameState = 'question_paused' --> E;
    D -- Select Question based on Logic --> F[Set currentQuestion State];
    E --> G[Pause Game Logic];
    F --> H[Render QuestionOverlay];
    H --> I{User Submits Answer};
    I --> J[Scene3D: handleAnswer];
    J --> K{Check Correctness};
    K -- Incorrect --> L[Decrement Lives];
    K -- Incorrect --> M[Add to incorrectlyAnsweredQuestionIds];
    K -- Correct --> N[Remove from incorrectlyAnsweredQuestionIds (if present)];
    L --> O{Update Game State};
    M --> P[Add to askedQuestionIds];
    N --> P;
    P --> O;
    O -- Set gameState = 'playing' --> Q[Resume Game Logic];
    O -- Clear currentQuestion --> H;
```

**Detailed Flow:**

1.  **Collision:** `CollisionManager` detects a collision between "Oxy" and a Germ or Dust particle.
2.  **Signal:** `CollisionManager` notifies the main `Scene3D` component (or equivalent state manager).
3.  **Initiate:** `Scene3D` calls `startQuestionSequence()`.
4.  **Pause & Select:**
    *   `gameState` is set to `'question_paused'`.
    *   A question is selected from the pool based on the logic in Section 5.
    *   The selected question object is stored in the `currentQuestion` state.
5.  **Pause Execution:** Game logic responsive to `gameState` (movement, spawning, timers in `Oxy`, `GermManager`, `DustManager`, etc.) halts execution.
6.  **Display:** The `QuestionOverlay` component renders, displaying the `currentQuestion`.
7.  **User Interaction:** The player selects an answer within the `QuestionOverlay`.
8.  **Submit:** `QuestionOverlay` calls the `handleAnswer(submittedAnswer)` function passed from `Scene3D`.
9.  **Evaluate & Update:**
    *   `handleAnswer` compares the submitted answer to the correct answer.
    *   If incorrect: `lives` state is decremented, and the question ID is added to `incorrectlyAnsweredQuestionIds`.
    *   If correct: The question ID is removed from `incorrectlyAnsweredQuestionIds` if present.
    *   The question ID is added to `askedQuestionIds`.
10. **Resume:**
    *   `currentQuestion` is cleared.
    *   `gameState` is set back to `'playing'`.
    *   Game logic resumes execution.

## 4. State Management

Located primarily within `Scene3D` or a dedicated Game Context/Store.

*   `gameState: 'playing' | 'question_paused' | 'game_over' | 'loading'`: Manages the overall state of the game, crucial for pausing/resuming.
*   `lives: number`: Existing state for player lives.
*   `currentQuestion: Question | null`: Holds the data for the question currently being displayed.
*   `askedQuestionIds: Set<number>`: Tracks the IDs of questions asked during the current game session. Reset on new game.
*   `incorrectlyAnsweredQuestionIds: Set<number>`: Tracks the IDs of questions answered incorrectly during the current session. Reset on new game.

## 5. Question Data & Selection Logic

*   **Data Source:** A dedicated file (e.g., `src/data/questions.ts` or `src/config/questions.json`) will store an array of question objects.
*   **Question Structure (Example):**
    ```typescript
    interface BaseQuestion {
      id: number;
      text: string;
      type: 'multiple_choice' | 'true_false';
      // Add other metadata if needed, e.g., difficulty, topic
    }

    interface MultipleChoiceQuestion extends BaseQuestion {
      type: 'multiple_choice';
      options: string[];
      correctAnswer: string; // The correct option text
    }

    interface TrueFalseQuestion extends BaseQuestion {
      type: 'true_false';
      correctAnswer: boolean;
    }

    type Question = MultipleChoiceQuestion | TrueFalseQuestion;

    const questions: Question[] = [
      // ... populate with actual questions ...
    ];
    ```
*   **Selection Logic (`selectQuestion` function):**
    1.  Identify available questions: Filter the main `questions` array to exclude those whose IDs are in the current session's `askedQuestionIds`.
    2.  **Priority 1 (Unasked):** If there are unasked questions, randomly select one from that subset.
    3.  **Priority 2 (Incorrectly Answered):** If all questions have been asked (`available questions` is empty), identify questions whose IDs are in `incorrectlyAnsweredQuestionIds`. If this subset is not empty, randomly select one from it.
    4.  **Priority 3 (Cycle All):** If all questions have been asked AND all incorrectly answered questions have been re-asked (or there were none), reset the pool for selection to *all* questions *except* the immediately preceding one (to avoid direct repeats if possible), and randomly select one. (Alternatively, could just cycle through incorrectly answered ones again).

## 6. UI Component (`QuestionOverlay.tsx`)

*   A React component, likely rendered conditionally based on `gameState === 'question_paused'`.
*   Can be rendered via `createPortal` or potentially using Drei's `<Html>` if tight integration with the canvas overlay is needed.
*   Receives `currentQuestion` object and `onAnswerSubmit` callback via props.
*   Dynamically renders the question text and answer options based on `currentQuestion.type`.
*   Uses standard HTML/CSS/Tailwind for styling. Can incorporate `framer-motion` for entry/exit animations.

## 7. Game Pause Implementation

*   Components with time-dependent logic (e.g., using `useFrame` in `@react-three/fiber`) must check the `gameState`.
    ```javascript
    useFrame((state, delta) => {
      if (gameState !== 'playing') return; // Skip updates if paused

      // ... existing movement/animation/timer logic ...
    });
    ```
*   This applies to player movement (`Oxy`), enemy movement/spawning (`GermManager`, `DustManager`), camera controls (`CameraController`), and potentially other animations or timers.

## 8. Tasks (See `tasks/current_tasks.md`)

Detailed implementation tasks will be listed in the main task tracking document. 