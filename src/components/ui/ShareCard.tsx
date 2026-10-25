"use client";

import { Download } from "lucide-react";

type ShareCardProps = {
  route: string;
  fare: number;
  text: string;
  season: string;
  streak: number;
  badge: string;
  score: number;
};

export function ShareCard({
  route,
  fare,
  text,
  season,
  streak,
  badge,
  score,
}: ShareCardProps) {
  const createDownload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = 1200;
    canvas.height = 1200;

    context.fillStyle = "#fff7ed";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#f43f5e";
    context.fillRect(60, 60, canvas.width - 120, canvas.height - 120);

    context.fillStyle = "#fef3c7";
    context.fillRect(90, 90, canvas.width - 180, canvas.height - 180);

    context.fillStyle = "#111827";
    context.font = "700 52px Arial";
    context.fillText("Amader Rickshaw Mama", 140, 220);

    context.font = "600 32px Arial";
    context.fillText(`Route: ${route}`, 140, 320);
    context.fillText(`Offer: ৳${fare}`, 140, 380);
    context.fillText(`Season: ${season}`, 140, 440);
    context.fillText(`Streak: ${streak}`, 140, 500);
    context.fillText(`Badge: ${badge}`, 140, 560);

    context.font = "600 44px Arial";
    const wrapped = text.length > 52 ? `${text.slice(0, 52)}...` : text;
    context.fillText(wrapped, 140, 660, 900);

    context.fillStyle = "#facc15";
    context.fillRect(140, 760, 340, 90);
    context.fillStyle = "#111827";
    context.font = "700 36px Arial";
    context.fillText(`Score: ${score}`, 180, 820);
    context.font = "700 34px Arial";
    context.fillText("REFUSED!", 180, 900);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "rickshaw-refusal-card.png";
    link.click();
  };

  return (
    <button
      type="button"
      onClick={createDownload}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-300 px-4 py-3 font-bold text-slate-900 transition hover:bg-amber-200"
    >
      <Download className="h-4 w-4" />
      Share refusal card
    </button>
  );
}
