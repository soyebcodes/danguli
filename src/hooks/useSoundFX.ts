'use client';

import { useCallback } from 'react';

const getAudioContext = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioCtor =
    window.AudioContext ||
    (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

  return AudioCtor ? new AudioCtor() : null;
};

export function useSoundFX() {
  const playBell = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) {
        return;
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.value = 780;
      gainNode.gain.value = 0.04;

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.18);
    } catch {
      // Audio may be blocked by browser autoplay policies until a user gesture occurs.
    }
  }, []);

  const playWhistle = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) {
        return;
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(120, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore blocked audio contexts gracefully.
    }
  }, []);

  return { playBell, playWhistle };
}
