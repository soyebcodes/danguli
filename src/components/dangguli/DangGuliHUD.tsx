"use client";

import React from "react";
import { DANG_STICKS, GULI_TYPES } from "@/data/dangGuliData";
import { useDangGuliStore } from "@/store/dangGuliStore";
import {
  BookOpen,
  ShoppingBag,
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";

interface DangGuliHUDProps {
  onOpenGear: () => void;
  onOpenRules: () => void;
}

export const DangGuliHUD: React.FC<DangGuliHUDProps> = ({
  onOpenGear,
  onOpenRules,
}) => {
  const currentInning = useDangGuliStore((s) => s.currentInning);
  const maxInnings = useDangGuliStore((s) => s.maxInnings);
  const inningScores = useDangGuliStore((s) => s.inningScores);
  const gameMode = useDangGuliStore((s) => s.gameMode);
  const totalCareerKaathi = useDangGuliStore((s) => s.totalCareerKaathi);
  const bestShotDistance = useDangGuliStore((s) => s.bestShotDistance);
  const soundEnabled = useDangGuliStore((s) => s.soundEnabled);
  const toggleSound = useDangGuliStore((s) => s.toggleSound);
  const resetTournament = useDangGuliStore((s) => s.resetTournament);
  const selectedStickId = useDangGuliStore((s) => s.selectedStickId);
  const selectedGuliId = useDangGuliStore((s) => s.selectedGuliId);

  const stick = DANG_STICKS.find((s) => s.id === selectedStickId) || DANG_STICKS[0];
  const guli = GULI_TYPES.find((g) => g.id === selectedGuliId) || GULI_TYPES[0];

  const tournamentTotal = inningScores.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-3">
      {/* Top Header / Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-stone-900/90 p-4 border border-amber-600/30 shadow-xl backdrop-blur-md">
        {/* Game Title & Vintage 90s Badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 border-2 border-amber-500/50 text-2xl shadow-inner">
            🪵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-amber-100 tracking-tight">
                ডাংগুলি ১৯৯০
              </h1>
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-950">
                গ্রামীণ শৈশব
              </span>
            </div>
            <p className="text-xs text-amber-300/80">
              নব্বইয়ের দশকের খাঁটি গ্রাম্য ব্যাটিং ও কাঠি গণনার খেলা
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Rules / Lore Button */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 rounded-xl bg-amber-900/60 px-3.5 py-2 text-xs font-bold text-amber-200 border border-amber-700/50 hover:bg-amber-850 hover:text-white transition shadow-sm"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">খেলার নিয়ম</span>
          </button>

          {/* Gear / Shop Button */}
          <button
            onClick={onOpenGear}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-3.5 py-2 text-xs font-black text-white hover:brightness-110 transition shadow-md border border-amber-400/40"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>লাঠি ও গুলি</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800/80 text-amber-300 border border-stone-700 hover:bg-stone-700 transition"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 text-stone-400" />
            )}
          </button>

          {/* Reset Tournament */}
          <button
            onClick={resetTournament}
            aria-label="Reset game"
            title="নতুন ম্যাচ শুরু"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800/80 text-amber-300 border border-stone-700 hover:bg-stone-700 transition"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Score & Inning Stats Card */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Tournament Score */}
        <div className="flex flex-col justify-between rounded-xl bg-amber-950/40 p-3.5 border border-amber-600/30 backdrop-blur-sm">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            {gameMode === "tournament" ? "টুর্নামেন্ট মোট রান" : "শেষ শট"}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {tournamentTotal}
            </span>
            <span className="text-xs font-bold text-amber-400">কাঠি</span>
          </div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: maxInnings }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i < inningScores.length
                    ? "bg-amber-400 shadow-sm"
                    : i === currentInning - 1
                    ? "bg-amber-500/50 animate-pulse"
                    : "bg-stone-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Inning Indicator */}
        <div className="flex flex-col justify-between rounded-xl bg-amber-950/40 p-3.5 border border-amber-600/30 backdrop-blur-sm">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            বর্তমান ইনিংস
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-200">
              {currentInning}
            </span>
            <span className="text-sm font-semibold text-stone-400">
              / {maxInnings}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-stone-300 truncate">
            {inningScores.length > 0
              ? `ইনিংস স্কোর: ${inningScores.join(", ")}`
              : "প্রথম বাড়ির অপেক্ষা"}
          </div>
        </div>

        {/* Highest Single Shot Record */}
        <div className="flex flex-col justify-between rounded-xl bg-amber-950/40 p-3.5 border border-amber-600/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              সর্বোচ্চ বাড়ি
            </div>
            <Trophy className="h-3.5 w-3.5 text-yellow-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-yellow-300">
              {bestShotDistance}
            </span>
            <span className="text-xs font-bold text-yellow-500">কাঠি</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-300">
            {bestShotDistance > 300
              ? "🌟 বটগাছ ছাড়ানো শট!"
              : bestShotDistance > 100
              ? "🌾 সরিষা ক্ষেত পার"
              : "স্কুল মাঠ রেকর্ড"}
          </div>
        </div>

        {/* Gear Equipped Badge */}
        <div className="flex flex-col justify-between rounded-xl bg-amber-950/40 p-3.5 border border-amber-600/30 backdrop-blur-sm">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            ব্যবহৃত হাতিয়ার
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-white truncate">
              <span>🪄</span>
              <span>{stick.nameBn}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 truncate">
              <span>🪵</span>
              <span>{guli.nameBn}</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-amber-400/90 font-medium">
            মোট জমানো কাঠি: {totalCareerKaathi}
          </div>
        </div>
      </div>
    </div>
  );
};

