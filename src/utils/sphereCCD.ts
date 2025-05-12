/**
 * Continuous sphere-sphere collision detection implementation that solves the time of collision 
 * between linearly moving spheres to prevent tunneling at high velocities.
 */

import * as THREE from 'three';

// Reuse these objects to reduce garbage collection
const _pos1 = new THREE.Vector3();
const _pos2 = new THREE.Vector3();
const _vel1 = new THREE.Vector3();
const _vel2 = new THREE.Vector3();
const _relativePos = new THREE.Vector3();
const _relativeVel = new THREE.Vector3();

// Constants for numerical stability
const EPSILON = 1e-9;
const MIN_RELATIVE_VELOCITY = 1e-5;

// Debug mode flag that can be toggled globally
export let DEBUG_CCD = false;

/**
 * Enable or disable detailed CCD debug logging
 */
export function setCCDDebugMode(enabled: boolean) {
  DEBUG_CCD = enabled;
  console.log(`[sphereCCD] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
}

/**
 * Calculate the time of first collision between two moving spheres
 * using the quadratic formula solution from the time-parameterized
 * distance equation between two moving objects.
 *
 * @param pos1 Position of the first sphere
 * @param vel1 Velocity of the first sphere
 * @param radius1 Radius of the first sphere
 * @param pos2 Position of the second sphere
 * @param vel2 Velocity of the second sphere
 * @param radius2 Radius of the second sphere
 * @param dt Maximum time step to consider
 * @param debug Whether to output debug information
 * @returns Time of first hit, or null if no collision within the time step
 */
export function firstHitTime(
  pos1: THREE.Vector3,
  vel1: THREE.Vector3,
  radius1: number,
  pos2: THREE.Vector3,
  vel2: THREE.Vector3,
  radius2: number,
  dt: number,
  debug: boolean = false
): number | null {
  // Safety checks for invalid inputs
  if (!pos1 || !pos2 || !vel1 || !vel2) {
    console.warn('[sphereCCD] Invalid input parameters:', { pos1, vel1, pos2, vel2 });
    return null;
  }
  
  if (Number.isNaN(radius1) || Number.isNaN(radius2) || radius1 <= 0 || radius2 <= 0 || dt <= 0) {
    console.warn('[sphereCCD] Invalid radius or dt:', { radius1, radius2, dt });
    return null;
  }

  // Create temporaries using reusable vectors
  _pos1.copy(pos1);
  _vel1.copy(vel1);
  _pos2.copy(pos2);
  _vel2.copy(vel2);
  
  // Check if objects already intersect
  const combinedRadius = radius1 + radius2;
  const initialDistance = _pos1.distanceTo(_pos2);
  
  if (initialDistance <= combinedRadius) {
    if (debug || DEBUG_CCD) {
      console.log('[sphereCCD] Objects already intersecting!', {
        distance: initialDistance,
        combinedRadius,
        pos1: _pos1.toArray().map(v => v.toFixed(2)),
        pos2: _pos2.toArray().map(v => v.toFixed(2))
      });
    }
    return 0; // Already colliding
  }
  
  // Calculate relative position and velocity
  _relativePos.copy(_pos1).sub(_pos2);
  _relativeVel.copy(_vel1).sub(_vel2);
  
  const relativeSpeed = _relativeVel.length();
  
  // If relative velocity is effectively zero, won't collide during this timestep
  if (relativeSpeed < MIN_RELATIVE_VELOCITY) {
    return null;
  }

  // Quadratic equation coefficients: a*t^2 + b*t + c = 0
  // Where t is time of collision and:
  // a = |v_rel|^2 
  // b = 2(p_rel ⋅ v_rel)
  // c = |p_rel|^2 - (r1 + r2)^2
  const a = _relativeVel.lengthSq();
  const b = 2 * _relativePos.dot(_relativeVel);
  const c = _relativePos.lengthSq() - combinedRadius * combinedRadius;
  
  // If a is zero or very small, the equation degenerates - use adjusted calculation
  if (Math.abs(a) < EPSILON) {
    if (Math.abs(b) < EPSILON) {
      // Both a and b are effectively zero - no collision possible
      return null;
    }
    
    // With a ≈ 0, we have b*t + c = 0
    // So t = -c/b
    const t = -c / b;
    
    if (debug || DEBUG_CCD) {
      console.log('[sphereCCD] Linear case (a ≈ 0):', { a, b, c, t });
    }
    
    // Only consider collisions in the future and within our timestep
    if (t >= 0 && t <= dt) {
      return t;
    }
    return null;
  }
  
  // Discriminant determines if collision occurs
  const discriminant = b * b - 4 * a * c;
  
  if (debug || DEBUG_CCD) {
    const timeToClosestApproach = -b / (2 * a);
    console.log('[sphereCCD] Collision calculation:', {
      a, b, c, discriminant, relativeSpeed,
      timeToClosestApproach: timeToClosestApproach.toFixed(4),
      withinTimestep: timeToClosestApproach >= 0 && timeToClosestApproach <= dt
    });
  }
  
  // If discriminant is negative, no collision occurs
  if (discriminant < 0) {
    if (debug || DEBUG_CCD) {
      // Calculate and report closest approach
      const timeToClosestApproach = -b / (2 * a);
      if (timeToClosestApproach >= 0 && timeToClosestApproach <= dt) {
        // Calculate position at closest approach
        const p1AtClosest = new THREE.Vector3().copy(_pos1).addScaledVector(_vel1, timeToClosestApproach);
        const p2AtClosest = new THREE.Vector3().copy(_pos2).addScaledVector(_vel2, timeToClosestApproach);
        const closestDistance = p1AtClosest.distanceTo(p2AtClosest);
        
        console.log('[sphereCCD] Closest approach (miss):', {
          time: timeToClosestApproach.toFixed(4),
          distance: closestDistance.toFixed(4),
          missByAmount: (closestDistance - combinedRadius).toFixed(4)
        });
      }
    }
    return null;
  }
  
  // Calculate the two potential collision times
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const t1 = (-b - sqrtDiscriminant) / (2 * a);
  const t2 = (-b + sqrtDiscriminant) / (2 * a);
  
  if (debug || DEBUG_CCD) {
    console.log('[sphereCCD] Potential collision times:', { 
      t1: t1.toFixed(4), 
      t2: t2.toFixed(4),
      dt: dt.toFixed(4)
    });
  }
  
  // We want the earliest time of collision that's within our timestep
  if (t1 >= 0 && t1 <= dt) {
    return t1;
  }
  
  if (t2 >= 0 && t2 <= dt) {
    return t2;
  }
  
  return null;
}

/**
 * Checks if two moving spheres will collide within the specified time step
 */
export function willCollide(
  pos1: THREE.Vector3,
  vel1: THREE.Vector3,
  radius1: number,
  pos2: THREE.Vector3,
  vel2: THREE.Vector3,
  radius2: number,
  dt: number
): boolean {
  return firstHitTime(pos1, vel1, radius1, pos2, vel2, radius2, dt) !== null;
}

/**
 * Extrapolate an object's position based on its current position, velocity, and a time delta
 */
export function extrapolatePosition(
  position: THREE.Vector3,
  velocity: THREE.Vector3,
  time: number
): THREE.Vector3 {
  return new THREE.Vector3().copy(position).addScaledVector(velocity, time);
}

/**
 * Find positions of both objects at the moment of collision
 */
export function collisionPositions(
  pos1: THREE.Vector3,
  vel1: THREE.Vector3,
  radius1: number,
  pos2: THREE.Vector3,
  vel2: THREE.Vector3,
  radius2: number,
  dt: number
): { position1: THREE.Vector3, position2: THREE.Vector3 } | null {
  const hitTime = firstHitTime(pos1, vel1, radius1, pos2, vel2, radius2, dt);
  
  if (hitTime === null) {
    return null;
  }
  
  return {
    position1: extrapolatePosition(pos1, vel1, hitTime),
    position2: extrapolatePosition(pos2, vel2, hitTime)
  };
}

// Reused objects for collision response
const _normal = new THREE.Vector3();
const _v1n = new THREE.Vector3();
const _v2n = new THREE.Vector3();
const _v1t = new THREE.Vector3();
const _v2t = new THREE.Vector3();
const _v1nNew = new THREE.Vector3();
const _v2nNew = new THREE.Vector3();
const _v1New = new THREE.Vector3();
const _v2New = new THREE.Vector3();

/**
 * Calculate collision response between two spheres.
 * 
 * @param p1 - Position of first sphere
 * @param v1 - Velocity of first sphere
 * @param m1 - Mass of first sphere
 * @param p2 - Position of second sphere
 * @param v2 - Velocity of second sphere
 * @param m2 - Mass of second sphere
 * @param restitution - Coefficient of restitution (elasticity), 0-1
 * @returns New velocities [v1', v2']
 */
export function calculateCollisionResponse(
  p1: THREE.Vector3,
  v1: THREE.Vector3,
  m1: number,
  p2: THREE.Vector3,
  v2: THREE.Vector3,
  m2: number,
  restitution = 0.8
): [THREE.Vector3, THREE.Vector3] {
  // Calculate collision normal (direction from p1 to p2)
  _normal.subVectors(p2, p1).normalize();
  
  // In case of perfect overlap, use a default normal
  if (_normal.lengthSq() < EPSILON) {
    _normal.set(0, 1, 0); // Default direction if objects are perfectly overlapping
  }
  
  // Project velocities onto collision normal
  const v1DotNormal = v1.dot(_normal);
  const v2DotNormal = v2.dot(_normal);
  
  _v1n.copy(_normal).multiplyScalar(v1DotNormal);
  _v2n.copy(_normal).multiplyScalar(v2DotNormal);
  
  // Calculate tangential velocities (perpendicular to normal)
  _v1t.copy(v1).sub(_v1n);
  _v2t.copy(v2).sub(_v2n);
  
  // Calculate new normal velocities using conservation of momentum and energy
  // Optimization: pre-calculate common factors
  const sumMass = m1 + m2;
  
  // Calculate v1nNew
  _v1nNew.copy(_v1n).multiplyScalar(m1 - m2 * restitution);
  const temp = _v2n.clone().multiplyScalar(m2 * (1 + restitution));
  _v1nNew.add(temp).divideScalar(sumMass);
  
  // Calculate v2nNew
  _v2nNew.copy(_v1n).multiplyScalar(m1 * (1 + restitution));
  temp.copy(_v2n).multiplyScalar(m2 - m1 * restitution);
  _v2nNew.add(temp).divideScalar(sumMass);
  
  // Add tangential velocities (unchanged) to new normal velocities
  _v1New.copy(_v1nNew).add(_v1t);
  _v2New.copy(_v2nNew).add(_v2t);
  
  // Create new vectors for the return since we're reusing the internal ones
  return [_v1New.clone(), _v2New.clone()];
} 