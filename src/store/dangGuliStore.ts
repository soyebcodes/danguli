import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DANG_STICKS, GULI_TYPES } from "@/data/dangGuliData";

export type ShotQuality = "perfect" | "good" | "weak" | "miss";

export type GamePhase =
  | "ready" // guli in ghop, ready to tip
  | "tipping" // tipping animation
  | "airborne" // guli spinning upwards, waiting for whack
  | "hit" // hit registered
  | "flying" // guli traveling through sky
  | "landing" // bouncing & coming to stop
  | "measuring" // counting kaathis
  | "caught" // fielder caught it
  | "miss" // whiffed the hit
  | "turn_ended" // showing turn score
  | "tournament_over"; // completed all 5 turns

export interface ShotResult {
  distance: number; // in kaathi
  quality: ShotQuality;
  maxSpeed: number;
  maxHeight: number;
  commentary: string;
  bonusTitle?: string;
  isCaught?: boolean;
}

export interface WindCondition {
  speed: number; // -15 (headwind) to +25 (tailwind)
  direction: "tailwind" | "headwind" | "calm";
  labelBn: string;
}

interface DangGuliState {
  // Game settings & session
  gameMode: "tournament" | "practice";
  currentInning: number; // 1 to 5 for tournament
  maxInnings: number;
  inningScores: number[];
  phase: GamePhase;
  lastShot: ShotResult | null;
  wind: WindCondition;

  // Selected gear
  selectedStickId: string;
  selectedGuliId: string;

  // Persistent user career & stats
  totalCareerKaathi: number;
  bestShotDistance: number;
  totalShotsFired: number;
  perfectHitsCount: number;
  tournamentsWon: number;
  unlockedStickIds: string[];
  unlockedGuliIds: string[];

  // Audio settings
  soundEnabled: boolean;
  volume: number;

  // Commentary log
  commentaryLog: string[];

  // Actions
  setGameMode: (mode: "tournament" | "practice") => void;
  setPhase: (phase: GamePhase) => void;
  startNewInning: () => void;
  resetTournament: () => void;
  recordShot: (result: ShotResult) => void;
  selectStick: (id: string) => void;
  unlockStick: (id: string) => boolean;
  selectGuli: (id: string) => void;
  unlockGuli: (id: string) => boolean;
  addCommentary: (text: string) => void;
  randomizeWind: () => void;
  toggleSound: () => void;
  setVolume: (vol: number) => void;
}

const getRandomWind = (): WindCondition => {
  const roll = Math.random();
  if (roll < 0.3) {
    return {
      speed: 0,
      direction: "calm",
      labelBn: "শান্ত বিকেল (কোনো হাওয়া নেই)",
    };
  } else if (roll < 0.65) {
    const spd = Math.round(5 + Math.random() * 15);
    return {
      speed: spd,
      direction: "tailwind",
      labelBn: `অনুকূল হাওয়া (+${spd} গতি)`,
    };
  } else {
    const spd = Math.round(5 + Math.random() * 12);
    return {
      speed: -spd,
      direction: "headwind",
      labelBn: `প্রতিকূল ঝাপটা (-${spd} গতি)`,
    };
  }
};

