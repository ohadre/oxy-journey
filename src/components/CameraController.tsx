import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RefObject } from 'react';

interface CameraControllerProps {
  oxyRef: RefObject<THREE.Mesh>; // Ref to Oxy's mesh
  offset?: THREE.Vector3;       // Camera offset from Oxy
  lookAtOffset?: THREE.Vector3; // Offset for the lookAt point from Oxy's position
}

const CAMERA_OFFSET_DEFAULT = new THREE.Vector3(0, 2, 5); // Behind, slightly above
const LOOK_AT_OFFSET_DEFAULT = new THREE.Vector3(0, 0, 0); // Look directly at Oxy's center

export default function CameraController({
  oxyRef,
  offset = CAMERA_OFFSET_DEFAULT,
  lookAtOffset = LOOK_AT_OFFSET_DEFAULT,
}: CameraControllerProps) {
  const { camera } = useThree();

  useFrame(() => {
    if (oxyRef.current) {
      const oxyPosition = oxyRef.current.position;

      // Calculate target camera position relative to Oxy
      // Clone offset to avoid modifying the default or prop
      const targetPosition = oxyPosition.clone().add(offset.clone());

      // Smoothly move the camera towards the target position
      camera.position.lerp(targetPosition, 0.1); // Adjust lerp factor for smoothness

      // Calculate lookAt point
      const lookAtPoint = oxyPosition.clone().add(lookAtOffset.clone());
      camera.lookAt(lookAtPoint);
    }
  });

  return null; // This component does not render anything itself
} 