import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type RouteOption, routeOptions, routeProfiles } from '@/data/routes';

const createRouteChallenge = (route: RouteOption) => ({
  id: `route-${route}`,
  route,
  title: `${route} campaign`,
  target: Math.max(3, Math.round(routeProfiles[route].demand / 25)),
  progress: 0,
  reward: `${route} specialist`,
  completed: false,
});

type PlayerStats = {
  refusals: number;
  totalFare: number;
  badges: string[];
};

const defaultStats: PlayerStats = {
  refusals: 0,
  totalFare: 0,
  badges: ['First refusal'],
};

type RouteChallenge = {
  id: string;
  route: RouteOption;
  title: string;
  target: number;
  progress: number;
  reward: string;
  completed: boolean;
};

type CareerEntry = {
  id: string;
  route: RouteOption;
  score: number;
  season: string;
  date: string;
  badge: string;
};

type SeasonArchiveEntry = {
  season: string;
  bestScore: number;
};

type CareerState = {
  totalRuns: number;
  bestScore: number;
  unlockedRoutes: RouteOption[];
  leaderboard: CareerEntry[];
  seasonArchive: SeasonArchiveEntry[];
};

type GameStore = {
  selectedRoute: RouteOption;
  fare: number;
  triggerCount: number;
  bestStreak: number;
  insultText: string;
  isEscaping: boolean;
  soundEnabled: boolean;
  volume: number;
  recentLog: string[];
  currentChallenge: RouteChallenge;
  stats: PlayerStats;
  career: CareerState;
  setSelectedRoute: (route: RouteOption) => void;
  setFare: (fare: number) => void;
  increaseFare: (by?: number) => void;
  setInsultText: (text: string) => void;
  setIsEscaping: (value: boolean) => void;
  setSoundEnabled: (value: boolean) => void;
  setVolume: (value: number) => void;
  registerRefusal: (fare: number, excuse: string) => void;
  unlockBadge: (badge: string) => void;
  unlockRoute: (route: RouteOption) => void;
  recordRunSummary: (summary: {
    route: RouteOption;
    score: number;
    season: string;
    badge: string;
  }) => void;
  logEvent: (event: string) => void;
  resetStats: () => void;
};

