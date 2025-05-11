import React from 'react';
import Dust from './Dust';
import { EntityManager, EntityInstance } from './EntityManager';

interface DustInstance extends EntityInstance {
  // Add any dust-specific properties here
}

interface DustManagerProps {
  oxyPosition: [number, number, number];
}

const DustManager: React.FC<DustManagerProps> = ({ oxyPosition }) => {
  return (
    <EntityManager<DustInstance>
      oxyPosition={oxyPosition}
      maxEntities={6}
      spawnInterval={3}
      initialSpawnDelay={1.5}
      entityType="dust"
      renderEntity={(dust) => (
        <Dust
          key={dust.id}
          position={dust.position}
          speed={dust.speed}
          size={dust.size}
          target={dust.target}
        />
      )}
    />
  );
};

export default DustManager; 