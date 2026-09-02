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

export function playTypingSound(type: "key" | "error" | "backspace"): void {
  const context = getAudioContext();
  if (!context) return;

  try {
    if (context.state !== "running") void context.resume();

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const settings = {
      key: { frequency: 175, duration: 0.045, volume: 0.075 },
      error: { frequency: 115, duration: 0.06, volume: 0.06 },
      backspace: { frequency: 135, duration: 0.05, volume: 0.065 },
    }[type];

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(settings.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(40, settings.frequency * 0.68),
      now + settings.duration
    );

    gain.gain.setValueAtTime(settings.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + settings.duration);
  } catch {
    // Sound is decorative only. Never allow audio errors to affect typing.
  }
}
