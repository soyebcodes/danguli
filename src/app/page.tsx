"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, PiggyBank, Sparkles } from "lucide-react";
import { useMemo } from "react";

import { PotholeMiniGame } from "@/components/rickshaw/PotholeMiniGame";
import { RickshawScene } from "@/components/rickshaw/RickshawScene";
import { ShareCard } from "@/components/ui/ShareCard";
import { StatBadge } from "@/components/ui/StatBadge";
import { getRandomExcuseForRoute } from "@/data/excuses";
import { routeOptions, routeProfiles } from "@/data/routes";
import { useSoundFX } from "@/hooks/useSoundFX";
import { useGameStore } from "@/store/gameStore";

export default function HomePage() {
  const {
    selectedRoute,
    fare,
    triggerCount,
    insultText,
    isEscaping,
    stats,
    setSelectedRoute,
    setFare,
    increaseFare,
    setInsultText,
    setIsEscaping,
    registerRefusal,
    resetStats,
  } = useGameStore();
  const { playBell, playWhistle } = useSoundFX();
  const routeProfile = routeProfiles[selectedRoute];

  const mood = useMemo(() => {
    if (fare <= 40) {
      return { emoji: "😠", label: "Furious face", tone: "text-rose-300" };
    }
    if (fare <= 150) {
      return { emoji: "😒", label: "Unimpressed", tone: "text-amber-300" };
    }
    return {
      emoji: "🤑",
      label: "Dollar-sign stare",
      tone: "text-emerald-300",
    };
  }, [fare]);

  const showPotholeMode = fare > 250;
  const routePressure = Math.min(
    100,
    Math.round((routeProfile.demand + fare / 5) / 1.65),
  );

  const challengeCards = [
    {
      title: 'Refusal streak',
      value: triggerCount,
      target: 5,
      suffix: 'runs',
      hint: 'Keep the traffic lane blocked.',
      tone: 'from-rose-500 to-pink-500',
    },
    {
      title: 'Fake fare bank',
      value: stats.totalFare,
      target: 2000,
      suffix: '৳',
      hint: 'Stack enough fake money to impress everyone.',
      tone: 'from-amber-500 to-yellow-400',
    },
    {
      title: 'Route heat',
      value: routePressure,
      target: 90,
      suffix: '%',
      hint: `${selectedRoute} is feeling the pressure.`,
      tone: 'from-emerald-500 to-teal-500',
    },
  ].map((challenge) => ({
    ...challenge,
    progress: Math.min(100, Math.round((challenge.value / challenge.target) * 100)),
  }));

  const handleReject = () => {
    const nextExcuse = getRandomExcuseForRoute(selectedRoute);
    setInsultText(nextExcuse);
    registerRefusal(fare, nextExcuse);
    playBell();
    playWhistle();

    window.setTimeout(() => setIsEscaping(false), 900);
  };

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 rounded-[30px] border-4 border-amber-300 bg-white/70 p-5 shadow-panel backdrop-blur-sm"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">
                Bangladesh ride refusal simulator
              </p>
              <h1 className="mt-2 text-4xl font-black text-slate-900 md:text-5xl">
                Amader Rickshaw Mama
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                Refusal streak:{" "}
                <span className="font-bold text-rose-500">{triggerCount}</span>
              </div>
              <button
                type="button"
                onClick={resetStats}
                className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-200"
              >
                Reset
              </button>
            </div>
          </div>
        </motion.header>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <RickshawScene
            triggerCount={triggerCount}
            insultText={insultText}
            fare={fare}
            isEscaping={isEscaping}
          />

          <aside className="rounded-[28px] bg-slate-900 p-5 text-white shadow-panel md:p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Haggle & refuse</h2>
              <div className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                live
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Popular route
                </span>
                <select
                  value={selectedRoute}
                  onChange={(event) => {
                    const route = event.target.value as (typeof routeOptions)[number];
                    setSelectedRoute(route);
                    setFare(routeProfiles[route].baseFare);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-amber-400"
                >
                  {routeOptions.map((route) => (
                    <option
                      key={route}
                      value={route}
                      className="text-slate-900"
                    >
                      {route}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-300">
                  <span>Fare offer</span>
                  <span className="text-xl font-bold text-amber-300">
                    ৳{fare}
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={500}
                  value={fare}
                  onChange={(event) => setFare(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-amber-400"
                />
              </div>

              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-200">
                  <PiggyBank className="h-4 w-4" />
                  Fare reaction
                </div>
                <p className={`mt-2 text-xl font-bold ${mood.tone}`}>
                  {mood.emoji} {mood.label}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-300">
                  <span>Route pressure</span>
                  <span className="font-bold text-amber-300">{routePressure}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-300"
                    style={{ width: `${routePressure}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-200">{routeProfile.heat}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleReject}
                  className="rounded-2xl bg-rose-500 px-4 py-3 font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400"
                >
                  মামু যাইবেন?
                </button>
                <button
                  type="button"
                  onClick={() => increaseFare(25)}
                  className="rounded-2xl bg-emerald-500 px-4 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                >
                  Increase offer
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <MapPin className="h-4 w-4 text-emerald-300" />
                  Selected route
                </div>
                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedRoute}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-emerald-300">
                  {routeProfile.zone}
                </p>
                <p className="mt-2 text-sm text-slate-200">{routeProfile.vibe}</p>
                <p className="mt-2 text-sm font-medium text-amber-300">
                  Suggested base fare: ৳{routeProfile.baseFare}
                </p>
              </div>

              {showPotholeMode && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-rose-500/10 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                      <Sparkles className="h-4 w-4" />
                      Road hazard mode
                    </div>
                    <ArrowRight className="h-4 w-4 text-amber-300" />
                  </div>
                  <p className="text-sm text-slate-200">
                    High fare triggers the pothole balance challenge.
                  </p>
                </motion.div>
              )}
            </div>
          </aside>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatBadge label="Refusals" value={stats.refusals} />
          <StatBadge label="Fake money" value={`৳${stats.totalFare}`} />
          <StatBadge label="Badges" value={stats.badges.length} />
        </div>

        <div className="mt-6 rounded-[28px] border border-amber-300 bg-white/60 p-4 backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
            <Sparkles className="h-4 w-4" />
            Unlocks
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <section className="mt-6 rounded-[28px] border border-slate-200 bg-slate-900 p-5 text-white shadow-panel md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
                Mission board
              </p>
              <h3 className="mt-2 text-2xl font-black">Street challenge tracker</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">
              live
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {challengeCards.map((challenge) => (
              <div
                key={challenge.title}
                className="rounded-[22px] border border-white/10 bg-white/5 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-200">
                    {challenge.title}
                  </p>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
                    {challenge.value}
                    {challenge.suffix}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-700/80">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${challenge.tone}`}
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>

                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {challenge.progress}% / 100%
                </p>
                <p className="mt-2 text-sm text-slate-300">{challenge.hint}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6">
          <ShareCard route={selectedRoute} fare={fare} text={insultText} />
        </div>

        {showPotholeMode && (
          <div className="mt-6">
            <PotholeMiniGame />
          </div>
        )}
      </div>
    </main>
  );
}
