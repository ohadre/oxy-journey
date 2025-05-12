# Development Journal

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
  - Updated textures to use proper `colorSpace = THREE.SRGBColorSpace` instead of deprecated `sRGBEncoding`
  - Added `toneMapped={false}` to materials for consistent rendering
  - Used `texture.needsUpdate = true` to ensure textures are fully processed

- **Enhanced Game Component Loading**:
  - Updated `Germ.tsx` to use preloaded textures
  - Added delayed spawning in `GermManager.tsx` to ensure scene stability
  - Improved error handling for texture loading failures

### Deployment and Testing
- Successfully implemented the solution and tested on local development environment
- Consolidated multiple Vercel projects to a single deployment
- Confirmed the fix is working in the production environment
- Eliminated white flashes for a smoother, more professional user experience

### Development Guidelines
- **Test Locally Before Commit:** Every new feature, bugfix, or refactor must be tested in the local development environment before committing and pushing to the repository. This ensures that changes work as intended and reduces the risk of introducing bugs to the main codebase or production deployment. 

## Entity Management & Collision System Refactor (2024-06-11)

### Goals
- Implement reliable collision detection between player (Oxy) and enemies (Germs, Dust).
- Refactor entity management (Germs, Dust) for better state handling and separation of concerns.
- Ensure a continuous flow of enemies/obstacles.
- Connect collisions to player lives.

### Implementation Details
- **State Management (`Scene3D.tsx`):**
    - Centralized state for `oxyPosition`, `germs`, `dustParticles`, and `lives`.
    - Added callbacks (`handleGermsChange`, `handleDustChange`, `handleCollision`) for child components to update state.
- **Logic Components (`GermManager.tsx`, `DustManager.tsx`):
    - Refactored to be logic-only (movement, spawning, filtering).
    - Accept state arrays and update callbacks as props.
    - Implemented refined movement logic (preventing overshoot).
    - Tuned spawning parameters (`MAX_GERMS=20`, `MAX_DUST=15`, intervals, speed, lifetimes) for continuous flow.
- **Visual Components (`Germ.tsx`, `DustParticle.tsx`):
    - Created/updated to be purely visual, rendering based on props from `Scene3D`.
    - Used textured planes facing the camera.
- **Collision Handling (`CollisionManager.tsx`, `Scene3D.tsx`):
    - `CollisionManager` checks for collisions between Oxy and both Germs and Dust based on distance vs. combined radii.
    - Reports collision type (`'germ'` or `'dust'`) and `id` to `Scene3D`.
    - `Scene3D`'s `handleCollision` decrements `lives` state and filters the collided entity from the appropriate state array.
- **UI Update (`LivesIndicator.tsx`):
    - Ensured `LivesIndicator` correctly displays the `lives` state passed from `Scene3D`.

### Debugging & Fixes
- Resolved issue where germs snapped instantly to target due to large delta in initial frames.
- Fixed spawning logic stopping prematurely due to hitting `MAX_GERMS` too quickly; addressed by increasing limits and tuning parameters.
- Corrected build errors related to incorrect prop names (`lives` vs `currentLives`) and duplicate component calls.

### Current Status
- Germs and Dust particles spawn continuously, move correctly, and are rendered visually.
- Collision detection between Oxy and both entity types is functional.
- Collisions correctly decrement the player's lives, reflected in the UI.
- Core architecture for entity management and collision is established.

### Next Steps
- Implement Q&A mechanic triggered on collision.
- Add game over logic when lives reach zero.
- Refine visual appearance of Dust particles if needed.
- Add sound effects for collisions.
 