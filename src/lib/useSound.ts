import { useCallback, useRef } from "react";

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((src: string, volume: number = 1.0) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    audio.src = src;
    audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    audio.currentTime = 0;
    
    // Play and handle any errors silently
    audio.play().catch(() => {
      // Silently fail if audio can't play (e.g., autoplay restrictions)
    });
  }, []);

  return { playSound };
}
