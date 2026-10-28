"use client";

import React, { useState } from "react";
import { DANG_STICKS, GULI_TYPES } from "@/data/dangGuliData";
import { useDangGuliStore } from "@/store/dangGuliStore";
import { X, Check, Lock, Zap } from "lucide-react";

interface DangGuliGearModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DangGuliGearModal: React.FC<DangGuliGearModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [tab, setTab] = useState<"sticks" | "gulis">("sticks");

  const totalCareerKaathi = useDangGuliStore((s) => s.totalCareerKaathi);
  const selectedStickId = useDangGuliStore((s) => s.selectedStickId);
  const selectedGuliId = useDangGuliStore((s) => s.selectedGuliId);
  const unlockedStickIds = useDangGuliStore((s) => s.unlockedStickIds);
  const unlockedGuliIds = useDangGuliStore((s) => s.unlockedGuliIds);
  const selectStick = useDangGuliStore((s) => s.selectStick);
  const unlockStick = useDangGuliStore((s) => s.unlockStick);
  const selectGuli = useDangGuliStore((s) => s.selectGuli);
  const unlockGuli = useDangGuliStore((s) => s.unlockGuli);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-amber-600/50 bg-stone-900 text-stone-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 bg-amber-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛠️</span>
            <div>
              <h2 className="text-lg font-black text-amber-200">
                গ্রামের কাঠের কর্মশালা (Gear & Equipment)
              </h2>
              <p className="text-xs text-amber-400">
                কাঠি দিয়ে নতুন লাঠি ও গুলি আনলক করে নিজের পাওয়ার বাড়াও!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Currency Strip & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 bg-stone-950/60 px-6 py-3">
          <div className="flex rounded-xl bg-stone-900 p-1 border border-stone-800">
            <button
              onClick={() => setTab("sticks")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                tab === "sticks"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              🪵 ডাং লাঠি ({DANG_STICKS.length})
            </button>
            <button
              onClick={() => setTab("gulis")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                tab === "gulis"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              🎯 গুলি কাঠি ({GULI_TYPES.length})
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-amber-500/20 px-3 py-1.5 border border-amber-500/40 text-amber-300">
            <span className="text-xs font-bold">ব্যালেন্স:</span>
            <span className="text-base font-black text-white">
              {totalCareerKaathi}
            </span>
            <span className="text-xs font-bold text-amber-400">কাঠি</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
          {tab === "sticks" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {DANG_STICKS.map((stk) => {
                const isUnlocked = unlockedStickIds.includes(stk.id);
                const isSelected = selectedStickId === stk.id;
                const canAfford = totalCareerKaathi >= stk.unlockCost;

                return (
                  <div
                    key={stk.id}
                    className={`relative flex flex-col justify-between rounded-2xl p-4 border transition ${
                      isSelected
                        ? "border-amber-400 bg-amber-950/40 shadow-lg ring-1 ring-amber-400"
                        : "border-stone-800 bg-stone-900/60 hover:border-stone-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-black text-white">
                            {stk.nameBn}
                          </div>
                          <div className="text-[11px] font-semibold text-amber-400">
                            {stk.woodType}
                          </div>
                        </div>
                        <span className="rounded-md bg-stone-800 px-2 py-0.5 text-[10px] font-bold text-stone-300">
                          {stk.badge}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                        {stk.description}
                      </p>

                      {/* Stat Bars */}
                      <div className="mt-3 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-stone-400">
                          <span>আঘাত ক্ষমতা (Power):</span>
                          <span className="font-bold text-amber-300">
                            {stk.power}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-stone-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                            style={{ width: `${(stk.power / 130) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                      {isUnlocked ? (
                        isSelected ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            <Check className="h-4 w-4" /> বর্তমানে নির্বাচিত
                          </span>
                        ) : (
                          <button
                            onClick={() => selectStick(stk.id)}
                            className="w-full rounded-xl bg-stone-800 py-2 text-xs font-bold text-stone-200 hover:bg-stone-700 transition"
                          >
                            ব্যবহার করো
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => unlockStick(stk.id)}
                          disabled={!canAfford}
                          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
                            canAfford
                              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-md"
                              : "bg-stone-800 text-stone-500 cursor-not-allowed"
                          }`}
                        >
                          <Lock className="h-3.5 w-3.5" />
                          <span>
                            আনলক ({stk.unlockCost} কাঠি)
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {GULI_TYPES.map((g) => {
                const isUnlocked = unlockedGuliIds.includes(g.id);
                const isSelected = selectedGuliId === g.id;
                const canAfford = totalCareerKaathi >= g.unlockCost;

                return (
                  <div
                    key={g.id}
                    className={`relative flex flex-col justify-between rounded-2xl p-4 border transition ${
                      isSelected
                        ? "border-amber-400 bg-amber-950/40 shadow-lg ring-1 ring-amber-400"
                        : "border-stone-800 bg-stone-900/60 hover:border-stone-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-black text-white">
                            {g.nameBn}
                          </div>
                          <div className="text-[11px] font-semibold text-amber-400">
                            {g.badge}
                          </div>
                        </div>
                        {g.scoreMultiplier > 1 && (
                          <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-500/40">
                            {g.scoreMultiplier}x পয়েন্ট!
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                        {g.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-[11px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-cyan-400" />
                          বাতাসে ওড়ার শক্তি: {Math.round(g.aerodynamics * 100)}%
                        </span>
                        <span>•</span>
                        <span>
                          বাউন্স: {Math.round(g.bounce * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                      {isUnlocked ? (
                        isSelected ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            <Check className="h-4 w-4" /> বর্তমানে নির্বাচিত
                          </span>
                        ) : (
                          <button
                            onClick={() => selectGuli(g.id)}
                            className="w-full rounded-xl bg-stone-800 py-2 text-xs font-bold text-stone-200 hover:bg-stone-700 transition"
                          >
                            ব্যবহার করো
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => unlockGuli(g.id)}
                          disabled={!canAfford}
                          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
                            canAfford
                              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-md"
                              : "bg-stone-800 text-stone-500 cursor-not-allowed"
                          }`}
                        >
                          <Lock className="h-3.5 w-3.5" />
                          <span>
                            আনলক ({g.unlockCost} কাঠি)
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

