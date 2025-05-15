export interface KnowledgeInstance {
  id: string;
  position: [number, number, number];
  size: number;
  timeAlive?: number;
}

// NEW: Central GameState type
export type GameState = 
  | 'loading' 
  | 'playing' 
  | 'question_paused' 
  | 'game_over' 
  | 'level_complete_debug' // Included for Scene3D compatibility
  | 'won' 
  | 'instructions';

// You can also add other game-specific types here in the future.
// For example, if GermInstance or DustInstance types are defined in Scene3D.tsx,
// they could be moved here for better organization. 