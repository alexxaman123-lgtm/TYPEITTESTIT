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

function playPianoNote(context: AudioContext, frequency: number, duration = 0.18, volume = 0.052): void {
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(volume, now + 0.004);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  master.connect(context.destination);

  const partials = [
    { multiple: 1, gain: 1, type: "triangle" as OscillatorType },
    { multiple: 2, gain: 0.22, type: "sine" as OscillatorType },
    { multiple: 3, gain: 0.08, type: "sine" as OscillatorType },
    { multiple: 4, gain: 0.025, type: "sine" as OscillatorType },
  ];

  partials.forEach(({ multiple, gain: partialGain, type }) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency * multiple, now);
    gain.gain.setValueAtTime(partialGain, now);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  });
}

function playGoatBleat(context: AudioContext): void {
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.1, now + 0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
  master.connect(context.destination);

  const voice = context.createOscillator();
  const wobble = context.createOscillator();
  const wobbleGain = context.createGain();
  voice.type = "sawtooth";
  wobble.type = "sine";
  wobble.frequency.setValueAtTime(8.5, now);
  wobbleGain.gain.setValueAtTime(75, now);
  wobble.connect(wobbleGain);
  wobbleGain.connect(voice.frequency);

  voice.frequency.setValueAtTime(390, now);
  voice.frequency.exponentialRampToValueAtTime(245, now + 0.25);
  voice.frequency.exponentialRampToValueAtTime(335, now + 0.48);
  voice.frequency.exponentialRampToValueAtTime(205, now + 0.92);

  voice.connect(master);
  voice.start(now);
  wobble.start(now);
  voice.stop(now + 0.96);
  wobble.stop(now + 0.96);
}

export function playTypingSound(type: "key" | "error" | "backspace"): void {
  if (!soundsEnabled) return;
  const context = getAudioContext();
  if (!context) return;

  const pianoNotes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
  const note = pianoNotes[Math.floor(Math.random() * pianoNotes.length)];

  const play = () => {
    if (!soundsEnabled || context.state !== "running") return;
    if (type === "key") playPianoNote(context, note, 0.18, 0.052);
    else if (type === "backspace") playPianoNote(context, note * 0.75, 0.13, 0.04);
    else playPianoNote(context, 185, 0.1, 0.032);
  };

  try {
    if (context.state !== "running") {
      void context.resume().then(play).catch(() => undefined);
      return;
    }
    play();
  } catch {
    // Sound is decorative only. Never affect typing behavior.
  }
}

export function playTestCompleteSound(): void {
  if (!soundsEnabled) return;
  const context = getAudioContext();
  if (!context) return;

  const play = () => {
    if (!soundsEnabled || context.state !== "running") return;
    playGoatBleat(context);
  };

  try {
    if (context.state !== "running") {
      void context.resume().then(play).catch(() => undefined);
      return;
    }
    play();
  } catch {
    // Sound is decorative only. Never affect typing behavior.
  }
}
