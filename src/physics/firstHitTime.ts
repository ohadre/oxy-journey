import * as THREE from 'three';

export function firstHitTime(
  p1: THREE.Vector3, v1: THREE.Vector3, r1: number,
  p2: THREE.Vector3, v2: THREE.Vector3, r2: number,
  dt: number
): number | null {
  // Debug log input parameters
  console.log(`[firstHitTime] Input parameters:
    Object 1:
    - Position: (${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p1.z.toFixed(2)})
    - Velocity: (${v1.x.toFixed(2)}, ${v1.y.toFixed(2)}, ${v1.z.toFixed(2)})
    - Radius: ${r1.toFixed(2)}
    Object 2:
    - Position: (${p2.x.toFixed(2)}, ${p2.y.toFixed(2)}, ${p2.z.toFixed(2)})
    - Velocity: (${v2.x.toFixed(2)}, ${v2.y.toFixed(2)}, ${v2.z.toFixed(2)})
    - Radius: ${r2.toFixed(2)}
    Delta time: ${dt.toFixed(4)}s
  `);

  // Relative position (p1 - p2)
  const dp = new THREE.Vector3().subVectors(p1, p2);
  // Relative velocity (v1 - v2)
  const dv = new THREE.Vector3().subVectors(v1, v2);

  // Sum of radii
  const radiusSum = r1 + r2;

  // Coefficients of the quadratic equation: a*t^2 + b*t + c = 0
  const a = dv.dot(dv);
  const b = 2 * dp.dot(dv);
  const c = dp.dot(dp) - (radiusSum * radiusSum);

  // Debug log equation parameters
  console.log(`[firstHitTime] Collision equation parameters:
    - Relative position: (${dp.x.toFixed(2)}, ${dp.y.toFixed(2)}, ${dp.z.toFixed(2)})
    - Relative velocity: (${dv.x.toFixed(2)}, ${dv.y.toFixed(2)}, ${dv.z.toFixed(2)})
    - Combined radius: ${radiusSum.toFixed(2)}
    Quadratic equation (at² + bt + c = 0):
    - a = ${a.toFixed(4)} (relative velocity squared)
    - b = ${b.toFixed(4)} (2 * relative position dot relative velocity)
    - c = ${c.toFixed(4)} (relative position squared - combined radius squared)
  `);

  // If 'a' is very small (relative velocity is zero or near zero)
  if (Math.abs(a) < 1e-9) {
    // If they are overlapping (c <= 0), they are statically overlapping
    if (c <= 0) {
      console.log('[firstHitTime] Static overlap detected (a ≈ 0, c ≤ 0)');
      return 0.0;
    }
    console.log('[firstHitTime] No collision: objects not moving relative to each other and not overlapping');
    return null; // Not moving relative to each other and not initially overlapping
  }

  // Calculate discriminant
  const discriminantVal = b * b - 4 * a * c;

  // Debug log discriminant
  console.log(`[firstHitTime] Discriminant calculation:
    - b² = ${(b * b).toFixed(4)}
    - 4ac = ${(4 * a * c).toFixed(4)}
    - Discriminant = ${discriminantVal.toFixed(4)}
  `);

  // If discriminant is negative, no real roots, so no collision
  if (discriminantVal < 0) {
    console.log('[firstHitTime] No collision: discriminant is negative (no real roots)');
    return null;
  }

  // Calculate the two potential times of collision
  const sqrtD = Math.sqrt(discriminantVal);
  const t1 = (-b - sqrtD) / (2 * a);
  const t2 = (-b + sqrtD) / (2 * a);

  // Debug log potential collision times
  console.log(`[firstHitTime] Potential collision times:
    - t1 = ${t1.toFixed(4)}s
    - t2 = ${t2.toFixed(4)}s
    - Valid range: [0, ${dt.toFixed(4)}]s
  `);

  // Find the smallest non-negative root within the interval [0, dt]
  let tHit: number | null = null;

  if (t1 >= 0 && t1 <= dt) {
    tHit = t1;
  }
  if (t2 >= 0 && t2 <= dt) {
    if (tHit === null || t2 < tHit) {
      tHit = t2;
    }
  }

  if (tHit !== null) {
    console.log(`[firstHitTime] Collision detected at t = ${tHit.toFixed(4)}s`);
  } else {
    console.log('[firstHitTime] No collision within the time interval');
  }

  return tHit;
} 