export const useDangGuliStore = create<DangGuliState>()(
  persist(
    (set, get) => ({
      gameMode: "tournament",
      currentInning: 1,
      maxInnings: 5,
      inningScores: [],
      phase: "ready",
      lastShot: null,
      wind: getRandomWind(),

      selectedStickId: "bamboo",
      selectedGuliId: "shimul",

      totalCareerKaathi: 0,
      bestShotDistance: 0,
      totalShotsFired: 0,
      perfectHitsCount: 0,
      tournamentsWon: 0,
      unlockedStickIds: ["bamboo"],
      unlockedGuliIds: ["shimul"],

      soundEnabled: true,
      volume: 80,
      commentaryLog: [
        "স্বাগতম ১৯৯০ সালের গ্রামীণ বৈকালিক ডাংগুলি টুর্নামেন্টে!",
        "ঘোপে চোখ রাখো, সঠিক সময়ে টুপ মারো এবং তারপর সজোরে ডাং চালাও!",
      ],

      setGameMode: (mode) =>
        set({
          gameMode: mode,
          currentInning: 1,
          inningScores: [],
          phase: "ready",
          lastShot: null,
          wind: getRandomWind(),
        }),

      setPhase: (phase) => set({ phase }),

      startNewInning: () => {
        const state = get();
        if (state.gameMode === "tournament" && state.currentInning >= state.maxInnings) {
          set({ phase: "tournament_over" });
          return;
        }

        set((s) => ({
          currentInning: s.gameMode === "tournament" ? s.currentInning + 1 : 1,
          phase: "ready",
          lastShot: null,
          wind: getRandomWind(),
        }));
      },

      resetTournament: () => {
        set({
          currentInning: 1,
          inningScores: [],
          phase: "ready",
          lastShot: null,
          wind: getRandomWind(),
        });
      },

      recordShot: (result) => {
        const state = get();
        if (state.phase === "turn_ended" || state.phase === "tournament_over") {
          return;
        }
        const earnedKaathi = Math.max(0, result.distance);
        const newTotalKaathi = state.totalCareerKaathi + earnedKaathi;
        const newBest = Math.max(state.bestShotDistance, earnedKaathi);
        const newPerfect =
          result.quality === "perfect"
            ? state.perfectHitsCount + 1
            : state.perfectHitsCount;

        const newScores =
          state.gameMode === "tournament"
            ? [...state.inningScores, earnedKaathi]
            : [earnedKaathi];

        const isLastInning =
          state.gameMode === "tournament" &&
          newScores.length >= state.maxInnings;

        set((s) => ({
          lastShot: result,
          inningScores: newScores,
          totalCareerKaathi: newTotalKaathi,
          bestShotDistance: newBest,
          totalShotsFired: s.totalShotsFired + 1,
          perfectHitsCount: newPerfect,
          tournamentsWon:
            isLastInning && newScores.reduce((a, b) => a + b, 0) >= 600
              ? s.tournamentsWon + 1
              : s.tournamentsWon,
          phase: isLastInning ? "tournament_over" : "turn_ended",
          commentaryLog: [
            result.commentary,
            ...s.commentaryLog.slice(0, 15),
          ],
        }));
      },

      selectStick: (id) => {
        const { unlockedStickIds } = get();
        if (unlockedStickIds.includes(id)) {
          set({ selectedStickId: id });
        }
      },

      unlockStick: (id) => {
        const state = get();
        const stick = DANG_STICKS.find((s) => s.id === id);
        if (!stick) return false;
        if (state.totalCareerKaathi >= stick.unlockCost) {
          set((s) => ({
            totalCareerKaathi: s.totalCareerKaathi - stick.unlockCost,
            unlockedStickIds: [...s.unlockedStickIds, id],
            selectedStickId: id,
          }));
          return true;
        }
        return false;
      },

      selectGuli: (id) => {
        const { unlockedGuliIds } = get();
        if (unlockedGuliIds.includes(id)) {
          set({ selectedGuliId: id });
        }
      },

      unlockGuli: (id) => {
        const state = get();
        const guli = GULI_TYPES.find((g) => g.id === id);
        if (!guli) return false;
        if (state.totalCareerKaathi >= guli.unlockCost) {
          set((s) => ({
            totalCareerKaathi: s.totalCareerKaathi - guli.unlockCost,
            unlockedGuliIds: [...s.unlockedGuliIds, id],
            selectedGuliId: id,
          }));
          return true;
        }
        return false;
      },

      addCommentary: (text) =>
        set((s) => ({
          commentaryLog: [text, ...s.commentaryLog.slice(0, 15)],
        })),

      randomizeWind: () => set({ wind: getRandomWind() }),

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      setVolume: (vol) => set({ volume: Math.max(0, Math.min(100, vol)) }),
    }),
    {
      name: "dang-guli-1990-store",
      partialize: (state) => ({
        totalCareerKaathi: state.totalCareerKaathi,
        bestShotDistance: state.bestShotDistance,
        totalShotsFired: state.totalShotsFired,
        perfectHitsCount: state.perfectHitsCount,
        tournamentsWon: state.tournamentsWon,
        unlockedStickIds: state.unlockedStickIds,
        unlockedGuliIds: state.unlockedGuliIds,
        soundEnabled: state.soundEnabled,
        volume: state.volume,
        selectedStickId: state.selectedStickId,
        selectedGuliId: state.selectedGuliId,
      }),
    }
  )
);

