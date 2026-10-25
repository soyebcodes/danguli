"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, PiggyBank, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PotholeMiniGame } from "@/components/rickshaw/PotholeMiniGame";
import { RickshawScene } from "@/components/rickshaw/RickshawScene";
import { ShareCard } from "@/components/ui/ShareCard";
import { StatBadge } from "@/components/ui/StatBadge";
import { getRandomExcuseForRoute } from "@/data/excuses";
import { routeOptions, routeProfiles } from "@/data/routes";
import { useSoundFX } from "@/hooks/useSoundFX";
import { useGameStore } from "@/store/gameStore";

const streetEvents = [
  {
    name: 'Rush-hour surge',
    mood: 'Crowds are dense and the riders are already shouting over each other.',
    modifier: 20,
    accent: 'text-amber-300',
  },
  {
    name: 'Rain slick',
    mood: 'The lane is slippery and everyone wants to avoid getting stuck in traffic.',
    modifier: 30,
    accent: 'text-cyan-300',
  },
  {
    name: 'Market jam',
    mood: 'A packed bazaar makes every rider feel like the lane is theirs.',
    modifier: 40,
    accent: 'text-emerald-300',
  },
  {
    name: 'Police check',
    mood: 'The route is tighter, but the story needs to stay calm and deliberate.',
    modifier: -10,
    accent: 'text-violet-300',
  },
] as const;

const cityIncidents = [
  {
    name: 'Broken brake light',
    mood: 'Someone is impatient enough to argue over a tiny delay.',
    modifier: 15,
    accent: 'text-rose-300',
  },
  {
    name: 'Street prayer call',
    mood: 'The call pauses the lane for a second and everyone gets dramatic.',
    modifier: 12,
    accent: 'text-amber-300',
  },
  {
    name: 'Roadside gossip',
    mood: 'A crowd starts narrating your refusal like it is a neighborhood event.',
    modifier: 22,
    accent: 'text-violet-300',
  },
  {
    name: 'Cooling breeze',
    mood: 'A calmer moment lets you hold the line without extra noise.',
    modifier: -8,
    accent: 'text-cyan-300',
  },
] as const;

const tactics = [
  { label: 'Hold the line', bonus: 1, note: 'Steady refusal with no extra noise.' },
  { label: 'Break the rhythm', bonus: 1.25, note: 'Mute the rider, then drag the argument out.' },
  { label: 'Turn the crowd', bonus: 1.5, note: 'Use the crowd as your witness and force a scene.' },
] as const;

const riderArchetypes = [
  {
    name: 'Office commuter',
    threat: 'Quick to bargain and quicker to shame a slow answer.',
    bonus: 1.1,
    pressure: 'Needs a fast response',
  },
  {
    name: 'Student rider',
    threat: 'Loud, dramatic, but easy to redirect with a confident line.',
    bonus: 1.25,
    pressure: 'Creates a scene without much leverage',
  },
  {
    name: 'Market negotiator',
    threat: 'Acts like every price is still open for debate.',
    bonus: 1.45,
    pressure: 'High ego and stubborn bargaining',
  },
  {
    name: 'Family rider',
    threat: 'Calm on the surface but deeply annoyed by any delay.',
    bonus: 1.2,
    pressure: 'Patient, but a poor excuse will escalate fast',
  },
] as const;

const trafficShifts = [
  {
    name: 'Morning rush',
    bonus: 1.1,
    mood: 'Crowded roads, rushed riders, and sharper tempers.',
  },
  {
    name: 'Midday drift',
    bonus: 1.25,
    mood: 'People are tired but still willing to debate every price.',
  },
  {
    name: 'Evening gridlock',
    bonus: 1.4,
    mood: 'Street energy peaks and every rider looks ready to explode.',
  },
  {
    name: 'Night calm',
    bonus: 0.95,
    mood: 'Less noise, more patience, and a quieter negotiation rhythm.',
  },
] as const;

const citySeasons = [
  {
    name: 'Dawn patrol',
    multiplier: 1,
    description: 'The road is still waking up and the first arguments are mostly routine.',
    hue: 'from-amber-200 via-orange-100 to-rose-100',
  },
  {
    name: 'Rush-hour siege',
    multiplier: 1.15,
    description: 'The lane is crowded, hot, and every rider wants a faster answer.',
    hue: 'from-rose-200 via-orange-100 to-amber-100',
  },
  {
    name: 'Monsoon grid',
    multiplier: 1.22,
    description: 'Rain makes people louder, slower, and more dramatic than the weather itself.',
    hue: 'from-sky-200 via-cyan-100 to-indigo-100',
  },
  {
    name: 'Night kingpin',
    multiplier: 1.3,
    description: 'The city settles in and the loudest ego wins the first argument.',
    hue: 'from-violet-200 via-indigo-100 to-slate-100',
  },
] as const;

