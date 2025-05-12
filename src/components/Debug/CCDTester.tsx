import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { firstHitTime, willCollide, setCCDDebugMode } from '../../utils/sphereCCD';

interface CCDTesterProps {
  enabled: boolean;
}

/**
 * A component for testing and visualizing sphere-sphere CCD collisions in isolation
 */
const CCDTester: React.FC<CCDTesterProps> = ({ enabled }) => {
  const [testRunning, setTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [showSpheres, setShowSpheres] = useState(true);
  
  // Reference time
  const startTime = useRef(0);
  const elapsedTime = useRef(0);
  
  // Sphere parameters
  const sphere1 = useRef({
    position: new THREE.Vector3(-5, 0, 0),
    velocity: new THREE.Vector3(5, 0, 0), // 5 units/sec rightward
    radius: 0.5
  });
  
  const sphere2 = useRef({
    position: new THREE.Vector3(5, 0, 0),
    velocity: new THREE.Vector3(-3, 0, 0), // 3 units/sec leftward
    radius: 0.5
  });
  
  // Prediction info
  const [collisionPredicted, setCollisionPredicted] = useState(false);
  const [hitTime, setHitTime] = useState<number | null>(null);
  const [collided, setCollided] = useState(false);
  
  // Reset test
  const resetTest = () => {
    // Reset sphere positions
    sphere1.current.position.set(-5, 0, 0);
    sphere2.current.position.set(5, 0, 0);
    
    // Reset velocities
    sphere1.current.velocity.set(5, 0, 0);
    sphere2.current.velocity.set(-3, 0, 0);
    
    // Reset state
    setTestRunning(false);
    setCollisionPredicted(false);
    setHitTime(null);
    setCollided(false);
    setTestResults([]);
    elapsedTime.current = 0;
  };
  
  // Start the test
  const startTest = () => {
    resetTest();
    setTestRunning(true);
    startTime.current = Date.now();
    
    // Check if collision is predicted
    const dt = 2.0; // Allow 2 seconds for collision
    const tHit = firstHitTime(
      sphere1.current.position,
      sphere1.current.velocity,
      sphere1.current.radius,
      sphere2.current.position,
      sphere2.current.velocity,
      sphere2.current.radius,
      dt,
      true // Enable debug for this test call
    );
    
    setHitTime(tHit);
    setCollisionPredicted(tHit !== null);
    
    // Log prediction
    setTestResults(prev => [
      ...prev, 
      `Test started. Collision ${tHit !== null ? 'predicted at t=' + tHit.toFixed(3) + 's' : 'not predicted'}`
    ]);
  };
  
  // Adjust vertical offset for testing glancing cases
  const adjustVerticalOffset = (value: number) => {
    sphere2.current.position.y = value;
    setTestResults(prev => [...prev, `Adjusted sphere 2 Y position to ${value.toFixed(2)}`]);
  };

  // Toggle collision debug mode
  const toggleDebugMode = () => {
    setCCDDebugMode(enabled);
  };
  
  // Animation frame logic
  useFrame((_, delta) => {
    if (!enabled || !testRunning) return;
    
    // Update elapsed time
    elapsedTime.current = (Date.now() - startTime.current) / 1000;
    
    // Update sphere positions
    sphere1.current.position.add(sphere1.current.velocity.clone().multiplyScalar(delta));
    sphere2.current.position.add(sphere2.current.velocity.clone().multiplyScalar(delta));
    
    // Check for actual collision
    const distance = sphere1.current.position.distanceTo(sphere2.current.position);
    const combinedRadius = sphere1.current.radius + sphere2.current.radius;
    
    if (!collided && distance <= combinedRadius) {
      setCollided(true);
      setTestResults(prev => [
        ...prev, 
        `Collision detected at t=${elapsedTime.current.toFixed(3)}s. Distance: ${distance.toFixed(3)}, Combined radius: ${combinedRadius.toFixed(3)}`
      ]);
    }
    
    // Auto-stop after 2 seconds
    if (elapsedTime.current > 2.0) {
      setTestRunning(false);
      
      if (!collided) {
        setTestResults(prev => [...prev, 'Test ended. No actual collision occurred.']);
      }
    }
  });
  
  if (!enabled) return null;
  
  return (
    <>
      {/* Visual representation of spheres */}
      {showSpheres && (
        <>
          <mesh position={sphere1.current.position.toArray()}>
            <sphereGeometry args={[sphere1.current.radius, 32, 32]} />
            <meshBasicMaterial color="blue" wireframe={false} transparent opacity={0.6} />
          </mesh>
          
          <mesh position={sphere2.current.position.toArray()}>
            <sphereGeometry args={[sphere2.current.radius, 32, 32]} />
            <meshBasicMaterial color="red" wireframe={false} transparent opacity={0.6} />
          </mesh>
          
          {/* Velocity arrows */}
          <arrowHelper 
            args={[
              sphere1.current.velocity.clone().normalize(),
              sphere1.current.position,
              sphere1.current.velocity.length() * 0.5, // Scale for visibility
              0x0000ff
            ]}
          />
          
          <arrowHelper 
            args={[
              sphere2.current.velocity.clone().normalize(),
              sphere2.current.position,
              sphere2.current.velocity.length() * 0.5, // Scale for visibility
              0xff0000
            ]}
          />
        </>
      )}
      
      {/* Control panel */}
      <Html position={[0, 3, 0]} style={{ width: '400px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '5px', color: 'white' }}>
        <div>
          <h3>CCD Collision Tester</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <button onClick={startTest} disabled={testRunning} style={{ marginRight: '10px', padding: '5px 10px' }}>
              Run Test
            </button>
            <button onClick={resetTest} style={{ marginRight: '10px', padding: '5px 10px' }}>
              Reset
            </button>
            <button onClick={toggleDebugMode} style={{ marginRight: '10px', padding: '5px 10px' }}>
              Toggle Debug
            </button>
            <button onClick={() => setShowSpheres(!showSpheres)} style={{ padding: '5px 10px' }}>
              {showSpheres ? 'Hide' : 'Show'} Spheres
            </button>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <p>Adjust Y offset for glancing tests:</p>
            <button onClick={() => adjustVerticalOffset(0)} style={{ marginRight: '5px' }}>0</button>
            <button onClick={() => adjustVerticalOffset(0.5)} style={{ marginRight: '5px' }}>0.5</button>
            <button onClick={() => adjustVerticalOffset(1.0)} style={{ marginRight: '5px' }}>1.0</button>
            <button onClick={() => adjustVerticalOffset(1.5)} style={{ marginRight: '5px' }}>1.5</button>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <p>Status: {testRunning ? 'Running' : 'Stopped'}</p>
            <p>Time: {elapsedTime.current.toFixed(3)}s</p>
            <p>Collision predicted: {collisionPredicted ? 'Yes' : 'No'}{hitTime ? ` at t=${hitTime.toFixed(3)}s` : ''}</p>
            <p>Collision occurred: {collided ? 'Yes' : 'No'}</p>
          </div>
          
          <div style={{ maxHeight: '150px', overflow: 'auto', border: '1px solid #444', padding: '5px', marginTop: '10px' }}>
            <h4>Test Log:</h4>
            {testResults.map((result, index) => (
              <div key={index} style={{ fontSize: '12px', marginBottom: '3px' }}>{result}</div>
            ))}
          </div>
        </div>
      </Html>
    </>
  );
};

export default CCDTester; 