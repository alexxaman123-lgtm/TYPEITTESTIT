let audioContext: AudioContext | null = null;
let soundsEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  return audioContext;
}

export function getTypingSoundsEnabled(): boolean {
  return soundsEnabled;
}

export function setTypingSoundsEnabled(enabled: boolean): void {
  soundsEnabled = enabled;
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
  oscillatorGain.gain.exponentialRampToValueAtTime(volume, now + 0.0015);
  oscillatorGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(oscillatorGain);
  oscillatorGain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.004);

  const noiseBuffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * 0.012)), context.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    const envelope = 1 - i / noiseData.length;
    noiseData[i] = (Math.random() * 2 - 1) * envelope * envelope;
  }

  const noise = context.createBufferSource();
  const noiseFilter = context.createBiquadFilter();
  const noiseGain = context.createGain();
  noise.buffer = noiseBuffer;
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(2800, now);
  noiseFilter.Q.setValueAtTime(1.3, now);
  noiseGain.gain.setValueAtTime(noiseVolume, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(context.destination);
  noise.start(now);
}

export function playTypingSound(type: "key" | "error" | "backspace"): void {
  if (!soundsEnabled) return;

  const context = getAudioContext();
  if (!context) return;

  const settings = {
    key: { start: 2450, end: 760, duration: 0.048, volume: 0.085, noise: 0.07 },
    error: { start: 520, end: 220, duration: 0.07, volume: 0.06, noise: 0.04 },
    backspace: { start: 1350, end: 420, duration: 0.055, volume: 0.065, noise: 0.045 },
  }[type];

  try {
    if (context.state !== "running") {
      void context.resume().then(() => {
        if (soundsEnabled && context.state === "running") {
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
