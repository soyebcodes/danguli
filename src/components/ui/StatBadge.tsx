type StatBadgeProps = {
  label: string;
  value: string | number;
  accent?: "amber" | "rose" | "emerald";
};

export function StatBadge({ label, value, accent = "amber" }: StatBadgeProps) {
  const accentStyles = {
    amber: "border-amber-300/30 bg-amber-500/10 text-amber-200",
    rose: "border-rose-300/30 bg-rose-500/10 text-rose-200",
    emerald: "border-emerald-300/30 bg-emerald-500/10 text-emerald-200",
  };

  return (
    <div className={`rounded-2xl border p-3 ${accentStyles[accent]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}
