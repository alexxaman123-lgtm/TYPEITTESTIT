let audioContext: AudioContext | null = null;
let soundsEnabled = true;

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
  if (c && c.state !== "running") void c.resume();
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
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  };
  if (c.state !== "running") void c.resume().then(play).catch(() => undefined);
  else play();
}

export function playTypingSound(type: "key" | "error" | "backspace"): void {
  if (type === "error") return;
  if (type === "key") tone(440, 0.12, 0.055);
  else tone(330, 0.10, 0.045);
}

export function playTestCompleteSound(): void {
  if (!soundsEnabled) return;
  tone(392, 0.18, 0.06);
  window.setTimeout(() => tone(523.25, 0.28, 0.065), 100);
}
