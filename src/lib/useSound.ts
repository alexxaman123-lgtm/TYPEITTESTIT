import { useCallback, useRef } from "react";

let soundEnabled = true;

export function getSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((src: string, volume: number = 1.0) => {
    if (!soundEnabled) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }

    const audio = audioRef.current;
    audio.src = src;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.currentTime = 0;

    void audio.play().catch(() => {
      // Sound is decorative only. Never affect typing behavior.
    });
  }, []);

  return { playSound };
}
