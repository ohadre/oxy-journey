import { firstHitTime } from '../utils/sphereCCD';
import * as THREE from 'three';

describe('sphereCCD', () => {
  describe('firstHitTime', () => {
    // Test case 1: Direct head-on hit
    test('should detect direct head-on collision', () => {
      // Two spheres moving directly toward each other
      const p1 = new THREE.Vector3(-5, 0, 0);
      const v1 = new THREE.Vector3(1, 0, 0); // Moving right at 1 unit/s
      const r1 = 1.0;
      
      const p2 = new THREE.Vector3(5, 0, 0);
      const v2 = new THREE.Vector3(-1, 0, 0); // Moving left at 1 unit/s
      const r2 = 1.0;
      
      const dt = 10;
      
      const tHit = firstHitTime(p1, v1, r1, p2, v2, r2, dt);
      
      // With relative velocity of 2 units/s and distance of 10 - 2 (radii) = 8 units
      // Collision should occur at t = 4
      expect(tHit).toBeCloseTo(4.0);
    });
    
    // Test case 2: Glancing miss
    test('should return null for glancing miss', () => {
      // Two spheres that will pass by each other closely but not collide
      const p1 = new THREE.Vector3(-5, 0.5, 0);
      const v1 = new THREE.Vector3(1, 0, 0); // Moving right
      const r1 = 0.4;
      
      const p2 = new THREE.Vector3(5, -0.5, 0);
      const v2 = new THREE.Vector3(-1, 0, 0); // Moving left
      const r2 = 0.4;
      
      const dt = 10;
      
      // Distance between centers at closest approach will be 1.0 unit
      // Combined radii is 0.8, so they should miss by 0.2 units
      const tHit = firstHitTime(p1, v1, r1, p2, v2, r2, dt);
      
      expect(tHit).toBeNull();
    });
    
    // Test case 3: Parallel motion (no relative velocity)
    test('should return null for parallel motion with same velocity', () => {
      const p1 = new THREE.Vector3(0, 0, 0);
      const v1 = new THREE.Vector3(1, 0, 0); // Moving right
      const r1 = 1.0;
      
      const p2 = new THREE.Vector3(5, 0, 0);
      const v2 = new THREE.Vector3(1, 0, 0); // Also moving right at same speed
      const r2 = 1.0;
      
      const dt = 10;
      
      // Relative velocity is zero, so no collision will occur
      const tHit = firstHitTime(p1, v1, r1, p2, v2, r2, dt);
      
      expect(tHit).toBeNull();
    });
    
    // Test case 4: Overlap at t=0
    test('should return 0 for already overlapping spheres', () => {
      const p1 = new THREE.Vector3(0, 0, 0);
      const v1 = new THREE.Vector3(1, 0, 0);
      const r1 = 2.0;
      
      const p2 = new THREE.Vector3(1, 0, 0);
      const v2 = new THREE.Vector3(0, 0, 0);
      const r2 = 1.5;
      
      const dt = 10;
      
      // Distance between centers is 1, combined radii is 3.5
      // They're already overlapping at t=0
      const tHit = firstHitTime(p1, v1, r1, p2, v2, r2, dt);
      
      expect(tHit).toBe(0);
    });
    
    // Test case 5: Discriminant < 0 case (no real roots)
    test('should return null when discriminant is negative', () => {
      // Objects moving away from each other, no collision possible
      const p1 = new THREE.Vector3(0, 0, 0);
      const v1 = new THREE.Vector3(-1, 0, 0); // Moving left
      const r1 = 1.0;
      
      const p2 = new THREE.Vector3(5, 0, 0);
      const v2 = new THREE.Vector3(1, 0, 0); // Moving right
      const r2 = 1.0;
      
      const dt = 10;
      
      // Objects are moving apart, so discriminant should be negative
      const tHit = firstHitTime(p1, v1, r1, p2, v2, r2, dt);
      
      expect(tHit).toBeNull();
    });

    // Test case 6: Multiple consecutive calls (testing static variable reuse)
    test('should handle multiple consecutive calls correctly', () => {
      // First call - should detect collision
      let p1 = new THREE.Vector3(-5, 0, 0);
      let v1 = new THREE.Vector3(1, 0, 0);
      let p2 = new THREE.Vector3(5, 0, 0);
      let v2 = new THREE.Vector3(-1, 0, 0);
      
      let tHit = firstHitTime(p1, v1, 1.0, p2, v2, 1.0, 10);
      expect(tHit).toBeCloseTo(4.0);
      
      // Second call with different inputs - should miss
      p1 = new THREE.Vector3(-5, 1.5, 0);
      v1 = new THREE.Vector3(1, 0, 0);
      p2 = new THREE.Vector3(5, -1.5, 0);
      v2 = new THREE.Vector3(-1, 0, 0);
      
      tHit = firstHitTime(p1, v1, 1.0, p2, v2, 1.0, 10);
      expect(tHit).toBeNull();
      
      // Third call - should detect collision again
      p1 = new THREE.Vector3(0, 0, 0);
      v1 = new THREE.Vector3(0, 0, 0);
      p2 = new THREE.Vector3(1.5, 0, 0);
      v2 = new THREE.Vector3(-1, 0, 0);
      
      tHit = firstHitTime(p1, v1, 1.0, p2, v2, 1.0, 10);
      expect(tHit).toBeCloseTo(0.5);
    });
  });
}); 