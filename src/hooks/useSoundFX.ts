'use client';

import { useCallback } from 'react';

import { useGameStore } from '@/store/gameStore';

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
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const volume = useGameStore((state) => state.volume);

  const playBell = useCallback(() => {
    if (!soundEnabled) {
      return;
    }

    try {
      const ctx = getAudioContext();
      if (!ctx) {
        return;
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const level = (volume / 100) * 0.08;

      oscillator.type = 'triangle';
      oscillator.frequency.value = 780;
      gainNode.gain.value = level;

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.18);
    } catch {
      // Audio may be blocked by browser autoplay policies until a user gesture occurs.
    }
  }, [soundEnabled, volume]);

  const playWhistle = useCallback(() => {
    if (!soundEnabled) {
      return;
    }

    try {
      const ctx = getAudioContext();
      if (!ctx) {
        return;
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const level = (volume / 100) * 0.05;

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(120, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);
      gainNode.gain.setValueAtTime(level, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore blocked audio contexts gracefully.
    }
  }, [soundEnabled, volume]);

  return { playBell, playWhistle };
}
