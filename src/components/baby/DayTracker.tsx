"use client";

import { BLOCKS } from "@/types/baby";
import { BLOCK_META } from "@/lib/babyKnowledge";
import { DaySummary } from "@/lib/babyBrief";

interface Props {
  summary: DaySummary;
  label?: string;
}

export default function DayTracker({ summary, label = "Today" }: Props) {
  const hitCount = summary.blocksHit.length;
  return (
    <section className="rounded-2xl bg-white/70 border border-sage-100 p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-semibold text-sage-700">{label}</h2>
        <span className="text-xs text-sage-400">
          {hitCount}/5 blocks · {summary.mealCount}{" "}
          {summary.mealCount === 1 ? "meal" : "meals"}
        </span>
      </div>
      <ul className="grid grid-cols-5 gap-2">
        {BLOCKS.map((b) => {
          const hit = summary.blocksHit.includes(b);
          const meta = BLOCK_META[b];
          return (
            <li
              key={b}
              className={`flex flex-col items-center gap-1 rounded-xl py-2 px-1 text-center transition ${
                hit ? meta.tint : "bg-warm-100/60"
              }`}
              title={`${meta.label} — ${meta.why}`}
            >
              <span
                className={`text-2xl ${hit ? "" : "grayscale opacity-40"}`}
              >
                {meta.emoji}
              </span>
              <span
                className={`text-[10px] leading-tight ${
                  hit ? "text-sage-700 font-medium" : "text-sage-400"
                }`}
              >
                {meta.label}
              </span>
            </li>
          );
        })}
      </ul>
      {(summary.texturesHit.length > 0 || summary.allergensHit.length > 0) && (
        <div className="mt-3 text-[11px] text-sage-500 flex flex-wrap gap-x-3 gap-y-1">
          {summary.texturesHit.length > 0 && (
            <span>
              Textures: {summary.texturesHit.join(", ")}
            </span>
          )}
          {summary.allergensHit.length > 0 && (
            <span>
              Allergens: {summary.allergensHit.join(", ")}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
