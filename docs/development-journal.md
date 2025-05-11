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