"use client";

import { useCallback } from "react";
import { useDangGuliStore } from "@/store/dangGuliStore";

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
  }

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  return audioContext;
};

export function useDangGuliAudio() {
  const soundEnabled = useDangGuliStore((s) => s.soundEnabled);
  const volume = useDangGuliStore((s) => s.volume);

  // 1. Tip wooden tap ("টুক!")
  const playTip = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const masterVol = (volume / 100) * 0.18;

      osc.type = "sine";
      osc.frequency.setValueAtTime(620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.045);

      gain.gain.setValueAtTime(masterVol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context blocked
    }
  }, [soundEnabled, volume]);

  // 2. Dang swing miss ("সোঁওও!")
  const playSwingMiss = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const masterVol = (volume / 100) * 0.12;

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(masterVol, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context blocked
    }
  }, [soundEnabled, volume]);

  // 3. Wooden Strike ("ঠাস্!")
  const playHit = useCallback(
    (quality: "perfect" | "good" | "weak") => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const masterVol = (volume / 100) * (quality === "perfect" ? 0.35 : 0.22);

        // Low punch
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "triangle";
        subOsc.frequency.setValueAtTime(quality === "perfect" ? 180 : 130, now);
        subOsc.frequency.exponentialRampToValueAtTime(35, now + (quality === "perfect" ? 0.15 : 0.09));
        subGain.gain.setValueAtTime(masterVol, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + (quality === "perfect" ? 0.16 : 0.1));
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.18);

        // Wood crack snap
        const crackOsc = ctx.createOscillator();
        const crackGain = ctx.createGain();
        crackOsc.type = "sawtooth";
        crackOsc.frequency.setValueAtTime(quality === "perfect" ? 1200 : 780, now);
        crackOsc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        crackGain.gain.setValueAtTime(masterVol * 0.9, now);
        crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
        crackOsc.connect(crackGain);
        crackGain.connect(ctx.destination);
        crackOsc.start(now);
        crackOsc.stop(now + 0.1);

        // If perfect, add celebratory high sparkle chord
        if (quality === "perfect") {
          const sparkle = ctx.createOscillator();
          const sparkleGain = ctx.createGain();
          sparkle.type = "sine";
          sparkle.frequency.setValueAtTime(880, now + 0.04);
          sparkle.frequency.exponentialRampToValueAtTime(1760, now + 0.25);
          sparkleGain.gain.setValueAtTime(masterVol * 0.2, now + 0.04);
          sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          sparkle.connect(sparkleGain);
          sparkleGain.connect(ctx.destination);
          sparkle.start(now + 0.04);
          sparkle.stop(now + 0.3);
        }
      } catch {
        // Audio context blocked
      }
    },
    [soundEnabled, volume]
  );

  // 4. Ground Bounce / Mud Thud
  const playBounce = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const masterVol = (volume / 100) * 0.15;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(masterVol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Ignored
    }
  }, [soundEnabled, volume]);

  // 5. Tin Roof Hit ("ঠনঠন!")
  const playTinRoof = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const masterVol = (volume / 100) * 0.2;

      [580, 890, 1340].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(masterVol * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
      });
    } catch {
      // Ignored
    }
  }, [soundEnabled, volume]);

  // 6. Pond Splash ("ছপাস!")
  const playPondSplash = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const masterVol = (volume / 100) * 0.16;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(masterVol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignored
    }
  }, [soundEnabled, volume]);

  // 7. Fielder Catch ("ক্যাচ আউট রে ভাই!")
  const playFielderCatch = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const masterVol = (volume / 100) * 0.2;

      // Whistle down
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
      gain.gain.setValueAtTime(masterVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Ignored
    }
  }, [soundEnabled, volume]);

  // 8. Kaathi count tick ("এক, দুই, তিন...")
  const playKaathiTick = useCallback(
    (index: number) => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const masterVol = (volume / 100) * 0.12;

        // Higher pitch as count increases
        const freq = 440 + (index % 12) * 35;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(masterVol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.055);
      } catch {
        // Ignored
      }
    },
    [soundEnabled, volume]
  );

  // 9. Crowd cheer
  const playCrowdCheer = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const masterVol = (volume / 100) * 0.15;

      [600, 750, 900].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        osc.frequency.linearRampToValueAtTime(freq * 1.25, now + i * 0.06 + 0.2);
        gain.gain.setValueAtTime(masterVol * 0.5, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.36);
      });
    } catch {
      // Ignored
    }
  }, [soundEnabled, volume]);

  return {
    playTip,
    playSwingMiss,
    playHit,
    playBounce,
    playTinRoof,
    playPondSplash,
    playFielderCatch,
    playKaathiTick,
    playCrowdCheer,
  };
}
