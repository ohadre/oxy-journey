import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Dust from './Dust';
import { useLoading } from './LoadingManager';

const TUNNEL_RADIUS = 6;
const SPAWN_Z = -140;
const OUT_OF_BOUNDS_Z = 160;
const MAX_DUSTS = 6;
const SPAWN_INTERVAL = 3; // seconds
const INITIAL_SPAWN_DELAY = 1.5; // seconds delay after loading before first spawn

function randomXY(radius: number): [number, number] {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * (radius - 1.5); // -1.5 for margin
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function randomSpeed() {
  return 0.05 + Math.random() * 0.05; // 0.05 to 0.1
}

function randomTargetAcrossTunnel(spawnXY: [number, number]): [number, number, number] {
  return [spawnXY[0], spawnXY[1], 140];
}

export interface DustInstance {
  id: string;
  position: [number, number, number];
  speed: number;
  size: number;
  target: [number, number, number];
}

interface DustManagerProps {
  oxyPosition: [number, number, number];
}

const DustManager: React.FC<DustManagerProps> = ({ oxyPosition }) => {
  const [dusts, setDusts] = useState<DustInstance[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { isLoading } = useLoading();
  const nextId = useRef(Date.now());
  const spawnTimer = useRef(0);
  const isFirstSpawn = useRef(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, INITIAL_SPAWN_DELAY * 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useFrame((_, delta) => {
    if (!isReady) return;
    setDusts(prev => {
      let filtered = prev.filter(dust => dust.position[2] < OUT_OF_BOUNDS_Z);
      spawnTimer.current += delta;
      if (filtered.length < MAX_DUSTS && spawnTimer.current >= SPAWN_INTERVAL) {
        const [x, y] = randomXY(TUNNEL_RADIUS);
        filtered.push({
          id: `dust-${nextId.current++}`,
          position: [x, y, SPAWN_Z],
          speed: randomSpeed(),
          size: 0.7 + Math.random() * 0.4,
          target: randomTargetAcrossTunnel([x, y]),
        });
        spawnTimer.current = 0;
      }
      return filtered;
    });
  });

  return (
    <>
      {dusts.map(dust => (
        <Dust key={dust.id} position={dust.position} speed={dust.speed} size={dust.size} target={dust.target} />
      ))}
    </>
  );
};

export default DustManager; 