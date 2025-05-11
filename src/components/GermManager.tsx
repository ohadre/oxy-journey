import React from 'react';
import Germ from './Germ';
import { EntityManager, EntityInstance } from './EntityManager';

interface GermInstance extends EntityInstance {
  // Add any germ-specific properties here
}

interface GermManagerProps {
  oxyPosition: [number, number, number];
}

const GermManager: React.FC<GermManagerProps> = ({ oxyPosition }) => {
  return (
    <EntityManager<GermInstance>
      oxyPosition={oxyPosition}
      maxEntities={8}
      spawnInterval={2}
      initialSpawnDelay={1.5}
      entityType="germ"
      renderEntity={(germ) => (
        <Germ
          key={germ.id}
          position={germ.position}
          speed={germ.speed}
          size={germ.size}
          target={germ.target}
        />
      )}
    />
  );
};

export default GermManager; 