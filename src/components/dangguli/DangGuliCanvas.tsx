"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DANG_STICKS,
  GULI_TYPES,
  KAATHI_CHANTS,
  NOSTALGIC_COMMENTARY,
  VILLAGE_FIELDERS,
} from "@/data/dangGuliData";
import { useDangGuliAudio } from "@/hooks/useDangGuliAudio";
import {
  GamePhase,
  ShotQuality,
  useDangGuliStore,
} from "@/store/dangGuliStore";
import { Sparkles, CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 440;
const GROUND_Y = 360;
const GHOP_X = 140;
const PIXELS_PER_KAATHI = 16; // 1 Kaathi ~ 16 canvas pixels (~1 length of dang stick)
const SWEET_SPOT_Y = GROUND_Y - 95; // Eye/chest level sweet spot
const STRIKE_ZONE_HALF_HEIGHT = 45;

export const DangGuliCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store bindings
  const phase = useDangGuliStore((s) => s.phase);
  const setPhase = useDangGuliStore((s) => s.setPhase);
  const recordShot = useDangGuliStore((s) => s.recordShot);
  const wind = useDangGuliStore((s) => s.wind);
  const gameMode = useDangGuliStore((s) => s.gameMode);
  const selectedStickId = useDangGuliStore((s) => s.selectedStickId);
  const selectedGuliId = useDangGuliStore((s) => s.selectedGuliId);
  const startNewInning = useDangGuliStore((s) => s.startNewInning);

  // Sound engine
  const audio = useDangGuliAudio();
  const audioRef = useRef(audio);
  audioRef.current = audio;

  // Active gear
  const stick = DANG_STICKS.find((s) => s.id === selectedStickId) || DANG_STICKS[0];
  const guliGear = GULI_TYPES.find((g) => g.id === selectedGuliId) || GULI_TYPES[0];

  // Visual UI state
  const [inStrikeZone, setInStrikeZone] = useState<boolean>(false);
  const [timingPercent, setTimingPercent] = useState<number>(0); // 0 to 1
  const [liveDistance, setLiveDistance] = useState<number>(0);
  const [measuringCurrentKaathi, setMeasuringCurrentKaathi] = useState<number>(0);
  const [measuringChant, setMeasuringChant] = useState<string>("");
  const [onScreenFeedback, setOnScreenFeedback] = useState<{
    title: string;
    sub: string;
    color: string;
  } | null>(null);

  // Internal physics refs (no layout jumping / zero React re-render lag)
  const guliRef = useRef({
    x: GHOP_X,
    y: GROUND_Y - 8,
    vx: 0,
    vy: 0,
    angle: -0.2,
    spin: 0,
    isResting: true,
    bounceCount: 0,
  });

  const dangRef = useRef({
    angle: -0.4,
    swingProgress: 0,
    isSwinging: false,
    measuringX: GHOP_X,
    measuringFlipAngle: 0,
  });

  const cameraXRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const phaseRef = useRef<GamePhase>(phase);
  phaseRef.current = phase;
  const hasRecordedRef = useRef<boolean>(false);

  // Shot calculation stats
  const shotStatsRef = useRef({
    maxHeight: 0,
    maxSpeed: 0,
    quality: "miss" as ShotQuality,
    hitBonus: "",
    fielderCaught: false,
    finalKaathi: 0,
    measuringProgress: 0,
  });

  // Spawn visual particles
  const spawnParticles = useCallback(
    (x: number, y: number, count: number, color: string, speed = 3) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const v = (Math.random() * 0.8 + 0.2) * speed;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v - Math.random() * 1.5,
          life: 0,
          maxLife: 20 + Math.random() * 20,
          color,
          size: 2 + Math.random() * 3,
        });
      }
    },
    []
  );

  // Reset Guli position to Ghop
  const resetToGhop = useCallback(() => {
    hasRecordedRef.current = false;
    guliRef.current = {
      x: GHOP_X,
      y: GROUND_Y - 8,
      vx: 0,
      vy: 0,
      angle: -0.2,
      spin: 0,
      isResting: true,
      bounceCount: 0,
    };
    dangRef.current = {
      angle: -0.4,
      swingProgress: 0,
      isSwinging: false,
      measuringX: GHOP_X,
      measuringFlipAngle: 0,
    };
    cameraXRef.current = 0;
    particlesRef.current = [];
    setLiveDistance(0);
    setMeasuringCurrentKaathi(0);
    setMeasuringChant("");
    setOnScreenFeedback(null);
    setInStrikeZone(false);
    setTimingPercent(0);
    shotStatsRef.current = {
      maxHeight: 0,
      maxSpeed: 0,
      quality: "miss",
      hitBonus: "",
      fielderCaught: false,
      finalKaathi: 0,
      measuringProgress: 0,
    };
  }, []);

  // Sync with phase
  useEffect(() => {
    if (phase === "ready") {
      resetToGhop();
    }
  }, [phase, resetToGhop]);

  // Primary user action: TIP or WHACK (Optimized for touch and mouse)
  const handleAction = useCallback(() => {
    const curPhase = phaseRef.current;

    // 1. PHASE: READY -> TIP GULI
    if (curPhase === "ready") {
      setPhase("tipping");
      audio.playTip();

      // Launch guli upwards with smooth, predictable arc
      guliRef.current.isResting = false;
      guliRef.current.vy = -7.2; // gentle rise
      guliRef.current.vx = 0.5;
      guliRef.current.spin = 0.12;

      dangRef.current.angle = 0.45;
      spawnParticles(GHOP_X, GROUND_Y, 10, "#92400e", 2);

      // Brief tip animation transition
      setTimeout(() => {
        setPhase("airborne");
      }, 80);
      return;
    }

    // 2. PHASE: AIRBORNE -> WHACK!
    if (curPhase === "airborne") {
      const guliY = guliRef.current.y;
      const diff = Math.abs(guliY - SWEET_SPOT_Y);
      const tolerance = STRIKE_ZONE_HALF_HEIGHT * stick.sweetSpotWindow;

      // Start swing animation
      dangRef.current.isSwinging = true;
      dangRef.current.swingProgress = 0;

      if (diff <= tolerance) {
        // SUCCESSFUL HIT!
        const isPerfect = diff <= 16 * stick.sweetSpotWindow;
        const quality: ShotQuality = isPerfect ? "perfect" : "good";
        shotStatsRef.current.quality = quality;

        const powerMult = (stick.power / 100) * (isPerfect ? 1.45 : 1.1);
        const guliSpeed = 18 * powerMult * guliGear.aerodynamics;
        const guliAngle = -0.48 - (isPerfect ? 0.08 : 0); // elevated launch angle

        guliRef.current.vx = Math.cos(guliAngle) * guliSpeed + wind.speed * 0.12;
        guliRef.current.vy = Math.sin(guliAngle) * guliSpeed;
        guliRef.current.spin = isPerfect ? 0.5 : 0.3;

        shotStatsRef.current.maxSpeed = Math.round(guliSpeed * 3.6);

        audio.playHit(quality);
        if (isPerfect) audio.playCrowdCheer();

        setOnScreenFeedback(
          isPerfect
            ? {
                title: "পারফেক্ট সুইট-স্পট! ঠাস্!",
                sub: "অসাধারণ শট! চার কাঠি পার হয়ে বটগাছের ওপর দিয়ে উড়ছে!",
                color: "text-amber-300",
              }
            : {
                title: "সুন্দর চুট (বাড়ি)!",
                sub: "দারুণ শট! অনেক দূর যাবে!",
                color: "text-emerald-300",
              }
        );

        spawnParticles(
          guliRef.current.x,
          guliRef.current.y,
          isPerfect ? 30 : 18,
          isPerfect ? "#fbbf24" : "#f97316",
          5
        );

        setPhase("flying");
      } else if (diff <= tolerance * 1.5) {
        // WEAK HIT
        shotStatsRef.current.quality = "weak";
        const powerMult = (stick.power / 100) * 0.65;
        guliRef.current.vx = 8.5 * powerMult;
        guliRef.current.vy = -3.2;
        guliRef.current.spin = 0.2;

        audio.playHit("weak");
        setOnScreenFeedback({
          title: "দুর্বল বাড়ি!",
          sub: "গোড়ায় লেগেছে, তবে মাটি কামড়ে এগোচ্ছে!",
          color: "text-orange-400",
        });

        spawnParticles(guliRef.current.x, guliRef.current.y, 10, "#a8a29e", 2.5);
        setPhase("flying");
      } else {
        // MISSED SWING
        shotStatsRef.current.quality = "miss";
        audio.playSwingMiss();
        setOnScreenFeedback({
          title: "ফসকে গেল!",
          sub: "টাইমিং মিস হয়েছে! ডাং বাতাসে ফাঁকা ঘুরল!",
          color: "text-rose-400",
        });
        setPhase("miss");
      }
    }
  }, [stick, guliGear, wind, audio, setPhase, spawnParticles]);

  // Touch and Keyboard Listeners (Mobile & Desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAction]);

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const curPhase = phaseRef.current;
      const g = guliRef.current;
      const d = dangRef.current;

      // 1. UPDATE PHYSICS
      if (curPhase === "airborne") {
        // Bullet-time: If inside the sweet spot zone, physics slows down (0.28x) so user can easily react and hit!
        const diffFromSweet = Math.abs(g.y - SWEET_SPOT_Y);
        const inZone = diffFromSweet <= STRIKE_ZONE_HALF_HEIGHT;
        setInStrikeZone(inZone);

        const timeStep = inZone ? 0.28 : 0.85;

        // Upward/downward parabolic motion
        g.vy += 0.24 * timeStep;
        g.y += g.vy * timeStep;
        g.x += g.vx * timeStep;
        g.angle += g.spin * timeStep;

        // Progress meter for timing guide: 0 (bottom rise) to 0.5 (sweet spot) to 1.0 (drop)
        const totalHeightRange = 140;
        const distFromBottom = Math.max(0, GROUND_Y - g.y);
        const progress = Math.min(1, Math.max(0, distFromBottom / totalHeightRange));
        setTimingPercent(progress);

        // Ground drop without swing -> Soft drop, no sudden modal jump!
        if (g.y >= GROUND_Y - 8) {
          g.y = GROUND_Y - 8;
          g.vy = 0;
          g.vx = 0;
          audioRef.current.playSwingMiss();
          setOnScreenFeedback({
            title: "দেরি হয়ে গেল!",
            sub: "গুলি মাটিতে পড়ে গেল। নিচে 'পুনরায় চেষ্টা' চাপুন।",
            color: "text-rose-400",
          });
          phaseRef.current = "miss";
          setPhase("miss");
        }
      } else if (curPhase === "flying" || curPhase === "landing") {
        // Flight physics with air friction and wind
        g.vx = g.vx * 0.994 + wind.speed * 0.003;
        g.vy += 0.28 * guliGear.weight; // gravity

        g.x += g.vx;
        g.y += g.vy;
        g.angle += g.spin;

        // Live distance
        const currentKaathi = Math.max(0, Math.round((g.x - GHOP_X) / PIXELS_PER_KAATHI));
        setLiveDistance(currentKaathi);

        // Record height
        const heightFromGround = GROUND_Y - g.y;
        if (heightFromGround > shotStatsRef.current.maxHeight) {
          shotStatsRef.current.maxHeight = Math.round(heightFromGround / 2);
        }

        // Particle trail
        if (Math.random() < 0.3) {
          spawnParticles(g.x, g.y, 1, selectedGuliId === "golden_guli" ? "#fde047" : "#fed7aa", 1);
        }

        // Fielder Detection
        VILLAGE_FIELDERS.forEach((f) => {
          const fielderPx = GHOP_X + f.positionX * PIXELS_PER_KAATHI;
          const distToFielder = Math.abs(g.x - fielderPx);

          if (
            distToFielder < 28 &&
            g.y > GROUND_Y - 65 &&
            g.y < GROUND_Y - 10 &&
            !shotStatsRef.current.fielderCaught
          ) {
            const caughtRoll = Math.random();
            if (caughtRoll < f.catchChance) {
              shotStatsRef.current.fielderCaught = true;
              g.vx = 0;
              g.vy = 0;
              audioRef.current.playFielderCatch();
              setOnScreenFeedback({
                title: `${f.nameBn} লুফে নিল!`,
                sub: `ক্যাচ আউট! "${f.taunt}"`,
                color: "text-rose-400",
              });
              phaseRef.current = "caught";
              setPhase("caught");
            } else if (f.id === "boltu" && Math.random() < 0.45) {
              audioRef.current.playBounce();
              setOnScreenFeedback({
                title: "বল্টুর হাত ফস্কে গেল!",
                sub: `"${f.cheer}" - বেঁচে গেলি রে ভাই!`,
                color: "text-amber-300",
              });
            }
          }
        });

        // Terrain Collision: Tin Roof
        const tinStartPx = GHOP_X + 175 * PIXELS_PER_KAATHI;
        const tinEndPx = GHOP_X + 215 * PIXELS_PER_KAATHI;
        const tinRoofY = GROUND_Y - 65;
        if (g.x >= tinStartPx && g.x <= tinEndPx && g.y >= tinRoofY && g.vy > 0) {
          g.y = tinRoofY;
          g.vy = -g.vy * 0.65;
          g.vx *= 1.1;
          audioRef.current.playTinRoof();
          shotStatsRef.current.hitBonus = "টিনের চালে ড্রপ (+১০ কাঠি বোনাস!)";
          spawnParticles(g.x, g.y, 8, "#94a3b8", 3);
        }

        // Terrain Collision: Pond
        const pondStartPx = GHOP_X + 280 * PIXELS_PER_KAATHI;
        const pondEndPx = GHOP_X + 335 * PIXELS_PER_KAATHI;
        if (g.x >= pondStartPx && g.x <= pondEndPx && g.y >= GROUND_Y - 4) {
          audioRef.current.playPondSplash();
          spawnParticles(g.x, GROUND_Y, 15, "#38bdf8", 4);
          if (g.vx > 6) {
            g.vy = -g.vy * 0.42;
            g.vx *= 0.82;
            shotStatsRef.current.hitBonus = "শাপলা পুকুরে ব্যাঙের লাফ!";
          } else {
            g.vx = 0;
            g.vy = 0;
          }
        }

        // Ground Collision
        if (g.y >= GROUND_Y - 8) {
          g.y = GROUND_Y - 8;
          g.bounceCount++;

          if (Math.abs(g.vy) > 1.2) {
            g.vy = -g.vy * (0.45 * guliGear.bounce);
            g.vx *= 0.8;
            audioRef.current.playBounce();
            spawnParticles(g.x, GROUND_Y, 6, "#78350f", 2);
          } else {
            // Rolling to rest
            g.vy = 0;
            g.vx *= 0.86;
            g.spin *= 0.82;

            if (Math.abs(g.vx) < 0.2) {
              g.vx = 0;
              g.spin = 0;
              g.isResting = true;
              shotStatsRef.current.finalKaathi = Math.max(
                0,
                Math.round((g.x - GHOP_X) / PIXELS_PER_KAATHI)
              );
              shotStatsRef.current.measuringProgress = 0;
              d.measuringX = GHOP_X;
              phaseRef.current = "measuring";
              setPhase("measuring");
            }
          }
        }
      } else if (curPhase === "measuring") {
        // 4 কাঠি (Char Kaathi) Animated Traditional Measuring Ritual
        // The dang stick flips end-over-end from Ghop to the Guli!
        const finalKaathi = shotStatsRef.current.finalKaathi;
        shotStatsRef.current.measuringProgress += 0.35; // measuring speed
        const currentStep = Math.min(
          finalKaathi,
          Math.floor(shotStatsRef.current.measuringProgress)
        );

        setMeasuringCurrentKaathi(currentStep);
        d.measuringX = GHOP_X + currentStep * PIXELS_PER_KAATHI;
        d.measuringFlipAngle = (shotStatsRef.current.measuringProgress % 1) * Math.PI;

        // Traditional chant text
        const chantIndex = Math.min(currentStep - 1, KAATHI_CHANTS.length - 1);
        if (currentStep > 0 && chantIndex >= 0) {
          const chantText =
            currentStep <= 4
              ? `ধাপ ${currentStep}: ${KAATHI_CHANTS[chantIndex]} (${currentStep} কাঠি)`
              : `${KAATHI_CHANTS[chantIndex % KAATHI_CHANTS.length]} - মোট ${currentStep} কাঠি`;
          setMeasuringChant(chantText);
        }

        // Play tick sound every whole kaathi step
        if (Math.floor(shotStatsRef.current.measuringProgress) > currentStep - 1) {
          // Play once per new kaathi
          if (currentStep > 0 && currentStep <= finalKaathi && currentStep % 2 === 0) {
            audioRef.current.playKaathiTick(currentStep);
          }
        }

        // Camera smoothly glides along with measuring stick
        const targetCam = Math.max(0, d.measuringX - 260);
        cameraXRef.current += (targetCam - cameraXRef.current) * 0.1;

        // If measuring completed all the way to Guli!
        if (!hasRecordedRef.current && shotStatsRef.current.measuringProgress >= finalKaathi + 1.5) {
          hasRecordedRef.current = true;
          phaseRef.current = "turn_ended";
          // Finished measuring!
          let commentary = NOSTALGIC_COMMENTARY.goodHit[0];
          if (finalKaathi >= 4) {
            commentary =
              finalKaathi > 100
                ? "বটগাছ পার! সরিষা ক্ষেত পার! একেই বলে খাঁটি ৪ কাঠি পার করা বাড়ি!"
                : "সাবাশ! ৪ কাঠি অনায়াসেই পার করে ফেললি!";
          } else {
            commentary = "ইশশ! ৪ কাঠিও পার হলো না! পরের বার আরেকটু উঁচুতে বাড়ি মারিস!";
          }

          const finalScore = Math.round(finalKaathi * guliGear.scoreMultiplier);

          recordShot({
            distance: finalScore,
            quality: shotStatsRef.current.quality,
            maxSpeed: shotStatsRef.current.maxSpeed || 40,
            maxHeight: shotStatsRef.current.maxHeight || 18,
            commentary,
            bonusTitle:
              finalKaathi >= 4
                ? `৪ কাঠি পার (${finalKaathi} কাঠি)`
                : "৪ কাঠি পার হয়নি",
          });
        }
      }

      // Dang swing animation
      if (d.isSwinging) {
        d.swingProgress += 0.16;
        d.angle = -0.4 + Math.sin(d.swingProgress * Math.PI) * 1.9;
        if (d.swingProgress >= 1) {
          d.isSwinging = false;
        }
      }

      // Camera Follow during flight
      if (curPhase === "flying" || curPhase === "landing") {
        const targetCamX = Math.max(0, g.x - 240);
        cameraXRef.current += (targetCamX - cameraXRef.current) * 0.14;
      }
      const camX = cameraXRef.current;

      // 2. RENDER CANVAS SCENE
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // A. Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      skyGrad.addColorStop(0, "#bae6fd");
      skyGrad.addColorStop(0.7, "#fef08a");
      skyGrad.addColorStop(1, "#fed7aa");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);

      // Flying Paper Kite in Sky
      const kiteX = ((200 - camX * 0.05) % 1100) + 100;
      ctx.save();
      ctx.translate(kiteX, 50 + Math.sin(Date.now() * 0.002) * 6);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(10, 0);
      ctx.lineTo(0, 12);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // B. Distant Horizon Palm Trees (Parallax 0.15x)
      ctx.save();
      const distOffset = -(camX * 0.15) % 500;
      for (let i = -1; i < 4; i++) {
        const xBase = distOffset + i * 360;
        ctx.fillStyle = "#86efac";
        ctx.beginPath();
        ctx.arc(xBase + 100, GROUND_Y - 55, 40, 0, Math.PI * 2);
        ctx.arc(xBase + 140, GROUND_Y - 65, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#57534e";
        ctx.fillRect(xBase + 240, GROUND_Y - 130, 5, 75);
        ctx.fillStyle = "#166534";
        ctx.beginPath();
        ctx.arc(xBase + 242, GROUND_Y - 132, 26, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // C. Mustard Field (সরিষা ক্ষেত) (Parallax 0.5x)
      const midOffset = -(camX * 0.45);
      const mustardStart = midOffset + 500 * 0.45;
      if (mustardStart < CANVAS_WIDTH && mustardStart + 450 > 0) {
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.ellipse(mustardStart + 220, GROUND_Y - 18, 240, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#a16207";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("🌼 সরিষা ক্ষেত 🌼", mustardStart + 160, GROUND_Y - 26);
      }

      // D. Banyan Tree (বটগাছ)
      const banyanScreenX = 320 - camX;
      if (banyanScreenX > -250 && banyanScreenX < CANVAS_WIDTH + 200) {
        ctx.fillStyle = "#78350f";
        ctx.fillRect(banyanScreenX, GROUND_Y - 170, 38, 170);
        ctx.fillStyle = "#15803d";
        ctx.beginPath();
        ctx.arc(banyanScreenX + 19, GROUND_Y - 170, 80, 0, Math.PI * 2);
        ctx.arc(banyanScreenX - 30, GROUND_Y - 140, 60, 0, Math.PI * 2);
        ctx.arc(banyanScreenX + 70, GROUND_Y - 140, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // E. Tin Roof Hut
      const hutScreenX = GHOP_X + 175 * PIXELS_PER_KAATHI - camX;
      if (hutScreenX < CANVAS_WIDTH && hutScreenX + 400 > 0) {
        ctx.fillStyle = "#d97706";
        ctx.fillRect(hutScreenX, GROUND_Y - 55, 180, 55);
        ctx.fillStyle = "#94a3b8";
        ctx.beginPath();
        ctx.moveTo(hutScreenX - 10, GROUND_Y - 55);
        ctx.lineTo(hutScreenX + 90, GROUND_Y - 95);
        ctx.lineTo(hutScreenX + 190, GROUND_Y - 55);
        ctx.closePath();
        ctx.fill();
      }

      // F. Village Pond
      const pondScreenStart = GHOP_X + 280 * PIXELS_PER_KAATHI - camX;
      const pondWidth = 55 * PIXELS_PER_KAATHI;
      if (pondScreenStart < CANVAS_WIDTH && pondScreenStart + pondWidth > 0) {
        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.ellipse(
          pondScreenStart + pondWidth / 2,
          GROUND_Y + 10,
          pondWidth / 2,
          24,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.fillStyle = "#f43f5e";
        ctx.font = "14px sans-serif";
        ctx.fillText("🪷", pondScreenStart + 60, GROUND_Y + 6);
      }

      // G. Mud Ground
      ctx.fillStyle = "#78350f";
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      ctx.fillStyle = "#65a30d";
      ctx.fillRect(0, GROUND_Y - 4, CANVAS_WIDTH, 5);

      // H. The Ghop (মাটির গর্ত)
      const ghopScreenX = GHOP_X - camX;
      if (ghopScreenX > -100 && ghopScreenX < CANVAS_WIDTH + 100) {
        ctx.fillStyle = "#451a03";
        ctx.beginPath();
        ctx.ellipse(ghopScreenX, GROUND_Y + 2, 26, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fde047";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("ঘোপ", ghopScreenX - 12, GROUND_Y + 20);
      }

      // I. Milestone Signboards (Prominently marking "৪ কাঠি" milestone!)
      [4, 25, 50, 100, 200, 300].forEach((dist) => {
        const signX = GHOP_X + dist * PIXELS_PER_KAATHI - camX;
        if (signX > -60 && signX < CANVAS_WIDTH + 60) {
          const isFourKaathi = dist === 4;
          ctx.fillStyle = isFourKaathi ? "#dc2626" : "#92400e";
          ctx.fillRect(signX - 2, GROUND_Y - 32, 4, 32);
          ctx.fillStyle = isFourKaathi ? "#fee2e2" : "#fef3c7";
          ctx.strokeStyle = isFourKaathi ? "#ef4444" : "#b45309";
          ctx.lineWidth = isFourKaathi ? 2.5 : 1.5;
          ctx.fillRect(signX - 30, GROUND_Y - 52, 60, 22);
          ctx.strokeRect(signX - 30, GROUND_Y - 52, 60, 22);
          ctx.fillStyle = isFourKaathi ? "#991b1b" : "#78350f";
          ctx.font = isFourKaathi ? "bold 11px sans-serif" : "bold 10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(isFourKaathi ? "★ ৪ কাঠি ★" : `${dist} কাঠি`, signX, GROUND_Y - 37);
          ctx.textAlign = "start";
        }
      });

      // J. Fielders
      VILLAGE_FIELDERS.forEach((f) => {
        const fScreenX = GHOP_X + f.positionX * PIXELS_PER_KAATHI - camX;
        if (fScreenX > -80 && fScreenX < CANVAS_WIDTH + 80) {
          ctx.font = "28px sans-serif";
          ctx.fillText(f.avatar, fScreenX - 14, GROUND_Y - 4);
          ctx.fillStyle = "#fef9c3";
          ctx.font = "bold 9px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(f.nameBn, fScreenX, GROUND_Y + 14);
          ctx.textAlign = "start";
        }
      });

      // K. STRUCTURED HIT GUIDE: Strike Target Box & Trajectory Arc!
      if (curPhase === "ready" || curPhase === "airborne") {
        ctx.save();
        const targetX = GHOP_X - camX;

        // Dotted Rise Path
        ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(targetX, GROUND_Y - 8);
        ctx.quadraticCurveTo(targetX, SWEET_SPOT_Y - 20, targetX + 15, SWEET_SPOT_Y);
        ctx.stroke();

        // The Strike Zone Box (ব্যাট জোন)
        const isCurrentlyInside =
          curPhase === "airborne" &&
          Math.abs(g.y - SWEET_SPOT_Y) <= STRIKE_ZONE_HALF_HEIGHT;

        ctx.strokeStyle = isCurrentlyInside
          ? "rgba(34, 197, 94, 0.9)"
          : "rgba(251, 191, 36, 0.75)";
        ctx.fillStyle = isCurrentlyInside
          ? "rgba(34, 197, 94, 0.2)"
          : "rgba(251, 191, 36, 0.1)";
        ctx.lineWidth = isCurrentlyInside ? 3 : 2;
        ctx.setLineDash([]);

        // Target Reticle
        const zoneWidth = 80;
        const zoneHeight = STRIKE_ZONE_HALF_HEIGHT * 2;
        ctx.fillRect(
          targetX - zoneWidth / 2,
          SWEET_SPOT_Y - zoneHeight / 2,
          zoneWidth,
          zoneHeight
        );
        ctx.strokeRect(
          targetX - zoneWidth / 2,
          SWEET_SPOT_Y - zoneHeight / 2,
          zoneWidth,
          zoneHeight
        );

        // Target Center Reticle Crosshairs
        ctx.beginPath();
        ctx.moveTo(targetX - 15, SWEET_SPOT_Y);
        ctx.lineTo(targetX + 15, SWEET_SPOT_Y);
        ctx.moveTo(targetX, SWEET_SPOT_Y - 15);
        ctx.lineTo(targetX, SWEET_SPOT_Y + 15);
        ctx.stroke();

        // Guide Text
        ctx.fillStyle = isCurrentlyInside ? "#4ade80" : "#fef08a";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          isCurrentlyInside ? "🎯 এখনই বাড়ি মারুন! (HIT NOW!)" : "ব্যাট জোন (Strike Zone)",
          targetX,
          SWEET_SPOT_Y - zoneHeight / 2 - 8
        );
        ctx.textAlign = "start";
        ctx.restore();
      }

      // L. Animated Measuring Stick in "measuring" phase
      if (curPhase === "measuring") {
        const measuringScreenX = d.measuringX - camX;
        ctx.save();
        ctx.translate(measuringScreenX, GROUND_Y - 6);
        ctx.rotate(d.measuringFlipAngle);
        // Dang measuring rod
        ctx.fillStyle = "#d97706";
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 2;
        ctx.fillRect(-PIXELS_PER_KAATHI / 2, -6, PIXELS_PER_KAATHI, 12);
        ctx.strokeRect(-PIXELS_PER_KAATHI / 2, -6, PIXELS_PER_KAATHI, 12);
        ctx.restore();

        // Measuring trail line on ground from Ghop to measuring stick
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.moveTo(GHOP_X - camX, GROUND_Y);
        ctx.lineTo(measuringScreenX, GROUND_Y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // M. Dang Stick (Player batting position)
      if (curPhase !== "measuring") {
        const dangScreenX = GHOP_X - 16 - camX;
        ctx.save();
        ctx.translate(dangScreenX, GROUND_Y - 14);
        ctx.rotate(d.angle);
        ctx.fillStyle = stick.color;
        ctx.strokeStyle = stick.accentColor;
        ctx.lineWidth = 2;
        ctx.fillRect(-5, -80, 10, 80);
        ctx.strokeRect(-5, -80, 10, 80);
        // Handle wrap
        ctx.fillStyle = "#fef08a";
        for (let w = 0; w < 4; w++) {
          ctx.fillRect(-5, -18 + w * 4, 10, 2);
        }
        ctx.restore();
      }

      // N. Guli
      const guliScreenX = g.x - camX;
      ctx.save();
      ctx.translate(guliScreenX, g.y);
      ctx.rotate(g.angle);
      ctx.fillStyle = guliGear.color;
      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(-8, -4.5);
      ctx.lineTo(8, -4.5);
      ctx.lineTo(15, 0);
      ctx.lineTo(8, 4.5);
      ctx.lineTo(-8, 4.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // O. Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const pScreenX = p.x - camX;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(pScreenX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    setPhase,
    recordShot,
    stick,
    guliGear,
    wind,
    selectedGuliId,
    spawnParticles,
  ]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-4 border-amber-900/60 bg-amber-950/20 shadow-2xl backdrop-blur-sm select-none">
      {/* Top HUD Strip */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-2.5 sm:p-4">
        {/* Distance Indicator */}
        <div className="flex items-center gap-2 rounded-xl bg-amber-950/85 px-3 py-1.5 border border-amber-500/40 text-amber-200 shadow-lg">
          <span className="text-lg">📏</span>
          <div>
            <div className="text-[9px] uppercase font-bold tracking-wider text-amber-400">
              দূরত্ব (Distance)
            </div>
            <div className="text-base sm:text-lg font-black tracking-tight text-white">
              {liveDistance} <span className="text-xs text-amber-300">কাঠি</span>
            </div>
          </div>
        </div>

        {/* 4 Kaathi Goal Milestone Badge */}
        <div className="flex items-center gap-1.5 rounded-xl bg-stone-900/85 px-3 py-1.5 border border-amber-600/50 text-stone-200 shadow-lg">
          <span className="text-sm">🪵</span>
          <div className="text-left">
            <div className="text-[9px] uppercase font-bold text-amber-400">
              গ্রামীণ লক্ষ্য
            </div>
            <div className="text-xs font-black text-amber-200">
              {liveDistance >= 4 ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 inline" /> ৪ কাঠি পার!
                </span>
              ) : (
                <span>কমপক্ষে ৪ কাঠি চাই</span>
              )}
            </div>
          </div>
        </div>

        {/* Wind Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-900/85 px-3 py-1.5 border border-slate-700 text-slate-200 shadow-lg">
          <span className="text-base">🍃</span>
          <div className="text-xs font-bold text-white">
            {wind.labelBn}
          </div>
        </div>
      </div>

      {/* Main Responsive Canvas with Touch Actions */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleAction}
        onTouchStart={(e) => {
          e.preventDefault();
          handleAction();
        }}
        className="w-full h-auto cursor-pointer touch-none aspect-[960/440] block"
      />

      {/* Interactive Measuring Overlay Banner (The 4 Kaathi Ritual!) */}
      {phase === "measuring" && (
        <div className="pointer-events-none absolute inset-x-0 top-16 z-20 flex justify-center px-4">
          <div className="flex flex-col items-center rounded-2xl bg-amber-950/90 px-6 py-3 border-2 border-amber-400/80 shadow-2xl backdrop-blur-md animate-pulse">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ঐতিহ্যবাহী কাঠি মেপে গণনা চলছে...</span>
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black text-white">
              {measuringChant || `${measuringCurrentKaathi} কাঠি`}
            </div>
            <div className="mt-0.5 text-xs text-amber-200 font-medium">
              {measuringCurrentKaathi >= 4
                ? "🎉 সাবাশ! ৪ কাঠি পার হয়েছে!"
                : "৪ কাঠি গোনা হচ্ছে..."}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Height Bottom Control Area (Zero Jumping / Zero Layout Thrashing!) */}
      <div className="relative z-20 flex flex-col items-center justify-center p-3 sm:p-4 bg-stone-950/80 border-t border-amber-900/40 min-h-[90px]">
        {/* Real-time Hit Feedback Banner */}
        {onScreenFeedback && phase !== "measuring" && (
          <div className="mb-2 text-center">
            <span className={`text-sm font-black ${onScreenFeedback.color}`}>
              {onScreenFeedback.title}
            </span>
            <span className="text-xs text-stone-300 ml-2">
              {onScreenFeedback.sub}
            </span>
          </div>
        )}

        {/* Phase Buttons */}
        {phase === "ready" && (
          <div className="w-full max-w-md flex flex-col items-center gap-1.5">
            <button
              onClick={handleAction}
              onTouchStart={(e) => {
                e.preventDefault();
                handleAction();
              }}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-3.5 px-6 text-base sm:text-lg font-black text-white shadow-xl shadow-amber-500/25 transition active:scale-95 border-2 border-amber-200"
            >
              <span className="text-xl">🪵</span>
              <span>১ম ধাপ: টুপ দিন (Tap to Tip)</span>
              <span className="hidden sm:inline rounded bg-black/25 px-2 py-0.5 text-[11px] text-amber-100">
                বা স্ক্রিনে ট্যাপ করুন
              </span>
            </button>
            <span className="text-[11px] text-amber-400 font-medium text-center">
              💡 টুপ দিলে গুলি বাতাসে ভাসবে, তারপর ব্যাট জোনে এলে বাড়ি মারবেন!
            </span>
          </div>
        )}

        {phase === "airborne" && (
          <div className="w-full max-w-md flex flex-col items-center gap-2">
            {/* Visual Timing Bar (Green Sweet Spot) */}
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-stone-300 px-1">
              <span>🛑 আগে</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                🎯 সুইট-স্পট জোন
              </span>
              <span>🛑 পরে</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full border border-stone-700 bg-black/80 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  inStrikeZone
                    ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-md shadow-emerald-400/50"
                    : "bg-amber-500"
                }`}
                style={{ width: `${Math.round(timingPercent * 100)}%` }}
              />
            </div>

            {/* Giant Whack Button */}
            <button
              onClick={handleAction}
              onTouchStart={(e) => {
                e.preventDefault();
                handleAction();
              }}
              className={`w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 px-6 text-base sm:text-lg font-black text-white shadow-2xl transition active:scale-95 border-2 ${
                inStrikeZone
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 border-green-200 animate-pulse shadow-green-500/40"
                  : "bg-gradient-to-r from-orange-500 to-amber-600 border-amber-200"
              }`}
            >
              <span className="text-xl">💥</span>
              <span>২য় ধাপ: সজোরে বাড়ি মারুন! (WHACK NOW!)</span>
            </button>
          </div>
        )}

        {phase === "flying" && (
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <span className="animate-spin">🌀</span>
            <span>গুলি আকাশে উড়ছে... মেঠো পথ ও সরিষা ক্ষেত ছাড়িয়ে যাচ্ছে!</span>
          </div>
        )}

        {/* Retry / Next Turn inline for smooth smartphone gameplay */}
        {(phase === "miss" || phase === "caught") && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (gameMode === "practice") {
                  resetToGhop();
                  setPhase("ready");
                } else {
                  startNewInning();
                }
              }}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-black text-white hover:bg-amber-500 active:scale-95 transition shadow-md"
            >
              {gameMode === "practice" ? (
                <>
                  <RotateCcw className="h-4 w-4" />
                  <span>পুনরায় চেষ্টা করুন (Retry)</span>
                </>
              ) : (
                <>
                  <span>পরের ইনিংস খেলুন</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
