"use client";

import React, { useState } from "react";
import { DangGuliCanvas } from "@/components/dangguli/DangGuliCanvas";
import { DangGuliGearModal } from "@/components/dangguli/DangGuliGearModal";
import { DangGuliHUD } from "@/components/dangguli/DangGuliHUD";
import { DangGuliRulesModal } from "@/components/dangguli/DangGuliRulesModal";
import { DangGuliScoreCard } from "@/components/dangguli/DangGuliScoreCard";
import { VillageRadioCommentary } from "@/components/dangguli/VillageRadioCommentary";
import { VILLAGE_FIELDERS } from "@/data/dangGuliData";
import { useDangGuliStore } from "@/store/dangGuliStore";
import { Sparkles, ShieldAlert, Award, Play } from "lucide-react";

export default function DangGuliGamePage() {
  const [gearModalOpen, setGearModalOpen] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  const gameMode = useDangGuliStore((s) => s.gameMode);
  const setGameMode = useDangGuliStore((s) => s.setGameMode);
  const bestShotDistance = useDangGuliStore((s) => s.bestShotDistance);
  const tournamentsWon = useDangGuliStore((s) => s.tournamentsWon);

  return (
    <main className="min-h-screen px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-5">
        {/* HUD & Scorebar */}
        <DangGuliHUD
          onOpenGear={() => setGearModalOpen(true)}
          onOpenRules={() => setRulesModalOpen(true)}
        />

        {/* Game Mode Switcher Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-stone-900/60 p-2.5 border border-stone-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGameMode("tournament")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                gameMode === "tournament"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>৫-ইনিংস গ্রামীণ টুর্নামেন্ট</span>
            </button>
            <button
              onClick={() => setGameMode("practice")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                gameMode === "practice"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Play className="h-4 w-4" />
              <span>আনলিমিটেড ফ্রি হিট (অনুশীলন)</span>
            </button>
          </div>

          {/* Quick Player Stat Badges */}
          <div className="flex items-center gap-3 text-xs text-stone-300 pr-2">
            <div className="flex items-center gap-1.5">
              <span>🏆 টুর্নামেন্ট জয়:</span>
              <span className="font-black text-amber-300">
                {tournamentsWon}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>📏 সেরা দূরত্ব:</span>
              <span className="font-black text-amber-300">
                {bestShotDistance} কাঠি
              </span>
            </div>
          </div>
        </div>

        {/* Main Canvas Game Arena */}
        <DangGuliCanvas />

        {/* Bottom Section: Live Commentary & Fielders Guide */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Live Commentary Box (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <VillageRadioCommentary />
          </div>

          {/* Village Fielders Notice Board */}
          <div className="flex flex-col justify-between rounded-2xl bg-stone-900/80 p-4 border border-stone-800 shadow-xl backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-stone-800 text-stone-300">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
                  বিপক্ষ ফিল্ডার সতর্কবার্তা
                </h3>
              </div>
              <p className="mt-2 text-[11px] text-stone-400">
                মাঠের ৩ জন ছেলে যেকোনো নিচু শট ধরে তোমাকে ক্যাচ আউট করতে পারে:
              </p>

              <div className="mt-3 space-y-2">
                {VILLAGE_FIELDERS.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 rounded-xl bg-stone-950/60 p-2.5 border border-stone-800/80 text-xs"
                  >
                    <span className="text-xl">{f.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-200">
                          {f.nameBn}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {f.positionX} কাঠি দূরে
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-400 italic truncate mt-0.5">
                        &ldquo;{f.taunt}&rdquo;
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nostalgic Tip */}
            <div className="mt-3 rounded-xl bg-amber-950/40 p-2.5 border border-amber-700/30 text-[11px] text-amber-200/90 flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>শটের কৌশল:</strong> গুলি টুপ করার পর ঠিক বুক সমান উচ্চতায় এলে ডাং দিয়ে মারুন। সুইট-স্পটে লাগলে বাতাসে সোজা উড়ে গিয়ে বটগাছ পার হবে!
              </span>
            </div>
          </div>
        </div>

        {/* 90s Village Nostalgia Footnote */}
        <footer className="rounded-2xl bg-stone-950/40 p-4 border border-stone-800/50 text-center text-xs text-stone-400">
          <p className="font-medium">
            নব্বইয়ের দশকের বাংলাদেশের সোনালী শৈশব স্মরণে নিবেদিত। বৈকালিক খেলাধুলা, বটতলার আড্ডা ও মেঠো পথের চিরন্তন স্মৃতি।
          </p>
          <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-amber-500/80">
            <span>খাঁটি ক্লায়েন্ট-সাইড ফিজিক্স</span>
            <span>•</span>
            <span>জিরো ব্যাকএন্ড</span>
            <span>•</span>
            <span>ওয়েব অডিও সাউন্ড</span>
          </div>
        </footer>
      </div>

      {/* Overlays / Modals */}
      <DangGuliScoreCard />
      <DangGuliGearModal
        isOpen={gearModalOpen}
        onClose={() => setGearModalOpen(false)}
      />
      <DangGuliRulesModal
        isOpen={rulesModalOpen}
        onClose={() => setRulesModalOpen(false)}
      />
    </main>
  );
}
