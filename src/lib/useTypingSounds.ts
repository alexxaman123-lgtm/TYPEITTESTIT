let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  return audioContext;
}

function playTone(
  context: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
): void {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(40, frequency * 0.65),
    now + duration
  );

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.005);
}

export function unlockTypingSounds(): void {
  const context = getAudioContext();
  if (!context) return;
  try {
    if (context.state === "suspended") void context.resume();
  } catch {
    // Sound is decorative only. Never affect typing behavior.
  }
}

export function playTypingSound(type: "key" | "error" | "backspace"): void {
  const context = getAudioContext();
  if (!context) return;

  const settings = {
    key: { frequency: 220, duration: 0.055, volume: 0.055 },
    error: { frequency: 125, duration: 0.075, volume: 0.05 },
    backspace: { frequency: 165, duration: 0.065, volume: 0.05 },
  }[type];

  try {
    if (context.state === "suspended") {
      void context.resume().then(() => {
        playTone(context, settings.frequency, settings.duration, settings.volume);
      }).catch(() => undefined);
      return;
    }
    playTone(context, settings.frequency, settings.duration, settings.volume);
  } catch {
    // Sound is decorative only. Never affect typing behavior.
  }
}
