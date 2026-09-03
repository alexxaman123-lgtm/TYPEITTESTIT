import { useCallback, useRef } from "react";

type SoundPool = {
  src: string;
  audio: HTMLAudioElement[];
  nextIndex: number;
};

let soundEnabled = true;
const pools = new Map<string, SoundPool>();
const POOL_SIZE = 8;

export function getSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (!enabled) stopSound();
}

function getPool(src: string): SoundPool {
  let pool = pools.get(src);
  if (!pool) {
    pool = {
      src,
      audio: Array.from({ length: POOL_SIZE }, () => {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.load();
        return audio;
      }),
      nextIndex: 0,
    };
    pools.set(src, pool);
  }
  return pool;
}

export function stopSound(src?: string): void {
  const targets = src ? [pools.get(src)] : Array.from(pools.values());
  for (const pool of targets) {
    if (!pool) continue;
    for (const audio of pool.audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
}

export function useSound() {
  const playSound = useCallback((src: string, volume: number = 1.0) => {
    if (!soundEnabled) return;

    const pool = getPool(src);
    const audio = pool.audio[pool.nextIndex];
    pool.nextIndex = (pool.nextIndex + 1) % pool.audio.length;

    audio.volume = Math.max(0, Math.min(1, volume));
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Sound is decorative only. Never affect typing behavior.
    });
  }, []);

  return { playSound, stopSound };
}
