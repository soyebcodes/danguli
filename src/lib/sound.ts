import { Howl } from "howler";

const createAudioContext = () => {
  const AudioCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioCtor) {
    return null;
  }

  return new AudioCtor();
};

export const playRickshawBell = () => {
  try {
    const ctx = createAudioContext();
    if (!ctx) {
      const fallback = new Howl({
        src: [
          "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=",
        ],
      });
      fallback.play();
      return;
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 780;
    gainNode.gain.value = 0.04;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.18);
  } catch {
    // Browser autoplay restrictions can block audio until the user interaction occurs.
  }
};

export const playDustWhistle = () => {
  try {
    const ctx = createAudioContext();
    if (!ctx) {
      return;
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(119, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      40,
      ctx.currentTime + 0.16,
    );
    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.18);
  } catch {
    // Ignore audio failures when browser policies block playback.
  }
};
