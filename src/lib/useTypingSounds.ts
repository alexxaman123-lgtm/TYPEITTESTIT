let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

export function playTypingSound(type: "key" | "error" | "backspace"): void {
  const context = getAudioContext();
  if (!context) return;

  try {
    if (context.state === "suspended") void context.resume();

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const settings = {
      key: { frequency: 150, duration: 0.035, volume: 0.025 },
      error: { frequency: 105, duration: 0.045, volume: 0.02 },
      backspace: { frequency: 125, duration: 0.04, volume: 0.022 },
    }[type];

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(settings.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(settings.frequency * 0.72, now + settings.duration);

    gain.gain.setValueAtTime(settings.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + settings.duration);
  } catch {
    // Audio is purely decorative; never let it affect typing behavior.
  }
}
