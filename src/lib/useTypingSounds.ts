let audioContext: AudioContext | null = null;
let soundsEnabled = true;

export type TypingSoundStyle = "mechanical" | "soft" | "typewriter" | "retro";
const SOUND_STYLE_STORAGE_KEY = "typeittestit:typing-sound-style";
let typingSoundStyle: TypingSoundStyle = "mechanical";
let soundStyleLoaded = false;

const VALID_SOUND_STYLES = new Set<TypingSoundStyle>(["mechanical", "soft", "typewriter", "retro"]);

export function getTypingSoundStyle(): TypingSoundStyle {
  // localStorage is read only once, never from the per-keystroke audio path.
  if (!soundStyleLoaded) {
    soundStyleLoaded = true;
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(SOUND_STYLE_STORAGE_KEY) as TypingSoundStyle | null;
        if (saved && VALID_SOUND_STYLES.has(saved)) typingSoundStyle = saved;
      } catch {
        // Keep the in-memory default if storage is unavailable.
      }
    }
  }
  return typingSoundStyle;
}

export function setTypingSoundStyle(style: TypingSoundStyle): void {
  if (!VALID_SOUND_STYLES.has(style)) return;
  typingSoundStyle = style;
  soundStyleLoaded = true;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_STYLE_STORAGE_KEY, style);
  } catch {
    // Sound selection still works for this page even when storage is unavailable.
  }
}

const TYPING_SOUND_URLS: Record<TypingSoundStyle, string> = {
  mechanical: "/sounds/typing-mechanical.mp3",
  soft: "/sounds/typing-soft.mp3",
  typewriter: "/sounds/typing-typewriter.mp3",
  retro: "/sounds/typing-retro.mp3",
};
const WRONG_SOUND_URL = "/sounds/typing-error.mp3";

type TypingAudioPool = { audio: HTMLAudioElement[]; nextIndex: number };
const typingAudioPools = new Map<string, TypingAudioPool>();
const TYPING_AUDIO_POOL_SIZE = 8;
const sampleBuffers = new Map<string, AudioBuffer>();
const sampleLoads = new Map<string, Promise<AudioBuffer | null>>();

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const C = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!C) return null;
  if (!audioContext) audioContext = new C();
  return audioContext;
}

export function getTypingSoundsEnabled(): boolean { return soundsEnabled; }
export function setTypingSoundsEnabled(enabled: boolean): void {
  soundsEnabled = enabled;
  if (!enabled) stopTypingSamples();
}

function getTypingAudioPool(src: string): TypingAudioPool | null {
  const existing = typingAudioPools.get(src);
  if (existing) return existing;
  if (typeof window === "undefined" || typeof Audio === "undefined") return null;

  const audio = Array.from({ length: TYPING_AUDIO_POOL_SIZE }, () => {
    const element = new Audio(src);
    element.preload = "auto";
    element.setAttribute("playsinline", "");
    element.load();
    return element;
  });
  const pool: TypingAudioPool = { audio, nextIndex: 0 };
  typingAudioPools.set(src, pool);
  return pool;
}

function stopTypingSamples(): void {
  for (const pool of typingAudioPools.values()) {
    for (const audio of pool.audio) {
      audio.pause();
      try { audio.currentTime = 0; } catch { /* Metadata may not be ready yet. */ }
    }
  }
}

/** Resume Web Audio for result tones and warm the locally hosted one-shot samples. */
export function unlockTypingSounds(): void {
  const c = getContext();
  if (c && c.state !== "running") void c.resume().catch(() => undefined);
  preloadTypingSounds();
}

function tone(
  frequency: number,
  duration: number,
  volume: number,
  waveform: OscillatorType = "sine",
  endFrequency?: number,
): void {
  const c = getContext();
  if (!c || !soundsEnabled) return;

  const play = () => {
    if (!soundsEnabled || c.state !== "running") return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(frequency, now);
    if (endFrequency && endFrequency > 0) {
      osc.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.008);
  };

  if (c.state === "running") play();
  else void c.resume().then(play).catch(() => undefined);
}

/** Preload the selected key sample plus the dedicated wrong-key sample. */
export function preloadTypingSounds(): void {
  if (typeof window === "undefined") return;
  getTypingAudioPool(TYPING_SOUND_URLS[getTypingSoundStyle()]);
  getTypingAudioPool(WRONG_SOUND_URL);
}

function loadSampleBuffer(src: string): Promise<AudioBuffer | null> {
  const existing = sampleBuffers.get(src);
  if (existing) return Promise.resolve(existing);

  const pending = sampleLoads.get(src);
  if (pending) return pending;

  const c = getContext();
  if (!c) return Promise.resolve(null);

  const request = fetch(src, { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`Could not load sound: ${response.status}`);
      return response.arrayBuffer();
    })
    .then((data) => c.decodeAudioData(data))
    .then((buffer) => {
      sampleBuffers.set(src, buffer);
      return buffer;
    })
    .catch(() => null)
    .finally(() => {
      sampleLoads.delete(src);
    });

  sampleLoads.set(src, request);
  return request;
}

