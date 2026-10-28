let audioContext: AudioContext | null = null;
let soundsEnabled = true;

export type TypingSoundStyle = "mechanical" | "soft" | "typewriter" | "retro" | "soft-piano" | "dreamy-piano";
const SOUND_STYLE_STORAGE_KEY = "typeittestit:typing-sound-style";
let typingSoundStyle: TypingSoundStyle = "mechanical";
let soundStyleLoaded = false;

const VALID_SOUND_STYLES = new Set<TypingSoundStyle>(["mechanical", "soft", "typewriter", "retro", "soft-piano", "dreamy-piano"]);

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
  "soft-piano": "/sounds/piano-c4.ogg",
  "dreamy-piano": "/sounds/piano-c4.ogg",
};
const WRONG_SOUND_URL = "/sounds/typing-error.mp3";
const PIANO_ERROR_URL = "/sounds/piano-c3.ogg";
const PIANO_NOTE_URLS = [
  "/sounds/piano-c4.ogg",
  "/sounds/piano-d4.ogg",
  "/sounds/piano-e4.ogg",
  "/sounds/piano-g4.ogg",
  "/sounds/piano-a4.ogg",
  "/sounds/piano-c5.ogg",
] as const;
const PIANO_FREQUENCIES = [261.63, 293.66, 329.63, 392, 440, 523.25] as const;
const isPianoStyle = (style: TypingSoundStyle) =>
  style === "soft-piano" || style === "dreamy-piano";

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

  const poolSize = src.includes("/piano-") ? 3 : TYPING_AUDIO_POOL_SIZE;
  const audio = Array.from({ length: poolSize }, () => {
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
  if (c && c.state !== "running") {
    // Prime Web Audio directly from the pointer/key gesture for Safari/mobile.
    try {
      const source = c.createBufferSource();
      source.buffer = c.createBuffer(1, 1, c.sampleRate);
      source.connect(c.destination);
      source.start(0);
    } catch {
      // resume() remains the primary unlock path.
    }
    void c.resume().catch(() => undefined);
  }
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
  const style = getTypingSoundStyle();
  if (isPianoStyle(style)) {
    PIANO_NOTE_URLS.forEach((src) => {
      getTypingAudioPool(src);
      void loadSampleBuffer(src);
    });
    getTypingAudioPool(PIANO_ERROR_URL);
    void loadSampleBuffer(PIANO_ERROR_URL);
    return;
  }
  const src = TYPING_SOUND_URLS[style];
  getTypingAudioPool(src);
  getTypingAudioPool(WRONG_SOUND_URL);
  void loadSampleBuffer(src);
  void loadSampleBuffer(WRONG_SOUND_URL);
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

function fallbackTypingTone(
  kind: "correct" | "wrong",
  style: TypingSoundStyle,
  character?: string,
): void {
  if (isPianoStyle(style)) {
    if (kind === "wrong") {
      tone(style === "dreamy-piano" ? 146.83 : 164.81, 0.12, 0.018, "sine");
      return;
    }
    const code = character?.toLowerCase().charCodeAt(0) ?? 0;
    const noteIndex = character && code >= 97 && code <= 122 ? (code - 97) % PIANO_FREQUENCIES.length : Math.abs(code) % PIANO_FREQUENCIES.length;
    const volume = style === "dreamy-piano" ? 0.055 : 0.075;
    tone(PIANO_FREQUENCIES[noteIndex], style === "dreamy-piano" ? 0.12 : 0.085, volume, "sine");
    return;
  }
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

const audioPlaybackIds = new WeakMap<HTMLAudioElement, number>();
let nextAudioPlaybackId = 1;

function playDecodedTypingSample(
  src: string,
  volume: number,
  playbackRate: number,
  maxDurationMs: number,
  fadeOutMs = 50,
): boolean {
  const c = getContext();
  const buffer = sampleBuffers.get(src);
  if (!c || !buffer || !soundsEnabled) return false;

  const play = () => {
    if (!soundsEnabled || c.state !== "running") return;
    const now = c.currentTime;
    const source = c.createBufferSource();
    const gain = c.createGain();
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(playbackRate, now);
    const duration = Math.min(maxDurationMs / 1000, buffer.duration / playbackRate);
    const fade = Math.min(fadeOutMs / 1000, duration * 0.7);
    const level = Math.max(0.0001, Math.min(1, volume));
    gain.gain.setValueAtTime(level, now);
    gain.gain.setValueAtTime(level, now + Math.max(0, duration - fade));
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);
    source.connect(gain);
    gain.connect(c.destination);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
    source.start(now);
    source.stop(now + duration + 0.015);
  };

  if (c.state !== "running") return false;
  play();
  return true;
}

function playTypingSample(
  src: string,
  volume: number,
  playbackRate: number,
  maxDurationMs: number,
  fallback: () => void,
  fadeOutMs = 35,
): void {
  if (!soundsEnabled) return;

  // Prefer decoded buffers once available: this avoids media startup delay and
  // gives piano notes a smooth release envelope.
  if (playDecodedTypingSample(src, volume, playbackRate, maxDurationMs, fadeOutMs)) return;

  const pool = getTypingAudioPool(src);
  if (!pool) {
    void loadSampleBuffer(src).then((buffer) => {
      if (buffer && playDecodedTypingSample(src, volume, playbackRate, maxDurationMs, fadeOutMs)) return;
      fallback();
    });
    return;
  }

  const audio = pool.audio[pool.nextIndex];
  pool.nextIndex = (pool.nextIndex + 1) % pool.audio.length;
  const playbackId = nextAudioPlaybackId++;
  audioPlaybackIds.set(audio, playbackId);
  const baseVolume = Math.max(0, Math.min(1, volume));
  audio.volume = baseVolume;
  audio.playbackRate = playbackRate;
  try { audio.currentTime = 0; } catch { /* Metadata may not be ready yet. */ }

  const isThisPlayback = () => audioPlaybackIds.get(audio) === playbackId;
  const finish = () => {
    if (!isThisPlayback() || audio.paused) return;
    audio.pause();
    try { audio.currentTime = 0; } catch { /* Ignore early media state. */ }
    audio.volume = baseVolume;
  };
  const trimPlayback = () => {
    const fadeStartMs = Math.max(0, maxDurationMs - Math.max(0, fadeOutMs));
    window.setTimeout(() => {
      if (!isThisPlayback() || audio.paused || fadeOutMs <= 0) return;
      const startingVolume = audio.volume;
      const steps = 4;
      for (let step = 1; step <= steps; step += 1) {
        window.setTimeout(() => {
          if (!isThisPlayback() || audio.paused) return;
          audio.volume = startingVolume * (1 - step / steps);
        }, (fadeOutMs * step) / steps);
      }
    }, fadeStartMs);
    window.setTimeout(finish, maxDurationMs);
  };

  // Try the native media element during the input event first. On failure,
  // decode the same local file through Web Audio and only then use a tone.
  let playback: Promise<void> | undefined;
  try {
    playback = audio.play();
  } catch {
    void loadSampleBuffer(src).then((buffer) => {
      if (buffer && playDecodedTypingSample(src, volume, playbackRate, maxDurationMs, fadeOutMs)) return;
      fallback();
    });
    return;
  }

  if (playback && typeof playback.then === "function") {
    void playback.then(() => {
      if (!soundsEnabled) {
        audio.pause();
        return;
      }
      trimPlayback();
    }).catch(() => {
      void loadSampleBuffer(src).then((buffer) => {
        if (buffer && playDecodedTypingSample(src, volume, playbackRate, maxDurationMs, fadeOutMs)) return;
        fallback();
      });
    });
  } else {
    trimPlayback();
  }
}

/** Play a bundled real sample for each accepted keystroke. */
export function playTypingKeySound(kind: "correct" | "wrong", character?: string): void {
  if (!soundsEnabled) return;
  const style = getTypingSoundStyle();

  if (isPianoStyle(style)) {
    if (kind === "wrong") {
      const volume = style === "dreamy-piano" ? 0.24 : 0.3;
      const duration = style === "dreamy-piano" ? 300 : 220;
      playTypingSample(PIANO_ERROR_URL, volume, style === "dreamy-piano" ? 0.92 : 1, duration,
        () => fallbackTypingTone("wrong", style, character));
      return;
    }

    // C-major pentatonic notes make the stream of keystrokes feel musical
    // without clashing as aggressively as chromatic or random pitches.
    const code = character?.toLowerCase().charCodeAt(0) ?? 0;
    const noteIndex = character && code >= 97 && code <= 122
      ? (code - 97) % PIANO_NOTE_URLS.length
      : Math.abs(code) % PIANO_NOTE_URLS.length;
    const src = PIANO_NOTE_URLS[noteIndex];
    const dreamy = style === "dreamy-piano";
    playTypingSample(
      src,
      dreamy ? 0.33 : 0.48,
      dreamy ? 0.96 : 1,
      dreamy ? 620 : 520,
      () => fallbackTypingTone("correct", style, character),
      dreamy ? 180 : 120,
    );
    if (dreamy) {
      // A quiet second tap gives each note a little room without turning
      // rapid typing into a long, overlapping sound bed.
      window.setTimeout(() => {
        if (!soundsEnabled || getTypingSoundStyle() !== "dreamy-piano") return;
        playTypingSample(
          src,
          0.12,
          0.96,
          420,
          () => undefined,
          180,
        );
      }, 58);
    }
    return;
  }

  if (kind === "wrong") {
    playTypingSample(WRONG_SOUND_URL, 0.42, 1, 260, () => fallbackTypingTone("wrong", style, character));
    return;
  }

  const settings: Record<Exclude<TypingSoundStyle, "soft-piano" | "dreamy-piano">, { volume: number; rate: number; duration: number }> = {
    mechanical: { volume: 0.82, rate: 1, duration: 125 },
    soft: { volume: 0.58, rate: 0.88, duration: 140 },
    typewriter: { volume: 0.78, rate: 1, duration: 190 },
    retro: { volume: 0.72, rate: 1.12, duration: 145 },
  };
  const selected = settings[style as keyof typeof settings];
  playTypingSample(
    TYPING_SOUND_URLS[style],
    selected.volume,
    selected.rate,
    selected.duration,
    () => fallbackTypingTone("correct", style, character),
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
