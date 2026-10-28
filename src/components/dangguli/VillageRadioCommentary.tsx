"use client";

import React from "react";
import { useDangGuliStore } from "@/store/dangGuliStore";
import { Radio } from "lucide-react";

export const VillageRadioCommentary: React.FC = () => {
  const commentaryLog = useDangGuliStore((s) => s.commentaryLog);

  return (
    <div className="flex flex-col rounded-2xl bg-stone-900/80 p-4 border border-stone-800 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-stone-300">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Radio className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            গ্রামের লাউডস্পিকার ধারাভাষ্য (Live Commentary)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-bold text-red-400 uppercase">
            লাইভ
          </span>
        </div>
      </div>

      {/* Commentary Stream */}
      <div className="mt-3 max-h-32 overflow-y-auto space-y-2 pr-1">
        {commentaryLog.map((log, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 text-xs leading-relaxed ${
              index === 0
                ? "font-bold text-amber-200"
                : "text-stone-400 opacity-80"
            }`}
          >
            <span className="text-amber-500 select-none">»</span>
            <span>{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

