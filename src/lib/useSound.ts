import { useCallback, useRef } from "react";

let soundEnabled = true;

export function getSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function useSound() {
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const nextIndexRef = useRef(0);

  const playSound = useCallback((src: string, volume: number = 1.0) => {
    if (!soundEnabled) return;

    const pool = audioPoolRef.current;
    const poolSize = 6;

    if (pool.length < poolSize) {
      while (pool.length < poolSize) {
        const audio = new Audio();
        audio.preload = "auto";
        pool.push(audio);
      }
    }

    const audio = pool[nextIndexRef.current % pool.length];
    nextIndexRef.current = (nextIndexRef.current + 1) % pool.length;

    audio.pause();
    audio.src = src;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.currentTime = 0;

    void audio.play().catch(() => {
      // Sound is decorative only. Never affect typing behavior.
    });
  }, []);

  return { playSound };
}
