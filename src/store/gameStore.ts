import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type RouteOption, routeOptions } from '@/data/routes';

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
  stats: PlayerStats;
  setSelectedRoute: (route: RouteOption) => void;
  setFare: (fare: number) => void;
  increaseFare: (by?: number) => void;
  setInsultText: (text: string) => void;
  setIsEscaping: (value: boolean) => void;
  setSoundEnabled: (value: boolean) => void;
  setVolume: (value: number) => void;
  registerRefusal: (fare: number, excuse: string) => void;
  unlockBadge: (badge: string) => void;
  logEvent: (event: string) => void;
  resetStats: () => void;
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
      stats: defaultStats,
      setSelectedRoute: (route) => set({ selectedRoute: route }),
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

          return {
            triggerCount: nextTriggerCount,
            bestStreak: Math.max(state.bestStreak, nextTriggerCount),
            insultText: excuse,
            isEscaping: true,
            recentLog: [
              `Refused ${fare}৳ on ${state.selectedRoute} — the street won this round.`,
              ...state.recentLog,
            ].slice(0, 4),
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
        stats: state.stats,
      }),
    },
  ),
);
