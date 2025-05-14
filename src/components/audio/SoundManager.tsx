"use client";

console.log('SoundManager.tsx: ABSOLUTE MINIMUM - MODULE LEVEL EXECUTION. Version Minified');

const SoundManager = (props: any) => {
  console.log("SoundManager: ABSOLUTE MINIMUM - Component function CALLED. Version Minified");
  
  // Directly try to call onLoaded if it exists, from within the component body (not ideal React, but for extreme debugging)
  if (props.onLoaded) {
    console.log("SoundManager (Absolute Minimum): Attempting to call props.onLoaded. Version Minified");
    try {
      props.onLoaded();
    } catch (e: any) {
      console.error("SoundManager (Absolute Minimum): Error calling props.onLoaded:", e);
    }
  }
  
  return null; // Or <group /> if needed for R3F parent
};

(SoundManager as any).magicProperty = "Hello from SoundManager ABSOLUTE MINIMUM Version Minified";

export default SoundManager; 