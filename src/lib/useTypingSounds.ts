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

export function unlockTypingSounds(): void {
  const context = getAudioContext();
  if (!context) return;
  try {
    if (context.state !== "running") void context.resume();
  } catch {
    // Sound is decorative only. Never affect typing behavior.
  }
}

function playMechanicalClick(
  context: AudioContext,
  startFrequency: number,
  endFrequency: number,
  duration: number,
  volume: number,
  noiseVolume: number,
): void {
  const now = context.currentTime;

  const oscillator = context.createOscillator();
  const oscillatorGain = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
  oscillatorGain.gain.setValueAtTime(0.0001, now);
  oscillatorGain.gain.exponentialRampToValueAtTime(volume, now + 0.002);
  oscillatorGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(oscillatorGain);
  oscillatorGain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.004);

  const noiseBuffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * 0.014)), context.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    const envelope = 1 - i / noiseData.length;
    noiseData[i] = (Math.random() * 2 - 1) * envelope * envelope;
  }

  const noise = context.createBufferSource();
  const noiseFilter = context.createBiquadFilter();
  const noiseGain = context.createGain();
  noise.buffer = noiseBuffer;
  noiseFilter.type = "highpass";
  noiseFilter.frequency.setValueAtTime(1200, now);
  noiseGain.gain.setValueAtTime(noiseVolume, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(context.destination);
  noise.start(now);
}

export function playTypingSound(type: "key" | "error" | "backspace"): void {
  const context = getAudioContext();
  if (!context) return;

  const settings = {
    key: { start: 2050, end: 920, duration: 0.052, volume: 0.09, noise: 0.055 },
    error: { start: 560, end: 250, duration: 0.075, volume: 0.075, noise: 0.035 },
    backspace: { start: 1180, end: 470, duration: 0.058, volume: 0.08, noise: 0.04 },
  }[type];

  try {
    if (context.state !== "running") {
      void context.resume().then(() => {
        if (context.state === "running") {
          playMechanicalClick(context, settings.start, settings.end, settings.duration, settings.volume, settings.noise);
        }
      }).catch(() => undefined);
      return;
    }
    playMechanicalClick(context, settings.start, settings.end, settings.duration, settings.volume, settings.noise);
  } catch {
    // Sound is decorative only. Never affect typing behavior.
  }
}
