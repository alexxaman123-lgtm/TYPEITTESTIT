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

type TypingBufferKind = "correct" | "wrong";

const TYPING_SOUND_URLS: Record<TypingBufferKind, string> = {
  // Use the already encoded asset path. The literal brackets trigger a 307
  // normalization redirect at Cloudflare, which adds avoidable delay before
  // decoding on mobile browsers.
  correct: "/koiroylers-keyboard-press-351952_%5Bcut_0sec%5D.mp3",
  wrong: "/piano-noise-suprise.mp3",
};

const typingBuffers = new Map<TypingBufferKind, AudioBuffer>();
const typingLoads = new Map<TypingBufferKind, Promise<AudioBuffer | null>>();
const sampleBuffers = new Map<string, AudioBuffer>();
const sampleLoads = new Map<string, Promise<AudioBuffer | null>>();
let activeWrongSource: {
  source: AudioBufferSourceNode;
  gain: GainNode;
} | null = null;

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
  if (!enabled) stopActiveWrongSound();
}

function stopActiveWrongSound(): void {
  const active = activeWrongSource;
  if (!active) return;
  activeWrongSource = null;

  const c = audioContext;
  if (!c || c.state === "closed") return;
  const now = c.currentTime;
  try {
    active.gain.gain.cancelScheduledValues(now);
    active.gain.gain.setTargetAtTime(0.0001, now, 0.004);
    active.source.stop(now + 0.025);
  } catch {
    // The source may already have ended between the key event and this call.
  }
}

export function unlockTypingSounds(): void {
  const c = getContext();
  if (!c) return;
  if (c.state === "running") return;

  // Scheduling a silent frame from the actual pointer/focus gesture primes
  // Web Audio on iOS Safari as well as Chrome on Android.
  try {
    const source = c.createBufferSource();
    source.buffer = c.createBuffer(1, 1, c.sampleRate);
    source.connect(c.destination);
    source.start(0);
  } catch {
    // resume() below is still the primary unlock path.
  }
  void c.resume().catch(() => undefined);
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

function loadTypingBuffer(kind: TypingBufferKind): Promise<AudioBuffer | null> {
  const existing = typingBuffers.get(kind);
  if (existing) return Promise.resolve(existing);

  const pending = typingLoads.get(kind);
  if (pending) return pending;

  const c = getContext();
  if (!c) return Promise.resolve(null);

  const request = fetch(TYPING_SOUND_URLS[kind], { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`Could not load typing sound: ${response.status}`);
      return response.arrayBuffer();
    })
    .then((data) => c.decodeAudioData(data))
    .then((buffer) => {
      typingBuffers.set(kind, buffer);
      return buffer;
    })
    .catch(() => null)
    .finally(() => {
      typingLoads.delete(kind);
    });

  typingLoads.set(kind, request);
  return request;
}

/** Start decoding the typing sound without ever blocking the key event path. */
export function preloadTypingSounds(): void {
  if (typeof window === "undefined") return;
  // Prepare both paths before the user starts typing; the first mistake should
  // not have to wait for a network request or audio decode.
  void loadTypingBuffer("correct");
  void loadTypingBuffer("wrong");
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

function playBuffer(kind: TypingBufferKind, volume: number): boolean {
  const c = getContext();
  const buffer = typingBuffers.get(kind);
  if (!c || !buffer || !soundsEnabled || c.state !== "running") return false;

  stopActiveWrongSound();
  const source = c.createBufferSource();
  const gain = c.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), c.currentTime);
  source.connect(gain);
  gain.connect(c.destination);

  // The click MP3 contains about 125 ms of leading silence. Starting at its
  // audible portion makes feedback immediate, particularly on mobile.
  const offset = kind === "correct" ? Math.min(0.125, Math.max(0, buffer.duration - 0.01)) : 0;
  source.start(0, offset);
  if (kind === "wrong") {
    activeWrongSource = { source, gain };
    source.onended = () => {
      if (activeWrongSource?.source === source) activeWrongSource = null;
      source.disconnect();
      gain.disconnect();
    };
  } else {
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
  }
  return true;
}

/**
 * Low-latency key sound path. Decoded AudioBuffers are played directly through
 * Web Audio instead of creating/loading/resetting HTMLAudioElement instances on
 * every keystroke. A tiny synthesized fallback keeps feedback immediate while
 * the MP3 buffer is still loading, including on mobile Safari/Chrome.
 */
export function playTypingKeySound(kind: TypingBufferKind): void {
  if (!soundsEnabled) return;
  const c = getContext();
  if (!c) return;

  // Resume once from a user gesture; don't fall back to a different sound
  // just because a mobile browser had suspended the shared context.
  if (c.state !== "running") {
    void c.resume().then(() => playTypingKeySound(kind)).catch(() => undefined);
    return;
  }

  const style = getTypingSoundStyle();
  if (style === "soft") {
    if (kind === "wrong") {
      stopActiveWrongSound();
      tone(215, 0.055, 0.026, "sine", 145);
    } else {
      tone(660, 0.028, 0.018, "sine");
    }
    return;
  }

  if (style === "typewriter") {
    if (kind === "wrong") {
      stopActiveWrongSound();
      tone(250, 0.075, 0.032, "triangle", 125);
    } else {
      tone(1180, 0.022, 0.022, "triangle");
    }
    return;
  }

  if (style === "retro") {
    if (kind === "wrong") {
      stopActiveWrongSound();
      tone(260, 0.065, 0.024, "square", 165);
    } else {
      tone(560, 0.032, 0.018, "square");
    }
    return;
  }

  // Mechanical uses the real keyboard press sample and a distinct error sample.
  // If a buffer is still decoding, give immediate synthesized feedback instead
  // of waiting for it; subsequent keys use the decoded sample.
  if (kind === "wrong") {
    stopActiveWrongSound();
    if (playBuffer("wrong", 0.22)) return;
    tone(196, 0.05, 0.028, "sine", 140);
    void loadTypingBuffer("wrong");
    return;
  }

  if (playBuffer("correct", 0.72)) return;
  tone(440, 0.045, 0.032, "sine");
  void loadTypingBuffer("correct");
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
