import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import Oxy from '../Oxy';

// Mock ResizeObserver which is required by Canvas
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

describe('Oxy Component', () => {
  it('should render without crashing when placed inside a Canvas', () => {
    render(
      <Canvas>
        <Oxy />
      </Canvas>
    );
  });
}); 