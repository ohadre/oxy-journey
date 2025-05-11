'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as THREE from 'three';
import { LoadingScreen } from './LoadingScreen';

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  loadedTextures: string[];
}

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
    globalTextureLoader.load(
      path,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
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
        
        // Start transition after loading
        setIsTransitioning(true);
        
        // Add a longer delay for smoother transition
        setTimeout(() => {
          console.log('[LoadingManager] Setting isLoading to false');
          setIsLoading(false);
        }, 1000);
      }
    };

    // Load textures
    const loadTextures = async () => {
      setLoadingPhase('textures');
      console.log('[LoadingManager] Loading textures...');
      
      // Load all textures simultaneously
      const texturePromises = textures.map((texturePath, i) => {
        console.log(`[LoadingManager] Starting to load texture (${i+1}/${textures.length}): ${texturePath}`);
        
        return new Promise<void>((resolve) => {
          globalTextureLoader.load(
            texturePath,
            (texture) => {
              console.log('[LoadingManager] Successfully loaded texture:', texturePath);
              texture.colorSpace = THREE.SRGBColorSpace;
              // Force the texture to be fully created in WebGL
              texture.needsUpdate = true;
              setLoadedTextures(prev => [...prev, texturePath]);
              resolve();
            },
            (progressEvent) => {
              // Progress callback (if supported)
            },
            (error) => {
              console.warn('[LoadingManager] Error loading texture:', texturePath, error);
              errorCount++;
              resolve(); // Resolve even on error to continue loading
            }
          );
        }).then(() => {
          updateProgress();
        }).catch(error => {
          console.error('[LoadingManager] Exception loading texture:', texturePath, error);
          errorCount++;
          updateProgress();
        });
      });
      
      await Promise.all(texturePromises);
    };

    // Start loading assets
    const loadAllAssets = async () => {
      try {
        await loadTextures();
        // Add other asset loading functions here if needed (models, audio, etc.)
      } catch (error) {
        console.error('[LoadingManager] Error during asset loading:', error);
      }
    };

    loadAllAssets();

    // Cleanup function
    return () => {
      console.log('[LoadingManager] Component unmounting');
    };
  }, []);

  useEffect(() => {
    console.log('[LoadingManager] State changed - isLoading:', isLoading, 'progress:', progress);
  }, [isLoading, progress]);

  console.log('[LoadingManager] Render - isLoading:', isLoading, 'progress:', progress);

  return (
    <LoadingContext.Provider value={{ isLoading, progress, loadedTextures }}>
      {isLoading ? <LoadingScreen progress={progress} /> : children}
    </LoadingContext.Provider>
  );
} 