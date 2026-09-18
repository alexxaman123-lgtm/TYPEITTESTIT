let audioContext: AudioContext | null = null;
let soundsEnabled = true;

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

function tone(frequency: number, duration: number, volume: number): void {
  const c = getContext();
  if (!c || !soundsEnabled) return;

  const play = () => {
    if (!soundsEnabled || c.state !== "running") return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.002);
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

/** Start decoding both typing sounds without ever blocking the key event path. */
export function preloadTypingSounds(): void {
  if (typeof window === "undefined") return;
  void loadTypingBuffer("correct");
  void loadTypingBuffer("wrong");
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

  // Any later keystroke immediately fades an earlier long error sample, so a
  // run of mistakes can never keep ringing over subsequent correct letters.
  stopActiveWrongSound();

  const playReadySound = () => {
    if (!soundsEnabled) return;
    if (playBuffer(kind, kind === "correct" ? 0.72 : 0.09)) return;

    const fallback = kind === "correct" ? [440, 0.045, 0.032] as const : [270, 0.035, 0.02] as const;
    tone(fallback[0], fallback[1], fallback[2]);
    void loadTypingBuffer(kind);
  };

  // Android/iOS commonly keep a preloaded AudioContext suspended. Resume
  // first, then retry the decoded sample; the old order always selected the
  // synthesized fallback even when the real buffer was already available.
  if (c.state === "running") playReadySound();
  else void c.resume().then(playReadySound).catch(() => undefined);
}

export function playTypingSound(type: "key" | "error" | "backspace"): void {
  if (type === "error") return;
  if (type === "key") playTypingKeySound("correct");
  else tone(330, 0.06, 0.025);
}

export function playTestCompleteSound(): void {
  if (!soundsEnabled) return;
  tone(392, 0.18, 0.06);
  window.setTimeout(() => tone(523.25, 0.28, 0.065), 100);
}
