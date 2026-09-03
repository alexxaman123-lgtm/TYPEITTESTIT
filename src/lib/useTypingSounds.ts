let audioContext: AudioContext | null = null;
let soundsEnabled = true;

type TypingBufferKind = "correct" | "wrong";

const TYPING_SOUND_URLS: Record<TypingBufferKind, string> = {
  correct: "/koiroylers-keyboard-press-351952_[cut_0sec].mp3",
  wrong: "/piano-noise-suprise.mp3",
};

const typingBuffers = new Map<TypingBufferKind, AudioBuffer>();
const typingLoads = new Map<TypingBufferKind, Promise<AudioBuffer | null>>();

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const C = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!C) return null;
  if (!audioContext) audioContext = new C();
  return audioContext;
}

export function getTypingSoundsEnabled(): boolean { return soundsEnabled; }
export function setTypingSoundsEnabled(enabled: boolean): void { soundsEnabled = enabled; }

export function unlockTypingSounds(): void {
  const c = getContext();
  if (!c) return;
  if (c.state !== "running") void c.resume().catch(() => undefined);
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

  const source = c.createBufferSource();
  const gain = c.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), c.currentTime);
  source.connect(gain);
  gain.connect(c.destination);
  source.start(0);
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

  if (playBuffer(kind, kind === "correct" ? 0.72 : 0.09)) return;

  const fallback = kind === "correct" ? [440, 0.045, 0.032] as const : [270, 0.035, 0.02] as const;
  tone(fallback[0], fallback[1], fallback[2]);
  void loadTypingBuffer(kind);
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