/** Decode result sounds early so they are ready when a timed test ends. */
export function preloadSoundSamples(srcs: readonly string[]): void {
  if (typeof window === "undefined") return;
  for (const src of srcs) void loadSampleBuffer(src);
}

/**
 * Play a decoded MP3 through the same AudioContext that typing unlocks.
 * HTMLAudioElement.play() is commonly blocked when it runs a minute after the
 * user's last click, which made WPM-specific result sounds fail on mobile.
 */
export function playSoundSample(src: string, volume: number = 1): void {
  if (!soundsEnabled) return;
  const c = getContext();
  if (!c) return;

  const play = (buffer: AudioBuffer) => {
    if (!soundsEnabled || c.state !== "running") return;
    const source = c.createBufferSource();
    const gain = c.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), c.currentTime);
    source.connect(gain);
    gain.connect(c.destination);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
    source.start();
  };

  const playReadySound = () => {
    const buffer = sampleBuffers.get(src);
    if (buffer) {
      play(buffer);
      return;
    }
    void loadSampleBuffer(src).then((loaded) => {
      if (loaded) play(loaded);
    });
  };

  if (c.state === "running") playReadySound();
  else void c.resume().then(playReadySound).catch(() => undefined);
}

function fallbackTypingTone(kind: "correct" | "wrong", style: TypingSoundStyle): void {
  if (kind === "wrong") {
    tone(185, 0.075, 0.055, "triangle", 115);
    return;
  }
  switch (style) {
    case "soft":
      tone(660, 0.045, 0.035, "sine");
      break;
    case "typewriter":
      tone(830, 0.055, 0.052, "triangle", 600);
      break;
    case "retro":
      tone(520, 0.035, 0.045, "square", 360);
      break;
    default:
      tone(410, 0.032, 0.052, "square", 280);
  }
}

function playTypingSample(
  src: string,
  volume: number,
  playbackRate: number,
  maxDurationMs: number,
  fallback: () => void,
): void {
  if (!soundsEnabled) return;
  const pool = getTypingAudioPool(src);
  if (!pool) {
    fallback();
    return;
  }

  const audio = pool.audio[pool.nextIndex];
  pool.nextIndex = (pool.nextIndex + 1) % pool.audio.length;
  audio.volume = Math.max(0, Math.min(1, volume));
  audio.playbackRate = playbackRate;
  try { audio.currentTime = 0; } catch { /* Metadata can load after first interaction. */ }

  // Call play directly from the input event. The pool supports overlapping
  // fast keystrokes without allocating an AudioBufferSourceNode per character.
  const playback = audio.play();
  const trimPlayback = () => {
    window.setTimeout(() => {
      if (audio.paused) return;
      audio.pause();
      try { audio.currentTime = 0; } catch { /* Ignore early media state. */ }
    }, maxDurationMs);
  };

  if (playback && typeof playback.then === "function") {
    void playback.then(() => {
      if (!soundsEnabled) {
        audio.pause();
        return;
      }
      trimPlayback();
    }).catch(() => fallback());
  } else {
    trimPlayback();
  }
}

/** Play a bundled sample for every accepted keystroke. */
export function playTypingKeySound(kind: "correct" | "wrong"): void {
  if (!soundsEnabled) return;
  const style = getTypingSoundStyle();

  if (kind === "wrong") {
    playTypingSample(WRONG_SOUND_URL, 0.42, 1, 260, () => fallbackTypingTone("wrong", style));
    return;
  }

  const settings: Record<TypingSoundStyle, { volume: number; rate: number; duration: number }> = {
    mechanical: { volume: 0.82, rate: 1, duration: 125 },
    soft: { volume: 0.58, rate: 0.88, duration: 140 },
    typewriter: { volume: 0.78, rate: 1, duration: 190 },
    retro: { volume: 0.72, rate: 1.12, duration: 145 },
  };
  const selected = settings[style];
  playTypingSample(
    TYPING_SOUND_URLS[style],
    selected.volume,
    selected.rate,
    selected.duration,
    () => fallbackTypingTone("correct", style),
  );
}

export function playTypingSound(type: "key" | "error" | "backspace"): void {
  if (type === "error") {
    playTypingKeySound("wrong");
    return;
  }
  if (type === "key") playTypingKeySound("correct");
  else tone(330, 0.06, 0.025);
}

export function playTestCompleteSound(): void {
  if (!soundsEnabled) return;
  tone(392, 0.18, 0.06);
  window.setTimeout(() => tone(523.25, 0.28, 0.065), 100);
}
