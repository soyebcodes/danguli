"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDangGuliAudio } from "@/hooks/useDangGuliAudio";
import { ShotResult, useDangGuliStore } from "@/store/dangGuliStore";
import { ArrowRight, RotateCcw, Award } from "lucide-react";

export const DangGuliScoreCard: React.FC = () => {
  const phase = useDangGuliStore((s) => s.phase);
  const lastShot = useDangGuliStore((s) => s.lastShot);
  const gameMode = useDangGuliStore((s) => s.gameMode);
  const currentInning = useDangGuliStore((s) => s.currentInning);
  const maxInnings = useDangGuliStore((s) => s.maxInnings);
  const inningScores = useDangGuliStore((s) => s.inningScores);
  const startNewInning = useDangGuliStore((s) => s.startNewInning);
  const resetTournament = useDangGuliStore((s) => s.resetTournament);

  const audio = useDangGuliAudio();
  const audioRef = useRef(audio);
  audioRef.current = audio;

  // Counting animation for Kaathi
  const [displayCount, setDisplayCount] = useState<number>(0);
  const lastAnimatedShotRef = useRef<ShotResult | null>(null);

  const totalTournamentScore = inningScores.reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (phase !== "turn_ended") {
      lastAnimatedShotRef.current = null;
      return;
    }

    if (!lastShot) return;

    // Avoid restarting the count animation if this exact shot was already animated
    if (lastAnimatedShotRef.current === lastShot) {
      return;
    }
    lastAnimatedShotRef.current = lastShot;

    const target = lastShot.distance;
    if (target <= 0) {
      setDisplayCount(0);
      return;
    }

    let current = 0;
    setDisplayCount(0);
    const step = Math.max(1, Math.floor(target / 18));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplayCount(target);
        clearInterval(interval);
      } else {
        setDisplayCount(current);
        audioRef.current.playKaathiTick(current);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [phase, lastShot]);

  if (phase !== "turn_ended" && phase !== "tournament_over") {
    return null;
  }

  // Determine Title for Tournament Completion
  const getTournamentTitle = (total: number) => {
    if (total >= 1000) {
      return {
        title: "১৯৯০ এর অপরাজিত ইউনিয়ন চ্যাম্পিয়ন! 🏆",
        sub: "তোমার শট গোটা জেলার রেকর্ড ভেঙে দিয়েছে!",
        color: "text-amber-300",
        bg: "from-amber-600 to-yellow-600",
      };
    } else if (total >= 600) {
      return {
        title: "সরিষা ক্ষেত কিংবদন্তি! 🌟",
        sub: "বটগাছ ছাড়ানো দুর্দান্ত সব শট খেলেছ!",
        color: "text-yellow-400",
        bg: "from-yellow-600 to-amber-700",
      };
    } else if (total >= 300) {
      return {
        title: "বটতলার পোড়খাওয়া অলরাউন্ডার! 🪵",
        sub: "দারুণ ফর্ম! গ্রামের পোলাপান তোমার প্রশংসা করছে!",
        color: "text-emerald-400",
        bg: "from-emerald-700 to-teal-800",
      };
    } else {
      return {
        title: "পাড়ার উঠতি খেলোয়াড় 🧒",
        sub: "অনুশীলন চালিয়ে যাও, পরের বার আরও দূর যাবে!",
        color: "text-stone-300",
        bg: "from-stone-700 to-stone-800",
      };
    }
  };

  const tournamentRank = getTournamentTitle(totalTournamentScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-stone-900 to-amber-950 p-6 text-stone-100 shadow-2xl">
        {phase === "turn_ended" ? (
          /* TURN ENDED VIEW */
          <div className="space-y-5 text-center">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1 border border-amber-400/40 text-xs font-black text-amber-300">
              <span>ইনিংস {currentInning} সমাপ্ত</span>
              <span>•</span>
              <span>বাকি {maxInnings - currentInning} ইনিংস</span>
            </div>

            {/* Score in Kaathi */}
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-stone-400">
                কাঠি মেপে মোট অর্জিত দূরত্ব
              </div>
              <div className="mt-2 flex items-baseline justify-center gap-2">
                <span className="text-5xl sm:text-6xl font-black text-amber-300 tracking-tight">
                  {displayCount}
                </span>
                <span className="text-xl font-bold text-amber-500">কাঠি</span>
              </div>
              {/* 4 Kaathi Nostalgic Status Badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border">
                {(lastShot?.distance ?? 0) >= 4 ? (
                  <span className="text-emerald-400 bg-emerald-950/60 border-emerald-500/40 rounded-full px-3 py-0.5">
                    🌟 ৪ কাঠি সফলভাবে পার হয়েছে! (খাঁটি চুট)
                  </span>
                ) : (
                  <span className="text-rose-400 bg-rose-950/60 border-rose-500/40 rounded-full px-3 py-0.5">
                    ⚠️ ৪ কাঠি পার হয়নি (খসানি শট)
                  </span>
                )}
              </div>
            </div>

            {/* Shot Stats & Commentary */}
            <div className="rounded-2xl bg-black/40 p-4 border border-amber-800/30 text-left space-y-2">
              <div className="text-xs font-bold text-stone-400">
                গ্রামের ধারাভাষ্য:
              </div>
              <div className="text-sm font-semibold text-amber-100 italic">
                &ldquo;{lastShot?.commentary}&rdquo;
              </div>

              {lastShot?.bonusTitle && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
                  <span>✨</span>
                  <span>{lastShot.bonusTitle}</span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-stone-800 pt-2 text-xs text-stone-400">
                <span>গতি: {lastShot?.maxSpeed} কিমি/ঘণ্টা</span>
                <span>•</span>
                <span>উচ্চতা: {lastShot?.maxHeight} ফুট</span>
                <span>•</span>
                <span>গুণমান: {lastShot?.quality.toUpperCase()}</span>
              </div>
            </div>

            {/* Next Turn Button */}
            <button
              onClick={startNewInning}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-base font-black text-white hover:brightness-110 active:scale-95 transition shadow-lg shadow-amber-600/30 border border-amber-300/40"
            >
              <span>
                {gameMode === "practice"
                  ? "আবার মারুন (অনুশীলন)"
                  : `পরের ইনিংস খেলুন (${currentInning + 1}/${maxInnings})`}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* TOURNAMENT OVER VIEW */
          <div className="space-y-5 text-center">
            {/* Trophy Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-xl shadow-amber-500/30 text-3xl">
              🏆
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                ১৯৯০ গ্রামীণ টুর্নামেন্ট সমাপ্ত
              </div>
              <h2 className="mt-1 text-2xl font-black text-white">
                ম্যাচ রেজাল্ট শিট
              </h2>
            </div>

            {/* Total Kaathi */}
            <div className="rounded-2xl bg-black/50 p-4 border border-amber-600/40">
              <div className="text-xs font-bold text-stone-400">
                ৫ ইনিংসের মোট স্কোর
              </div>
              <div className="mt-1 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-black text-amber-300">
                  {totalTournamentScore}
                </span>
                <span className="text-lg font-bold text-amber-500">কাঠি</span>
              </div>

              {/* Innings Breakdown */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {inningScores.map((sc, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-lg bg-stone-800/80 px-2.5 py-1 text-[11px] border border-stone-700"
                  >
                    <span className="text-stone-400"># {i + 1}</span>
                    <span className="font-bold text-amber-300">{sc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rank Badge */}
            <div
              className={`rounded-2xl bg-gradient-to-r ${tournamentRank.bg} p-4 text-white shadow-lg`}
            >
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5" />
                <h3 className="text-base font-black">
                  {tournamentRank.title}
                </h3>
              </div>
              <p className="mt-1 text-xs opacity-90">
                {tournamentRank.sub}
              </p>
            </div>

            {/* Play Again Button */}
            <button
              onClick={resetTournament}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-base font-black text-white hover:brightness-110 active:scale-95 transition shadow-lg shadow-amber-600/30 border border-amber-300/40"
            >
              <RotateCcw className="h-5 w-5" />
              <span>আবার নতুন টুর্নামেন্ট শুরু করো</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
