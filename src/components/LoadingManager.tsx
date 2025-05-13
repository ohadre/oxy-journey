'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LoadingScreen } from './LoadingScreen';

type LoadingContextType = {
  isLoading: boolean;
  progress: number;
  loadedTextures: string[];
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  progress: 0,
  loadedTextures: []
});

export const useLoading = () => useContext(LoadingContext);

// Create a global TextureLoader that can be reused
const globalTextureLoader = new THREE.TextureLoader();

// Preload a texture and store it in memory
export function preloadTexture(path: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const texture = globalTextureLoader.load(
      path,
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        resolve(loadedTexture);
      },
      undefined,
      (error) => reject(error)
    );
  });
}

export function LoadingManager({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadedTextures, setLoadedTextures] = useState<string[]>([]);
  const [loadingPhase, setLoadingPhase] = useState('initializing');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Store loaded textures for cleanup
  const loadedTexturesRef = useRef<THREE.Texture[]>([]);
  
  useEffect(() => {
    console.log('[LoadingManager] Component mounting');
    
    // Define all textures to be preloaded
    const textures = [
      '/textures/tunnel_tile.png',
      '/textures/oxy.png',
      '/textures/germ.png',
      '/textures/dust.png'
    ];

    // Define any 3D models to preload if you have any
    const models: string[] = [];
    
    // Define any audio files to preload if you have any
    const audioFiles: string[] = [];
    
    // Calculate total assets to load
    const totalAssets = textures.length + models.length + audioFiles.length;
    
    // Initialize counters
    let loadedCount = 0;
    let errorCount = 0;

    // Update progress and check if loading is complete
    const updateProgress = () => {
      loadedCount++;
      const newProgress = Math.round((loadedCount / totalAssets) * 100);
      console.log(`[LoadingManager] Progress: ${newProgress}% (${loadedCount}/${totalAssets})`);
      setProgress(newProgress);
      
      // Check if all assets are loaded
      if (loadedCount === totalAssets) {
        console.log('[LoadingManager] All assets loaded (with', errorCount, 'errors)');
        
        // Start transition after loading - this might not be needed if LoadingScreen handles its own exit
        // setIsTransitioning(true); 
        
        // Remove or shorten the delay
        // setTimeout(() => {
        console.log('[LoadingManager] Setting isLoading to false IMMEDIATELY');
        setIsLoading(false); // Set false immediately
        // }, 1000); 
      }
    };

    // Load textures
    const loadTextures = async () => {
      setLoadingPhase('textures');
      console.log('[LoadingManager] Loading textures...');
      
      // Load all textures simultaneously
      const texturePromises = textures.map((texturePath, i) => {
        console.log(`[LoadingManager] Creating promise for texture (${i+1}/${textures.length}): ${texturePath}`);
        
        return new Promise<void>((resolveOuter) => {
          const texture = globalTextureLoader.load(
            texturePath,
            (loadedTexture) => {
              console.log(`[LoadingManager] Successfully loaded texture: ${texturePath}`);
              loadedTexture.colorSpace = THREE.SRGBColorSpace;
              loadedTexture.needsUpdate = true;
              loadedTexturesRef.current.push(loadedTexture);
              setLoadedTextures(prev => [...prev, texturePath]);
              resolveOuter();
            },
            undefined,
            (errorEvent) => {
              console.warn(`[LoadingManager] Error loading texture via THREE.TextureLoader: ${texturePath}`, errorEvent);
              errorCount++;
              resolveOuter();
            }
          );
        }).then(() => {
          console.log(`[LoadingManager] Promise for ${texturePath} resolved. Calling updateProgress.`);
          updateProgress();
        }).catch(error => {
          console.error(`[LoadingManager] Critical error in Promise chain for ${texturePath}:`, error);
          errorCount++;
          updateProgress();
        });
      });
      
      console.log('[LoadingManager] Waiting for all texture promises...');
      await Promise.all(texturePromises);
      console.log('[LoadingManager] All texture promises have completed (resolved or rejected and caught).');
    };

    // Start loading assets
    const loadAllAssets = async () => {
      try {
        await loadTextures();
        // Add other asset loading functions here if needed (models, audio, etc.)
      } catch (error) {
        console.error('[LoadingManager] Error during asset loading:', error);
        setError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    loadAllAssets();

    // Cleanup function
    return () => {
      console.log('[LoadingManager] Component unmounting');
      // Dispose of all loaded textures
      loadedTexturesRef.current.forEach(texture => {
        texture.dispose();
      });
      loadedTexturesRef.current = [];
    };
  }, []);

  useEffect(() => {
    console.log('[LoadingManager] State changed - isLoading:', isLoading, 'progress:', progress);
  }, [isLoading, progress]);

  console.log('[LoadingManager] Render - isLoading:', isLoading, 'progress:', progress);

  // Show error state if loading failed
  if (error) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Loading Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <LoadingContext.Provider value={{ isLoading, progress, loadedTextures }}>
      {isLoading ? <LoadingScreen progress={progress} /> : children}
    </LoadingContext.Provider>
  );
} 