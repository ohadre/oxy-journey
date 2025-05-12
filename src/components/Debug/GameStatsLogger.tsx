import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GermInstance } from '../GermManager';

interface GameStatsLoggerProps {
  enabled: boolean;
  oxyPosition: [number, number, number];
  oxyVelocity: THREE.Vector3;
  oxyRadius: number;
  germs: GermInstance[];
  logInterval?: number; // Time in ms between logs
}

/**
 * Component that logs game statistics to the console at regular intervals
 * Helps troubleshoot collision detection and physics issues
 */
const GameStatsLogger: React.FC<GameStatsLoggerProps> = ({
  enabled,
  oxyPosition,
  oxyVelocity,
  oxyRadius,
  germs,
  logInterval = 2000 // Default to log every 2 seconds
}) => {
  const lastLogTime = useRef(0);
  const frameCounter = useRef(0);
  const framesSinceLastLog = useRef(0);
  
  // Capture stats over time
  const statsRef = useRef({
    fps: 0,
    minGermDistance: Infinity,
    maxGermSpeed: 0,
    averageGermSpeed: 0,
    germCount: 0
  });
  
  // Log component lifecycle
  useEffect(() => {
    if (enabled) {
      console.log('[GameStatsLogger] Component mounted');
      return () => console.log('[GameStatsLogger] Component unmounted');
    }
  }, [enabled]);
  
  // Set up the stats collection and logging
  useFrame((_, delta) => {
    if (!enabled) return;
    
    // Increment frame counter
    frameCounter.current++;
    framesSinceLastLog.current++;
    
    // Calculate current stats
    const currentTime = Date.now();
    const timeSinceLastLog = currentTime - lastLogTime.current;
    
    // Calculate FPS
    if (timeSinceLastLog > 0) {
      statsRef.current.fps = Math.round((framesSinceLastLog.current * 1000) / timeSinceLastLog);
    }
    
    // Find closest germ
    let closestDistance = Infinity;
    let totalSpeed = 0;
    let maxSpeed = 0;
    
    for (const germ of germs) {
      const germPos = new THREE.Vector3(...germ.position);
      const oxyPos = new THREE.Vector3(...oxyPosition);
      const distance = germPos.distanceTo(oxyPos);
      
      if (distance < closestDistance) {
        closestDistance = distance;
      }
      
      // Track speeds
      if (germ.speed > maxSpeed) {
        maxSpeed = germ.speed;
      }
      totalSpeed += germ.speed;
    }
    
    // Update stats
    statsRef.current.minGermDistance = closestDistance;
    statsRef.current.maxGermSpeed = maxSpeed;
    statsRef.current.averageGermSpeed = germs.length > 0 ? totalSpeed / germs.length : 0;
    statsRef.current.germCount = germs.length;
    
    // Log at specified interval
    if (timeSinceLastLog >= logInterval) {
      console.log(`
===== Game Stats =====
FPS: ${statsRef.current.fps}
Oxy Position: [${oxyPosition[0].toFixed(2)}, ${oxyPosition[1].toFixed(2)}, ${oxyPosition[2].toFixed(2)}]
Oxy Velocity: ${oxyVelocity.length().toFixed(2)} units/sec
Germs: ${statsRef.current.germCount}
Closest Germ: ${statsRef.current.minGermDistance.toFixed(2)} units (min safe: ${(oxyRadius + 0.5).toFixed(2)})
Germ Speeds: avg ${statsRef.current.averageGermSpeed.toFixed(2)}, max ${statsRef.current.maxGermSpeed.toFixed(2)} units/sec
=====================
      `);
      
      // Reset counters
      lastLogTime.current = currentTime;
      framesSinceLastLog.current = 0;
    }
  });
  
  // This component doesn't render anything
  return null;
};

export default GameStatsLogger; 