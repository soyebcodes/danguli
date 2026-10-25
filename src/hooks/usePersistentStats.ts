'use client';

import { useCallback, useEffect, useState } from 'react';

export type PlayerStats = {
  refusals: number;
  totalFare: number;
  badges: string[];
};

const STORAGE_KEY = 'rickshaw-mama-stats';
const defaultStats: PlayerStats = {
  refusals: 0,
  totalFare: 0,
  badges: ['First refusal'],
};

export function usePersistentStats() {
  const [stats, setStats] = useState<PlayerStats>(defaultStats);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<PlayerStats>;
      setStats({
        refusals: Number(parsed.refusals ?? 0),
        totalFare: Number(parsed.totalFare ?? 0),
        badges: Array.isArray(parsed.badges) ? parsed.badges : defaultStats.badges,
      });
    } catch {
      setStats(defaultStats);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const addRefusal = useCallback((fare: number) => {
    setStats((current) => {
      const nextRefusals = current.refusals + 1;
      const nextTotalFare = current.totalFare + fare;
      const badges = [...current.badges];

      if (nextRefusals >= 3 && !badges.includes('Traffic veteran')) {
        badges.push('Traffic veteran');
      }
      if (nextTotalFare >= 1500 && !badges.includes('Master haggler')) {
        badges.push('Master haggler');
      }

      return {
        refusals: nextRefusals,
        totalFare: nextTotalFare,
        badges,
      };
    });
  }, []);

  return { stats, addRefusal };
}
