"use client";

import { motion } from "framer-motion";
import { MessageSquareText, MapPinned } from "lucide-react";
import { useMemo } from "react";

type RickshawSceneProps = {
  triggerCount: number;
  insultText: string;
  fare: number;
  isEscaping: boolean;
  weather: {
    name: string;
    icon: string;
    accent: string;
  };
};

export function RickshawScene({
  triggerCount,
  insultText,
  fare,
  isEscaping,
  weather,
}: RickshawSceneProps) {
  const dustParticles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: `${triggerCount}-${index}`,
        x: 12 + index * 5,
        y: 12 + (index % 5) * 4,
        delay: index * 0.04,
      })),
    [triggerCount],
  );

  const atmosphere = useMemo(() => {
    switch (weather.name) {
      case "Monsoon rain":
        return {
          sky: "linear-gradient(180deg, rgba(191,219,254,0.95) 0%, rgba(255,255,255,0.98) 35%, rgba(224,242,254,0.94) 100%)",
          glow: "rgba(59,130,246,0.18)",
          orb: "rgba(147,197,253,0.88)",
          orbPosition: "right-12 top-10",
        };
      case "Dust storm":
        return {
          sky: "linear-gradient(180deg, rgba(251,191,36,0.68) 0%, rgba(254,243,199,0.95) 28%, rgba(251,146,60,0.8) 100%)",
          glow: "rgba(234,179,8,0.12)",
          orb: "rgba(120,113,108,0.9)",
          orbPosition: "left-10 top-12",
        };
      case "Cool breeze":
        return {
          sky: "linear-gradient(180deg, rgba(187,247,208,0.9) 0%, rgba(255,255,255,0.99) 38%, rgba(219,234,254,0.88) 100%)",
          glow: "rgba(16,185,129,0.12)",
          orb: "rgba(255,255,255,0.82)",
          orbPosition: "right-10 top-8",
        };
      default:
        return {
          sky: "linear-gradient(180deg, rgba(254,240,138,0.86) 0%, rgba(255,255,255,0.98) 32%, rgba(254,226,226,0.82) 100%)",
          glow: "rgba(251,191,36,0.16)",
          orb: "rgba(251,191,36,0.9)",
          orbPosition: "right-12 top-10",
        };
    }
  }, [weather.name]);

  const rainDrops = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: `${weather.name}-drop-${index}`,
        left: `${8 + ((index * 5) % 80)}%`,
        delay: index * 0.18,
        duration: 0.8 + (index % 5) * 0.18,
      })),
    [weather.name],
  );

  const dustBands = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        id: `${weather.name}-dust-${index}`,
        left: `${4 + index * 11}%`,
        delay: index * 0.22,
      })),
    [weather.name],
  );

  return (
    <div className="rickshaw-scene rounded-[28px] p-5 shadow-panel md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MapPinned className="h-4 w-4 text-emerald-500" />
          Route map
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
          Dhaka traffic
        </span>
      </div>

      <div
        className="relative overflow-hidden rounded-[24px] border border-white/60 p-5"
        style={{
          background: atmosphere.sky,
          boxShadow: `inset 0 0 32px ${atmosphere.glow}`,
        }}
      >
        <motion.div
          className={`absolute h-16 w-16 rounded-full ${atmosphere.orbPosition}`}
          style={{
            background: `radial-gradient(circle, ${atmosphere.orb} 0%, rgba(255,255,255,0.45) 55%, transparent 72%)`,
            boxShadow: `0 0 40px ${atmosphere.glow}`,
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.85, 1, 0.8],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_20%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_24%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-200/80 to-transparent" />
        <div className="absolute inset-x-8 bottom-4 h-12 rounded-t-[30px] bg-gradient-to-r from-amber-200/70 via-emerald-200/60 to-sky-200/70 blur-sm" />

        {weather.name === "Monsoon rain" &&
          rainDrops.map((drop) => (
            <motion.span
              key={drop.id}
              className="absolute top-0 h-10 w-px bg-sky-400/80"
              style={{ left: drop.left }}
              animate={{ y: [0, 140], opacity: [0, 1, 0] }}
              transition={{
                duration: drop.duration,
                delay: drop.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

        {weather.name === "Dust storm" &&
          dustBands.map((band) => (
            <motion.div
              key={band.id}
              className="absolute top-10 h-24 w-24 rounded-full bg-amber-200/10 blur-2xl"
              style={{ left: band.left }}
              animate={{ x: [0, 32, 0], opacity: [0.15, 0.45, 0.15] }}
              transition={{
                duration: 3.2,
                delay: band.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

        {Array.from({ length: 9 }, (_, index) => (
          <motion.div
            key={`city-block-${index}`}
            className="absolute bottom-3 w-8 rounded-t-xl bg-slate-800/25"
            style={{
              left: `${8 + index * 11}%`,
              height: `${28 + (index % 4) * 18}px`,
            }}
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{
              duration: 3 + index * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          key={triggerCount}
          className="relative z-10 mx-auto mt-6 flex w-full max-w-md items-end justify-center"
          animate={
            isEscaping
              ? { x: 360, opacity: 0, scale: 0.82 }
              : { x: 0, opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            className="relative"
            animate={
              isEscaping
                ? {
                    x: [0, 20, 48, 90],
                    rotate: [0, 3, 10, 15],
                    scale: [1, 1.06, 1.12],
                  }
                : { x: [-8, 8, -6, 6, 0] }
            }
            transition={{ duration: isEscaping ? 0.7 : 0.4, ease: "easeInOut" }}
          >
            <div className="relative h-28 w-28 rounded-full bg-amber-200 ring-8 ring-white shadow-xl">
              <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100" />
              <div className="absolute left-[40%] top-[30%] h-3 w-3 rounded-full bg-slate-800" />
              <div className="absolute right-[40%] top-[30%] h-3 w-3 rounded-full bg-slate-800" />
              <div className="absolute left-1/2 top-[52%] h-2 w-8 -translate-x-1/2 rounded-full bg-rose-400" />
            </div>
          </motion.div>

          <motion.div
            animate={
              isEscaping
                ? { x: 0, y: [0, -8, -12], scaleY: [1, 0.96, 0.88] }
                : { y: [0, -6, 0], rotate: [0, 2, -2, 0] }
            }
            transition={{
              duration: isEscaping ? 0.75 : 0.6,
              repeat: isEscaping ? 0 : 2,
            }}
            className="relative -ml-5 h-14 w-40 rounded-[18px] border-4 border-rose-500 bg-rose-400 shadow-lg"
          >
            <div className="absolute left-2 top-2 h-9 w-8 rounded-md bg-yellow-300" />
            <div className="absolute right-2 top-2 h-9 w-8 rounded-md bg-emerald-300" />
            <div className="absolute inset-x-4 bottom-1 h-2 rounded-full bg-slate-800/80" />
          </motion.div>

          <motion.div
            className="absolute -right-12 bottom-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-700 bg-slate-200 shadow-lg"
            animate={isEscaping ? { rotate: 1200 } : { rotate: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="h-10 w-10 rounded-full border-[6px] border-slate-700 border-t-transparent border-r-amber-400" />
          </motion.div>

          <motion.div
            className="absolute -left-12 bottom-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-700 bg-slate-200 shadow-lg"
            animate={isEscaping ? { rotate: 1200 } : { rotate: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="h-10 w-10 rounded-full border-[6px] border-slate-700 border-t-transparent border-r-amber-400" />
          </motion.div>

          {isEscaping &&
            dustParticles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute left-10 top-12 h-5 w-5 rounded-full bg-amber-200/80"
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0.2,
                  x: -particle.x * 3,
                  y: particle.y * 2,
                }}
                transition={{
                  duration: 0.8,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
              />
            ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            delay: 0.1,
          }}
          className="relative z-10 mx-auto mt-10 max-w-sm rounded-2xl border border-amber-200 bg-white/90 p-4 shadow-lg"
        >
          <div className="mb-2 flex items-center gap-2 text-amber-700">
            <MessageSquareText className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Rickshaw refusal
            </span>
          </div>
          <p className="text-lg font-semibold text-slate-800">{insultText}</p>
          <div className="mt-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            <span>Offer</span>
            <span>৳{fare}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