const ambiencePresets = [
  {
    name: 'Golden dusk',
    background: 'radial-gradient(circle at top, rgba(251,191,36,0.28), transparent 25%), linear-gradient(135deg, #fff7ed 0%, #fef9c3 44%, #fde68a 100%)',
    card: 'from-amber-100 via-white to-orange-100',
    accent: '#f59e0b',
    description: 'Warm, cinematic, and full of street-sunset energy.',
    glow: 'rgba(251, 191, 36, 0.22)',
  },
  {
    name: 'Neon night',
    background: 'radial-gradient(circle at top, rgba(16,185,129,0.16), transparent 24%), linear-gradient(135deg, #020617 0%, #0f172a 42%, #111827 100%)',
    card: 'from-slate-900 via-slate-800 to-emerald-950',
    accent: '#34d399',
    description: 'Deep night tones, neon light, and a late-city mood.',
    glow: 'rgba(52, 211, 153, 0.22)',
  },
  {
    name: 'Monsoon haze',
    background: 'radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 26%), linear-gradient(135deg, #eff6ff 0%, #dbeafe 38%, #bfdbfe 100%)',
    card: 'from-sky-100 via-white to-indigo-100',
    accent: '#3b82f6',
    description: 'Mistier tones with a cool rainy street atmosphere.',
    glow: 'rgba(59, 130, 246, 0.18)',
  },
] as const;

const cosmeticThemes = [
  {
    name: 'Rickshaw red',
    background: 'linear-gradient(135deg, #fff7ed 0%, #fee2e2 32%, #fecaca 100%)',
    accent: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.18)',
    note: 'Classic painted tin-plate energy with roadside heat.',
  },
  {
    name: 'Night neon',
    background: 'linear-gradient(135deg, #020617 0%, #111827 35%, #0f172a 100%)',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.18)',
    note: 'Late city glow with a sharper, cooler edge.',
  },
  {
    name: 'Monsoon silver',
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 38%, #bfdbfe 100%)',
    accent: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.14)',
    note: 'Cool rain-slick shades with a softer urban mood.',
  },
] as const;

const refusalStyles = [
  {
    name: 'Deadpan',
    bonus: 1.1,
    flair: 'Silent, calm, and impossible to rattle.',
  },
  {
    name: 'Theatrical',
    bonus: 1.25,
    flair: 'Big gesture, sharper language, louder crowd effect.',
  },
  {
    name: 'Knife-edge',
    bonus: 1.4,
    flair: 'Quick, cold, and merciless under pressure.',
  },
  {
    name: 'Friendly but firm',
    bonus: 1.05,
    flair: 'Smooth tone that holds the line without exploding the scene.',
  },
] as const;