const defaultCareer: CareerState = {
  totalRuns: 0,
  bestScore: 0,
  unlockedRoutes: [routeOptions[0]],
  leaderboard: [],
  seasonArchive: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      selectedRoute: routeOptions[0],
      fare: 220,
      triggerCount: 0,
      bestStreak: 0,
      insultText: 'পাহাড়তলী যাইতাম না, ভাই! গ্যারেজের ভেতর ঠেকাইয়া দিছি।',
      isEscaping: false,
      soundEnabled: true,
      volume: 70,
      recentLog: ['Session started — the lane is open for chaos.'],
      currentChallenge: createRouteChallenge(routeOptions[0]),
      stats: defaultStats,
      career: defaultCareer,
      setSelectedRoute: (route) =>
        set((state) => ({
          selectedRoute: route,
          currentChallenge:
            state.selectedRoute === route
              ? state.currentChallenge
              : createRouteChallenge(route),
        })),
      setFare: (fare) => set({ fare: Math.max(20, Math.min(500, fare)) }),
      increaseFare: (by = 25) =>
        set((state) => ({
          fare: Math.max(20, Math.min(500, state.fare + by)),
        })),
      setInsultText: (text) => set({ insultText: text }),
      setIsEscaping: (value) => set({ isEscaping: value }),
      setSoundEnabled: (value) => set({ soundEnabled: value }),
      setVolume: (value) => set({ volume: Math.max(0, Math.min(100, value)) }),
      registerRefusal: (fare: number, excuse: string) =>
        set((state) => {
          const nextRefusals = state.stats.refusals + 1;
          const nextTotalFare = state.stats.totalFare + fare;
          const nextBadges = [...state.stats.badges];

          if (nextRefusals >= 3 && !nextBadges.includes('Traffic veteran')) {
            nextBadges.push('Traffic veteran');
          }
          if (nextTotalFare >= 1500 && !nextBadges.includes('Master haggler')) {
            nextBadges.push('Master haggler');
          }

          const nextTriggerCount = state.triggerCount + 1;
          const nextChallengeProgress =
            state.currentChallenge.route === state.selectedRoute
              ? Math.min(
                  state.currentChallenge.target,
                  state.currentChallenge.progress + 1,
                )
              : state.currentChallenge.progress;
          const nextChallengeCompleted =
            nextChallengeProgress >= state.currentChallenge.target;

          if (nextChallengeCompleted && !nextBadges.includes(state.currentChallenge.reward)) {
            nextBadges.push(state.currentChallenge.reward);
          }

          return {
            triggerCount: nextTriggerCount,
            bestStreak: Math.max(state.bestStreak, nextTriggerCount),
            insultText: excuse,
            isEscaping: true,
            recentLog: [
              `Refused ${fare}৳ on ${state.selectedRoute} — the street won this round.`,
              ...state.recentLog,
            ].slice(0, 4),
            currentChallenge: {
              ...state.currentChallenge,
              progress: nextChallengeProgress,
              completed: nextChallengeCompleted,
            },
            stats: {
              refusals: nextRefusals,
              totalFare: nextTotalFare,
              badges: nextBadges,
            },
          };
        }),
      unlockBadge: (badge: string) =>
        set((state) => {
          if (state.stats.badges.includes(badge)) {
            return state;
          }

          return {
            recentLog: [`Unlocked: ${badge}.`, ...state.recentLog].slice(0, 4),
            stats: {
              ...state.stats,
              badges: [...state.stats.badges, badge],
            },
          };
        }),
      unlockRoute: (route: RouteOption) =>
        set((state) => {
          if (state.career.unlockedRoutes.includes(route)) {
            return state;
          }

          return {
            career: {
              ...state.career,
              unlockedRoutes: [...state.career.unlockedRoutes, route],
            },
          };
        }),
      recordRunSummary: ({ route, score, season, badge }) =>
        set((state) => {
          const nextUnlockedRoutes = state.career.unlockedRoutes.includes(route)
            ? state.career.unlockedRoutes
            : [...state.career.unlockedRoutes, route];

          const nextLeaderboard = [...state.career.leaderboard, {
            id: `${route}-${Date.now()}`,
            route,
            score,
            season,
            date: new Date().toISOString(),
            badge,
          }].sort((a, b) => b.score - a.score).slice(0, 6);

          const nextSeasonArchive = [...state.career.seasonArchive];
          const archiveEntry = nextSeasonArchive.find((entry) => entry.season === season);

          if (archiveEntry) {
            archiveEntry.bestScore = Math.max(archiveEntry.bestScore, score);
          } else {
            nextSeasonArchive.push({ season, bestScore: score });
          }

          return {
            career: {
              totalRuns: state.career.totalRuns + 1,
              bestScore: Math.max(state.career.bestScore, score),
              unlockedRoutes: nextUnlockedRoutes,
              leaderboard: nextLeaderboard,
              seasonArchive: nextSeasonArchive.sort((a, b) => b.bestScore - a.bestScore),
            },
          };
        }),
      logEvent: (event: string) =>
        set((state) => ({
          recentLog: [event, ...state.recentLog].slice(0, 4),
        })),
      resetStats: () =>
        set({
          triggerCount: 0,
          bestStreak: 0,
          insultText: 'পাহাড়তলী যাইতাম না, ভাই! গ্যারেজের ভেতর ঠেকাইয়া দিছি।',
          isEscaping: false,
          soundEnabled: true,
          volume: 70,
          recentLog: ['Session reset — the lane is ready for another negotiation.'],
          currentChallenge: createRouteChallenge(routeOptions[0]),
          stats: {
            refusals: 0,
            totalFare: 0,
            badges: ['First refusal'],
          },
        }),
    }),
    {
      name: 'rickshaw-mama-store',
      partialize: (state) => ({
        selectedRoute: state.selectedRoute,
        fare: state.fare,
        triggerCount: state.triggerCount,
        bestStreak: state.bestStreak,
        insultText: state.insultText,
        soundEnabled: state.soundEnabled,
        volume: state.volume,
        recentLog: state.recentLog,
        currentChallenge: state.currentChallenge,
        stats: state.stats,
        career: state.career,
      }),
    },
  ),
);
