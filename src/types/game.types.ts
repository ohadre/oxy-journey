export interface KnowledgeInstance {
  id: string;
  position: [number, number, number];
  size: number;
  timeAlive?: number;
}

// You can also add other game-specific types here in the future.
// For example, if GermInstance or DustInstance types are defined in Scene3D.tsx,
// they could be moved here for better organization. 