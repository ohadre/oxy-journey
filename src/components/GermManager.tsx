import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Germ from './Germ';
import { useLoading } from './LoadingManager';

const TUNNEL_RADIUS = 6;
const SPAWN_Z = -140; // Far end of the tunnel
const OUT_OF_BOUNDS_Z = 160; // Remove germs past this Z
const MAX_GERMS = 8;
const SPAWN_INTERVAL = 2; // seconds
const INITIAL_SPAWN_DELAY = 1.5; // seconds delay after loading before first spawn

function randomXY(radius: number): [number, number] {
  // Random point in a circle
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * (radius - 1); // -1 for margin
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function randomSpeed() {
  return 0.08 + Math.random() * 0.07; // 0.08 to 0.15
}

function randomTargetNearOxy(oxyPosition: [number, number, number], radius = 2): [number, number, number] {
  const [dx, dy] = randomXY(radius);
  return [oxyPosition[0] + dx, oxyPosition[1] + dy, oxyPosition[2]];
}

function randomTargetAcrossTunnel(spawnXY: [number, number]): [number, number, number] {
  // Target is same X/Y, but at the far end (z = +140)
  return [spawnXY[0], spawnXY[1], 140];
}

export interface GermInstance {
  id: string;
  position: [number, number, number];
  speed: number;
  size: number;
  target: [number, number, number];
}

interface GermManagerProps {
  oxyPosition: [number, number, number];
}

const GermManager: React.FC<GermManagerProps> = ({ oxyPosition }) => {
  const [germs, setGerms] = useState<GermInstance[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { isLoading, loadedTextures } = useLoading();
  const nextId = useRef(Date.now());
  const spawnTimer = useRef(0);
  const isFirstSpawn = useRef(true);

  // Set ready state after loading completes
  useEffect(() => {
    if (!isLoading) {
      // Add a delay before allowing spawns
      console.log('[GermManager] Loading complete, setting up spawn timer');
      const timer = setTimeout(() => {
        console.log('[GermManager] Now ready to spawn germs');
        setIsReady(true);
      }, INITIAL_SPAWN_DELAY * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useFrame((_, delta) => {
    // Only process spawns if loading is complete and ready state is true
    if (!isReady) return;

    setGerms(prev => {
      // Remove germs out of bounds
      let filtered = prev.filter(germ => germ.position[2] < OUT_OF_BOUNDS_Z);
      
      // Timer-based spawning
      spawnTimer.current += delta;
      
      if (filtered.length < MAX_GERMS && spawnTimer.current >= SPAWN_INTERVAL) {
        console.log('[GermManager] Spawning new germ');
        const [x, y] = randomXY(TUNNEL_RADIUS);
        filtered.push({
          id: `germ-${nextId.current++}`,
          position: [x, y, SPAWN_Z],
          speed: randomSpeed(),
          size: 1 + Math.random() * 0.5,
          target: randomTargetAcrossTunnel([x, y]),
        });
        
        // Log first spawn
        if (isFirstSpawn.current) {
          console.log('[GermManager] First germ spawned');
          isFirstSpawn.current = false;
        }
        
        spawnTimer.current = 0;
      }
      return filtered;
    });
  });

  return (
    <>
      {germs.map(germ => (
        <Germ key={germ.id} position={germ.position} speed={germ.speed} size={germ.size} target={germ.target} />
      ))}
    </>
  );
};

export default GermManager; 