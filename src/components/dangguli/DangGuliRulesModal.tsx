"use client";

import React from "react";
import { NOSTALGIC_RULES_LORE } from "@/data/dangGuliData";
import { X, Sparkles, BookOpen } from "lucide-react";

interface DangGuliRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DangGuliRulesModal: React.FC<DangGuliRulesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-amber-600/50 bg-stone-900 text-stone-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 bg-amber-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-lg font-black text-amber-200">
                {NOSTALGIC_RULES_LORE.titleBn}
              </h2>
              <p className="text-xs text-amber-400">
                {NOSTALGIC_RULES_LORE.titleEn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close rules"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Intro Story */}
          <div className="rounded-2xl bg-amber-950/40 p-4 border border-amber-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase">
              <Sparkles className="h-4 w-4" />
              <span>নস্টালজিক স্মৃতিকথা</span>
            </div>
            <p className="mt-2 text-sm text-amber-100/90 leading-relaxed">
              {NOSTALGIC_RULES_LORE.intro}
            </p>
          </div>

          {/* 5 Steps of Dang Guli */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-wider mb-3">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>খেলার ৫টি ঐতিহ্যবাহী ধাপ</span>
            </h3>
            <div className="space-y-3">
              {NOSTALGIC_RULES_LORE.steps.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-3.5 rounded-xl bg-stone-950/50 p-3.5 border border-stone-800"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-600/30 font-black text-amber-300 text-xs border border-amber-500/40">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-200">
                      {step.title}
                    </h4>
                    <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slang Glossary */}
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3">
              গ্রামীণ পরিভাষা ও অর্থ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {NOSTALGIC_RULES_LORE.slangs.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-stone-800/40 p-3 border border-stone-800"
                >
                  <div className="text-xs font-black text-amber-400">
                    {s.word}
                  </div>
                  <div className="text-[11px] text-stone-300 mt-0.5">
                    {s.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-800 bg-stone-950/80 px-6 py-3 text-center">
          <button
            onClick={onClose}
            className="rounded-xl bg-amber-600 px-6 py-2 text-xs font-black text-white hover:bg-amber-500 transition shadow-md"
          >
            বুঝেছি, চলো খেলি!
          </button>
        </div>
      </div>
    </div>
  );
};