export default function HomePage() {
  const {
    selectedRoute,
    fare,
    triggerCount,
    bestStreak,
    insultText,
    isEscaping,
    stats,
    career,
    soundEnabled,
    volume,
    recentLog,
    currentChallenge,
    setSelectedRoute,
    setFare,
    increaseFare,
    setInsultText,
    setIsEscaping,
    setSoundEnabled,
    setVolume,
    registerRefusal,
    unlockBadge,
    unlockRoute,
    recordRunSummary,
    logEvent,
    resetStats,
  } = useGameStore();
  const { playBell, playWhistle } = useSoundFX();
  const routeProfile = routeProfiles[selectedRoute];
  const [routeEvent, setRouteEvent] = useState<(typeof streetEvents)[number]>(streetEvents[0]);
  const [selectedTactic, setSelectedTactic] = useState<(typeof tactics)[number]>(tactics[0]);
  const [selectedRider, setSelectedRider] = useState<(typeof riderArchetypes)[number]>(riderArchetypes[0]);
  const [selectedShift, setSelectedShift] = useState<(typeof trafficShifts)[number]>(trafficShifts[2]);
  const [selectedStyle, setSelectedStyle] = useState<(typeof refusalStyles)[number]>(refusalStyles[0]);
  const [selectedSeason, setSelectedSeason] = useState<(typeof citySeasons)[number]>(citySeasons[1]);
  const [selectedAmbience, setSelectedAmbience] = useState<(typeof ambiencePresets)[number]>(ambiencePresets[0]);
  const [selectedTheme, setSelectedTheme] = useState<(typeof cosmeticThemes)[number]>(cosmeticThemes[0]);
  const [selectedIncident, setSelectedIncident] = useState<(typeof cityIncidents)[number]>(cityIncidents[0]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [showRunSummary, setShowRunSummary] = useState(false);
  const [bossEncounterOpen, setBossEncounterOpen] = useState(false);

  useEffect(() => {
    setStoryIndex(0);
  }, [selectedRoute]);

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
  const routeObjectiveTarget = Math.max(3, Math.round(routeProfile.demand / 25));
  const routeObjectiveProgress = Math.min(
    100,
    Math.round((triggerCount / routeObjectiveTarget) * 100),
  );
  const campaignProgress = Math.min(
    100,
    Math.round((currentChallenge.progress / currentChallenge.target) * 100),
  );
  const routeObjectiveComplete = triggerCount >= routeObjectiveTarget;
  const reputationScore = Math.min(
    9999,
    stats.refusals * 180 + stats.totalFare * 2 + bestStreak * 120,
  );
  const cityMilestones = [
    { title: 'Street rookie', threshold: 0, detail: 'The lane still thinks you are testing the waters.' },
    { title: 'Lane legend', threshold: 8, detail: 'Your refusal game has become a neighborhood myth.' },
    { title: 'Route boss', threshold: 20, detail: 'Drivers in this city know your name before you speak.' },
    { title: 'City icon', threshold: 35, detail: 'Every rider is now reading the room before the bargain even starts.' },
  ] as const;
  let cityRankIndex = 0;
  for (let index = cityMilestones.length - 1; index >= 0; index -= 1) {
    if (stats.refusals >= cityMilestones[index].threshold) {
      cityRankIndex = index;
      break;
    }
  }
  const cityRank = cityMilestones[cityRankIndex];
  const nextMilestone =
    cityRankIndex < cityMilestones.length - 1
      ? cityMilestones[cityRankIndex + 1]
      : null;
  const cityControl = Math.min(
    100,
    Math.round((stats.refusals * 10 + bestStreak * 12 + routePressure * 0.55) / 1.4),
  );
  const routeProgress = routeOptions.map((route) => {
    const profile = routeProfiles[route];
    const baseProgress = Math.min(
      100,
      Math.round(
        ((route === selectedRoute ? 20 : 0) +
          (stats.refusals > 0 ? Math.min(60, stats.refusals * 5) : 0) +
          profile.demand +
          Math.min(25, Math.round(stats.totalFare / 60))) /
          1.6,
      ),
    );

    return {
      route,
      progress: baseProgress,
      unlocked: route === selectedRoute || stats.refusals > 0 || routeObjectiveComplete,
      focus: route === selectedRoute ? 'Hot lane' : 'City lane',
    };
  });
  const unlockedRiders = useMemo(() => {
    const availability = riderArchetypes.filter((rider, index) => {
      if (index === 0) return true;
      if (bestStreak >= index + 1) return true;
      return stats.refusals >= index * 4 + 5;
    });

    return new Set(availability.map((rider) => rider.name));
  }, [bestStreak, stats.refusals]);
  const seasonLeaderboard = useMemo(
    () => career.leaderboard.filter((entry) => entry.season === selectedSeason.name),
    [career.leaderboard, selectedSeason.name],
  );
  const routeBosses = routeOptions.map((route) => ({
    route,
    boss: `${route.split('→')[0].trim()} boss`,
    progress: Math.min(
      100,
      Math.round(
        ((route === selectedRoute ? 22 : 0) +
          (stats.refusals > 0 ? Math.min(60, stats.refusals * 4) : 0) +
          routeProfiles[route].demand * 0.4 +
          bestStreak * 4) /
          1.55,
      ),
    ),
    title: route === selectedRoute ? 'Active boss lane' : 'City route',
  }));
  const starringRoute = routeProgress.reduce((best, route) =>
    route.progress > best.progress ? route : best,
  );
  const runSummary = {
    finalScore: Math.min(9999, reputationScore),
    strongestStyle: selectedStyle.name,
    strongestShift: selectedShift.name,
    bestRoute: starringRoute.route,
    topMode: routeObjectiveComplete ? 'route mastered' : 'lane pressure rising',
  };
  const summaryHeadline =
    reputationScore >= 2500
      ? 'Legendary city dodger'
      : routeObjectiveComplete
        ? 'Street tactician'
        : 'Street veteran';
  const comboMultiplier = (1 + Math.min(bestStreak, 10) / 10).toFixed(1);
  const momentum = Math.min(
    100,
    Math.round(bestStreak * 18 + triggerCount * 8 + routePressure * 0.45),
  );
  const momentumLabel =
    momentum < 35 ? 'Calm lane' : momentum < 70 ? 'Rising heat' : 'Street riot';
  const momentumTone =
    momentum < 35
      ? 'from-slate-400 to-slate-500'
      : momentum < 70
        ? 'from-emerald-400 to-amber-400'
        : 'from-rose-500 to-orange-500';
  const ambienceStyle = {
    background: selectedAmbience.background,
    boxShadow: `0 22px 60px ${selectedAmbience.glow}`,
  } as const;
  const activeStory = routeProfile.story[storyIndex % routeProfile.story.length];
  const routeSummaries = routeOptions.map((route) => ({
    route,
    legend: routeProfiles[route].legend,
    zone: routeProfiles[route].zone,
    vibe: routeProfiles[route].vibe,
  }));
  const bossEncounter = {
    name: `${selectedRoute.split('→')[0].trim()} boss`,
    pressure: Math.min(100, routePressure + 10),
    detail: `This route warlord is testing whether you can hold the lane against ${selectedRoute}.`,
  };

  const challengeDeck = [
    {
      label: 'Cash gate',
      unlocked: stats.totalFare >= 600,
      reward: '৳600+ fake money',
      copy: 'Keep the fare high enough to trigger a traffic scene.',
    },
    {
      label: 'Crowd holdout',
      unlocked: bestStreak >= 4,
      reward: '4-turn streak',
      copy: 'Refuse back-to-back riders without breaking momentum.',
    },
    {
      label: 'Road boss',
      unlocked: routePressure >= 75,
      reward: 'route pressure above 75%',
      copy: 'Push this route into peak traffic chaos and survive.',
    },
  ];

  useEffect(() => {
    if (routeObjectiveComplete) {
      unlockBadge(`${selectedRoute} specialist`);
      unlockRoute(selectedRoute);
    }
  }, [routeObjectiveComplete, selectedRoute, unlockBadge, unlockRoute]);

  useEffect(() => {
    if (stats.refusals >= 3) {
      unlockRoute(selectedRoute);
    }
  }, [selectedRoute, stats.refusals, unlockRoute]);

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

  const dailyChallenges = useMemo(
    () => [
      {
        id: 'street-boss',
        title: 'Street boss',
        description: 'Hold a refusal streak above 3.',
        value: bestStreak,
        target: 3,
        reward: 'Boss aura',
        tone: 'from-violet-500 to-fuchsia-500',
      },
      {
        id: 'fare-command',
        title: 'Fare command',
        description: 'Build a fake fare total of ৳1,200 or more.',
        value: stats.totalFare,
        target: 1200,
        reward: 'Cash swagger',
        tone: 'from-amber-500 to-orange-500',
      },
      {
        id: 'lane-pressure',
        title: 'Lane pressure',
        description: 'Push selected route heat above 75%.',
        value: routePressure,
        target: 75,
        reward: 'City fear',
        tone: 'from-emerald-500 to-teal-500',
      },
    ].map((challenge) => ({
      ...challenge,
      progress: Math.min(100, Math.round((challenge.value / challenge.target) * 100)),
      complete: challenge.value >= challenge.target,
    })),
    [bestStreak, routePressure, stats.totalFare],
  );

  useEffect(() => {
    if (!unlockedRiders.has(selectedRider.name)) {
      setSelectedRider(riderArchetypes[0]);
    }
  }, [selectedRider.name, unlockedRiders]);

  useEffect(() => {
    if (routePressure >= 80) {
      setBossEncounterOpen(true);
    }
  }, [routePressure]);

  const handleBossResolve = (choice: 'hold' | 'counter' | 'dodge') => {
    const bossPower = routePressure + selectedStyle.bonus * 25 + selectedRider.bonus * 18;
    const victory =
      (choice === 'hold' && bossPower >= 100) ||
      (choice === 'counter' && bossPower >= 95) ||
      (choice === 'dodge' && bossPower >= 90);

    if (victory) {
      unlockBadge(`${selectedRoute.split('→')[0].trim()} boss breaker`);
      logEvent(`${selectedRoute} warlord defeated with a ${selectedStyle.name.toLowerCase()} line.`);
    } else {
      logEvent(`${selectedRoute} warlord pushed back the lane and raised the cost.`);
    }

    setBossEncounterOpen(false);
  };

  const handleReject = () => {
    const nextExcuse = getRandomExcuseForRoute(selectedRoute);
    const effectiveFare = Math.min(
      500,
      Math.max(
        20,
        Math.round(
          (fare + routeEvent.modifier + selectedIncident.modifier) *
            selectedTactic.bonus *
            selectedRider.bonus *
            selectedShift.bonus *
            selectedStyle.bonus *
            selectedSeason.multiplier,
        ),
      ),
    );

    setInsultText(nextExcuse);
    registerRefusal(effectiveFare, nextExcuse);
    logEvent(
      `${selectedStyle.name} style on ${selectedRoute} • ${selectedShift.name}: ${routeEvent.name} is active.`,
    );
    setStoryIndex((current) => (current + 1) % routeProfile.story.length);
    playBell();
    playWhistle();

    window.setTimeout(() => setIsEscaping(false), 900);
  };

  return (
    <main
      className="min-h-screen px-4 py-8 md:px-8"
      style={{
        ...ambienceStyle,
        background: selectedTheme.background,
        boxShadow: `0 22px 60px ${selectedTheme.glow}`,
      }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 rounded-[30px] border-4 border-amber-300 bg-white/70 p-5 shadow-panel backdrop-blur-sm"
          style={{ boxShadow: `0 22px 60px ${selectedAmbience.glow}` }}
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
                onClick={() => setShowRunSummary(true)}
                className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 transition hover:bg-emerald-200"
              >
                End run
              </button>
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

              <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-violet-500/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-amber-200">Street event</div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = streetEvents.findIndex(
                        (event) => event.name === routeEvent.name,
                      );
                      const nextIndex = (currentIndex + 1) % streetEvents.length;
                      setRouteEvent(streetEvents[nextIndex]);
                    }}
                    className="rounded-full border border-white/10 bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-100"
                  >
                    Shift scene
                  </button>
                </div>
                <p className={`mt-3 text-lg font-black ${routeEvent.accent}`}>
                  {routeEvent.name}
                </p>
                <p className="mt-2 text-sm text-slate-200">{routeEvent.mood}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-amber-200">
                  Bonus: {routeEvent.modifier > 0 ? '+' : ''}
                  {routeEvent.modifier}৳
                </p>
              </div>

              <div className="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-4">
                <div className="mb-3 text-sm font-semibold text-violet-200">City incident</div>
                <div className="flex flex-wrap gap-2">
                  {cityIncidents.map((incident) => (
                    <button
                      key={incident.name}
                      type="button"
                      onClick={() => setSelectedIncident(incident)}
                      className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] transition ${
                        selectedIncident.name === incident.name
                          ? 'border-violet-400 bg-violet-400/10 text-violet-100'
                          : 'border-white/10 bg-slate-800 text-slate-200'
                      }`}
                    >
                      {incident.name}
                    </button>
                  ))}
                </div>
                <p className={`mt-3 text-sm font-semibold ${selectedIncident.accent}`}>
                  {selectedIncident.name}
                </p>
                <p className="mt-1 text-xs text-slate-300">{selectedIncident.mood}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 text-sm font-medium text-slate-300">Tactical play</div>
                <div className="space-y-2">
                  {tactics.map((tactic) => (
                    <button
                      key={tactic.label}
                      type="button"
                      onClick={() => setSelectedTactic(tactic)}
                      className={`w-full rounded-2xl border px-3 py-2 text-left transition ${
                        selectedTactic.label === tactic.label
                          ? 'border-amber-400 bg-amber-400/10 text-amber-100'
                          : 'border-white/10 bg-slate-800 text-slate-200 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{tactic.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                          x{tactic.bonus.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300">{tactic.note}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-4">
                <div className="mb-3 text-sm font-semibold text-emerald-200">Rider profile</div>
                <div className="space-y-2">
                  {riderArchetypes.map((rider) => {
                    const unlocked = unlockedRiders.has(rider.name);
                    return (
                      <button
                        key={rider.name}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => setSelectedRider(rider)}
                        className={`w-full rounded-2xl border px-3 py-2 text-left transition ${
                          selectedRider.name === rider.name
                            ? 'border-emerald-400 bg-emerald-400/10 text-emerald-100'
                            : 'border-white/10 bg-slate-800 text-slate-200 hover:border-white/20'
                        } ${!unlocked ? 'cursor-not-allowed opacity-45' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{rider.name}</span>
                          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                            {unlocked ? `x${rider.bonus.toFixed(2)}` : 'Locked'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-300">{rider.pressure}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4">
                <div className="mb-3 text-sm font-semibold text-cyan-200">Traffic shift</div>
                <div className="space-y-2">
                  {trafficShifts.map((shift) => (
                    <button
                      key={shift.name}
                      type="button"
                      onClick={() => setSelectedShift(shift)}
                      className={`w-full rounded-2xl border px-3 py-2 text-left transition ${
                        selectedShift.name === shift.name
                          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100'
                          : 'border-white/10 bg-slate-800 text-slate-200 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{shift.name}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                          x{shift.bonus.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300">{shift.mood}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-rose-400/30 bg-gradient-to-br from-rose-500/10 to-orange-500/10 p-4">
                <div className="mb-3 text-sm font-semibold text-rose-200">Refusal style</div>
                <div className="space-y-2">
                  {refusalStyles.map((style) => (
                    <button
                      key={style.name}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`w-full rounded-2xl border px-3 py-2 text-left transition ${
                        selectedStyle.name === style.name
                          ? 'border-rose-400 bg-rose-400/10 text-rose-100'
                          : 'border-white/10 bg-slate-800 text-slate-200 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{style.name}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                          x{style.bonus.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300">{style.flair}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-300">Street audio</div>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="rounded-full border border-white/10 bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-100"
                  >
                    {soundEnabled ? 'On' : 'Off'}
                  </button>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="mt-3 h-2 w-full cursor-pointer accent-amber-400"
                />
                <div className="mt-1 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  <span>Quiet</span>
                  <span>{volume}%</span>
                  <span>Loud</span>
                </div>
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
          <StatBadge label="Refusals" value={stats.refusals} accent="rose" />
          <StatBadge label="Fake money" value={`৳${stats.totalFare}`} accent="amber" />
          <StatBadge label="Badges" value={stats.badges.length} accent="emerald" />
        </div>

        <section className="mt-6 rounded-[28px] border border-white/60 bg-white/60 p-5 shadow-panel backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                City ambience
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">Street mood</h3>
            </div>
            <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
              {selectedAmbience.name}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {ambiencePresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setSelectedAmbience(preset)}
                className={`rounded-[22px] border p-3 text-left transition ${
                  selectedAmbience.name === preset.name
                    ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                    : 'border-white/70 bg-white/70 text-slate-700 hover:border-slate-300'
                }`}
                style={{ background: preset.background }}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold">{preset.name}</span>
                  <span className="h-3 w-3 rounded-full" style={{ background: preset.accent }} />
                </div>
                <p className={`text-xs ${selectedAmbience.name === preset.name ? 'text-slate-200' : 'text-slate-600'}`}>
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-white/60 bg-white/60 p-5 shadow-panel backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                Cosmetic garage
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">Theme unlocks</h3>
            </div>
            <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
              {selectedTheme.name}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {cosmeticThemes.map((theme) => (
              <button
                key={theme.name}
                type="button"
                onClick={() => setSelectedTheme(theme)}
                className={`rounded-[22px] border p-3 text-left transition ${
                  selectedTheme.name === theme.name
                    ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                    : 'border-white/70 bg-white/70 text-slate-700 hover:border-slate-300'
                }`}
                style={{ background: theme.background }}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold">{theme.name}</span>
                  <span className="h-3 w-3 rounded-full" style={{ background: theme.accent }} />
                </div>
                <p className={`text-xs ${selectedTheme.name === theme.name ? 'text-slate-200' : 'text-slate-600'}`}>
                  {theme.note}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[28px] border border-amber-300 bg-gradient-to-br from-amber-100 via-white to-rose-100 p-5 shadow-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              Street reputation
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-4xl font-black text-slate-900">{reputationScore}</div>
                <p className="mt-1 text-sm text-slate-600">Total reputation score</p>
              </div>
              <div className="rounded-full border border-amber-300 bg-white/70 px-3 py-1 text-sm font-bold text-amber-800">
                x{comboMultiplier}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/80 bg-white/60 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Best streak</p>
                <p className="mt-2 text-xl font-black text-slate-900">{bestStreak}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/60 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Route mastery</p>
                <p className="mt-2 text-xl font-black text-slate-900">{stats.badges.length - 1}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-5 text-white shadow-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
              Session status
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <span>current route</span>
                <span className="font-bold text-amber-300">{selectedRoute}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>arrested value</span>
                <span className="font-bold text-rose-300">৳{fare}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>traffic mood</span>
                <span className="font-bold text-emerald-300">{routePressure}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>shift</span>
                <span className="font-bold text-cyan-300">{selectedShift.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>style</span>
                <span className="font-bold text-rose-300">{selectedStyle.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>momentum</span>
                <span className="font-bold text-amber-300">{momentumLabel}</span>
              </div>
            </div>
          </div>
        </section>

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

        <section className="mt-6 rounded-[28px] border border-emerald-300 bg-gradient-to-br from-emerald-100 via-white to-amber-100 p-5 shadow-panel">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Route objective
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">
                {selectedRoute} challenge
              </h3>
            </div>

            <div className="rounded-full border border-emerald-300 bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              {routeObjectiveComplete ? 'Cleared' : 'In progress'}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/70 bg-white/60 p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>
                {triggerCount}/{routeObjectiveTarget} refusals
              </span>
              <span className="font-bold text-emerald-700">
                {routeObjectiveProgress}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-emerald-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-300"
                style={{ width: `${routeObjectiveProgress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-700">
              {routeObjectiveComplete
                ? `Mastered this route. Badge earned: ${selectedRoute} specialist.`
                : `Keep refusing riders on this route to complete the objective and unlock a special badge.`}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-cyan-300 bg-gradient-to-br from-cyan-100 via-white to-emerald-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Rider threat
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedRider.name}</h3>
            </div>
            <div className="rounded-full border border-cyan-300 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
              x{selectedRider.bonus.toFixed(2)}
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-700">{selectedRider.threat}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            {selectedRider.pressure}
          </p>
        </section>

        <section className="mt-6 rounded-[28px] border border-rose-300 bg-gradient-to-br from-rose-100 via-white to-orange-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
                Signature style
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedStyle.name}</h3>
            </div>
            <div className="rounded-full border border-rose-300 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-rose-700">
              x{selectedStyle.bonus.toFixed(2)}
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-700">{selectedStyle.flair}</p>
        </section>

        <section className="mt-6 rounded-[28px] border border-amber-300 bg-gradient-to-br from-amber-100 via-white to-orange-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                Crowd energy
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">{momentumLabel}</h3>
            </div>
            <div className="rounded-full border border-amber-300 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              {momentum}%
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-amber-100">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${momentumTone} transition-all duration-300`}
              style={{ width: `${momentum}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-slate-700">
            {momentum < 35
              ? 'The lane is cool and easy to control.'
              : momentum < 70
                ? 'The crowd is starting to feel the tension.'
                : 'The road is boiling—every bar is a risk and every refusal is a statement.'}
          </p>
        </section>

        <section className="mt-6 rounded-[28px] border border-amber-300 bg-white/60 p-4 backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
            <Sparkles className="h-4 w-4" />
            Street diary
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            {recentLog.map((entry) => (
              <li key={entry} className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                {entry}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-[28px] border border-violet-300 bg-gradient-to-br from-violet-100 via-white to-amber-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                Street rumor board
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">
                {selectedRoute} legend
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setStoryIndex((current) => (current + 1) % routeProfile.story.length)}
              className="rounded-full border border-violet-300 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700"
            >
              Next rumor
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Route lore
            </p>
            <p className="mt-3 text-xl font-black text-slate-900">{routeProfile.legend}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{activeStory}</p>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-violet-300 bg-gradient-to-br from-violet-100 via-white to-amber-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                Challenge deck
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">
                Route boss goals
              </h3>
            </div>
            <div className="rounded-full border border-violet-300 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              {challengeDeck.filter((goal) => goal.unlocked).length}/{challengeDeck.length}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {challengeDeck.map((goal) => (
              <div
                key={goal.label}
                className={`rounded-2xl border p-4 ${
                  goal.unlocked
                    ? 'border-emerald-300 bg-emerald-50/80'
                    : 'border-white/75 bg-white/70'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  {goal.label}
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">{goal.reward}</p>
                <p className="mt-2 text-sm text-slate-700">{goal.copy}</p>
                <div className="mt-3 inline-flex rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">
                  {goal.unlocked ? 'Complete' : 'Open'}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-violet-300 bg-gradient-to-br from-violet-50 via-white to-amber-50 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                Boss ladder
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">Route warlords</h3>
            </div>
            <div className="rounded-full border border-violet-300 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              {routeBosses.filter((boss) => boss.progress >= 75).length}/6 live
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {routeBosses.map((boss) => (
              <div
                key={boss.route}
                className={`rounded-[22px] border p-4 ${
                  boss.route === selectedRoute
                    ? 'border-violet-400 bg-violet-500/10'
                    : 'border-white/75 bg-white/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{boss.route}</p>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-violet-600">
                    {boss.title}
                  </span>
                </div>
                <p className="mt-3 text-lg font-black text-slate-900">{boss.boss}</p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${boss.progress}%` }}
                  />
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {boss.progress}% pressure
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-violet-300 bg-gradient-to-br from-violet-50 via-white to-amber-50 p-5 shadow-panel">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                Active route campaign
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">{currentChallenge.title}</h3>
            </div>
            <div className="rounded-full border border-violet-300 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              {currentChallenge.completed ? 'Cleared' : 'Live'}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/80 bg-white/80 p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>
                {currentChallenge.progress}/{currentChallenge.target} refusals
              </span>
              <span className="font-bold text-violet-700">{campaignProgress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-violet-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${campaignProgress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-700">
              {currentChallenge.completed
                ? `Campaign cleared: ${currentChallenge.reward} unlocked.`
                : `Complete the route challenge to unlock ${currentChallenge.reward}.`}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-violet-300 bg-gradient-to-br from-violet-100 via-white to-amber-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                City campaign
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">{cityRank.title}</h3>
            </div>
            <div className="rounded-full border border-violet-300 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              {cityControl}% control
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/80 bg-white/80 p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>City control meter</span>
              <span className="font-bold text-violet-700">{cityControl}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-violet-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${cityControl}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-700">{cityRank.detail}</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Current route</p>
              <p className="mt-2 text-lg font-black text-slate-900">{selectedRoute}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Refusal count</p>
              <p className="mt-2 text-lg font-black text-slate-900">{stats.refusals}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Next milestone</p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {nextMilestone ? nextMilestone.title : 'City icon'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-emerald-300 bg-gradient-to-br from-emerald-100 via-white to-cyan-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                End-of-run summary
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">Route verdict</h3>
            </div>
            <div className="rounded-full border border-emerald-300 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              {runSummary.topMode}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Final score</p>
              <p className="mt-2 text-xl font-black text-slate-900">{runSummary.finalScore}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Best route</p>
              <p className="mt-2 text-xl font-black text-slate-900">{runSummary.bestRoute}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Favorite style</p>
              <p className="mt-2 text-xl font-black text-slate-900">{runSummary.strongestStyle}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Traffic mode</p>
              <p className="mt-2 text-xl font-black text-slate-900">{runSummary.strongestShift}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/80 bg-white/80 p-4">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Route progression
            </div>
            <div className="space-y-3">
              {routeProgress.map((routeSummary) => (
                <div key={routeSummary.route} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{routeSummary.route}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      {routeSummary.focus}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 transition-all duration-300"
                      style={{ width: `${routeSummary.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {routeSummary.progress}% route pressure
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-violet-300 bg-gradient-to-br from-violet-100 via-white to-amber-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                Daily mission board
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">Street quests</h3>
            </div>
            <div className="rounded-full border border-violet-300 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              {dailyChallenges.filter((challenge) => challenge.complete).length}/{dailyChallenges.length} cleared
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {dailyChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`rounded-2xl border p-4 ${challenge.complete ? 'border-emerald-200 bg-emerald-50' : 'border-white/80 bg-white/80'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-slate-900">{challenge.title}</span>
                  <span className={`rounded-full bg-gradient-to-r ${challenge.tone} px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white`}>
                    {challenge.complete ? 'Clear' : 'Live'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{challenge.description}</p>
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    <span>{challenge.value}/{challenge.target}</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${challenge.tone}`}
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
                  Reward: {challenge.reward}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-violet-300 bg-gradient-to-br from-violet-100 via-white to-amber-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                Route boss encounter
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">{bossEncounter.name}</h3>
            </div>
            <button
              type="button"
              onClick={() => setBossEncounterOpen(true)}
              className="rounded-full border border-violet-300 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700"
            >
              Open duel
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/80 bg-white/80 p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>Boss pressure</span>
              <span className="font-bold text-violet-700">{bossEncounter.pressure}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-violet-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${bossEncounter.pressure}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-700">{bossEncounter.detail}</p>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-violet-300 bg-gradient-to-br from-violet-100 via-white to-amber-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                Route lore cards
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">City story deck</h3>
            </div>
            <div className="rounded-full border border-violet-300 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              {routeSummaries.length} routes
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {routeSummaries.map((summary) => (
              <div key={summary.route} className="rounded-[22px] border border-white/80 bg-white/80 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{summary.zone}</p>
                <p className="mt-2 text-lg font-black text-slate-900">{summary.route}</p>
                <p className="mt-2 text-sm text-slate-700">{summary.vibe}</p>
                <p className="mt-3 text-xs italic text-violet-700">“{summary.legend}”</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-violet-300 bg-gradient-to-br from-violet-100 via-white to-amber-100 p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                City season
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedSeason.name}</h3>
            </div>
            <div className="rounded-full border border-violet-300 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              x{selectedSeason.multiplier.toFixed(2)}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {citySeasons.map((season) => (
              <button
                key={season.name}
                type="button"
                onClick={() => setSelectedSeason(season)}
                className={`rounded-[22px] border p-3 text-left transition ${
                  selectedSeason.name === season.name
                    ? 'border-violet-500 bg-slate-900 text-white'
                    : 'border-white/70 bg-white/70 text-slate-700 hover:border-violet-300'
                }`}
              >
                <div className={`mb-2 h-2 rounded-full bg-gradient-to-r ${season.hue}`} />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">{season.name}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                    x{season.multiplier.toFixed(2)}
                  </span>
                </div>
                <p className={`mt-2 text-xs ${selectedSeason.name === season.name ? 'text-slate-200' : 'text-slate-600'}`}>
                  {season.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white/60 p-5 shadow-panel backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                Career board
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">City archive</h3>
            </div>
            <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
              {career.totalRuns} runs
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Best score</p>
              <p className="mt-2 text-xl font-black text-slate-900">{career.bestScore}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Route unlocks</p>
              <p className="mt-2 text-xl font-black text-slate-900">{career.unlockedRoutes.length}/{routeOptions.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Top season</p>
              <p className="mt-2 text-xl font-black text-slate-900">{career.seasonArchive[0]?.season ?? 'No record'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Current rank</p>
              <p className="mt-2 text-xl font-black text-slate-900">{cityRank.title}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Route unlocks
              </div>
              <div className="space-y-3">
                {routeOptions.map((route) => {
                  const unlocked = career.unlockedRoutes.includes(route);
                  return (
                    <div key={route} className={`rounded-2xl border p-3 ${unlocked ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-900">{route}</span>
                        <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${unlocked ? 'border-emerald-300 bg-emerald-100 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                          {unlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Leaderboard
              </div>
              <div className="space-y-3">
                {seasonLeaderboard.length === 0 ? (
                  <p className="text-sm text-slate-600">No completed runs yet for {selectedSeason.name}. Finish a circuit to set this season’s record.</p>
                ) : (
                  seasonLeaderboard.map((entry, index) => (
                    <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white/80 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">#{index + 1}</span>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">{entry.season}</span>
                      </div>
                      <p className="mt-2 text-sm font-black text-slate-900">{entry.route}</p>
                      <p className="mt-1 text-sm text-slate-700">{entry.score} points • {entry.badge}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Season archive
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {career.seasonArchive.length === 0 ? (
                <p className="text-sm text-slate-600">No season records yet.</p>
              ) : (
                career.seasonArchive.map((season) => (
                  <div key={season.season} className="rounded-2xl border border-slate-200 bg-white/80 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{season.season}</p>
                    <p className="mt-2 text-lg font-black text-slate-900">{season.bestScore}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-rose-300 bg-gradient-to-br from-rose-100 via-white to-amber-100 p-5 shadow-panel">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
                Final verdict
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">
                {reputationScore >= 2500 ? 'Legendary road dodger' : 'Street veteran'}
              </h3>
            </div>
            <div className="rounded-full border border-rose-300 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-rose-700">
              {reputationScore >= 2500 ? 'Elite' : 'Rising'}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Best streak</p>
              <p className="mt-2 text-xl font-black text-slate-900">{bestStreak}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Mission clears</p>
              <p className="mt-2 text-xl font-black text-slate-900">{stats.badges.length - 1}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Route status</p>
              <p className="mt-2 text-xl font-black text-slate-900">
                {routeObjectiveComplete ? 'Dominant' : 'Persistent'}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <ShareCard
            route={selectedRoute}
            fare={fare}
            text={insultText}
            season={selectedSeason.name}
            streak={bestStreak}
            badge={cityRank.title}
            score={runSummary.finalScore}
          />
        </div>

        {showPotholeMode && (
          <div className="mt-6">
            <PotholeMiniGame onChallengeClear={() => unlockBadge('Pothole champion')} />
          </div>
        )}
      </div>

      {bossEncounterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-xl rounded-[30px] border border-violet-300 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                  Boss duel
                </p>
                <h3 className="mt-2 text-3xl font-black text-slate-900">{bossEncounter.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setBossEncounterOpen(false)}
                className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>Boss pressure</span>
                <span className="font-bold text-violet-700">{bossEncounter.pressure}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-violet-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
                  style={{ width: `${bossEncounter.pressure}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-700">{bossEncounter.detail}</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => handleBossResolve('hold')}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
              >
                Hold line
              </button>
              <button
                type="button"
                onClick={() => handleBossResolve('counter')}
                className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-bold text-slate-900"
              >
                Counter
              </button>
              <button
                type="button"
                onClick={() => handleBossResolve('dodge')}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
              >
                Dodge
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showRunSummary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-2xl rounded-[30px] border border-violet-300 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                  Run summary
                </p>
                <h3 className="mt-2 text-3xl font-black text-slate-900">{summaryHeadline}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRunSummary(false)}
                className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Score</p>
                <p className="mt-2 text-xl font-black text-slate-900">{runSummary.finalScore}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Best route</p>
                <p className="mt-2 text-xl font-black text-slate-900">{runSummary.bestRoute}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Style</p>
                <p className="mt-2 text-xl font-black text-slate-900">{runSummary.strongestStyle}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Season</p>
                <p className="mt-2 text-xl font-black text-slate-900">{selectedSeason.name}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>City control</span>
                <span className="font-bold text-violet-700">{cityControl}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-violet-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
                  style={{ width: `${cityControl}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-700">{cityRank.detail}</p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  recordRunSummary({
                    route: selectedRoute,
                    score: runSummary.finalScore,
                    season: selectedSeason.name,
                    badge: cityRank.title,
                  });
                  setShowRunSummary(false);
                  resetStats();
                }}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
              >
                Start new circuit
              </button>
              <button
                type="button"
                onClick={() => setShowRunSummary(false)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
              >
                Keep driving
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
