"use client";

import { useMemo } from "react";
import {
  allergensInWindow,
  summariseDay,
  texturesInWindow,
} from "@/lib/babyBrief";
import { ALLERGEN_META, TEXTURE_META } from "@/lib/babyKnowledge";
import { ALLERGENS, Meal, TEXTURES } from "@/types/baby";
import { daysAgoKey, todayKey } from "@/lib/babyStorage";

interface Props {
  meals: Meal[];
}

const DAYS = 7;

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function WeekStrip({ meals }: Props) {
  const days = useMemo(() => {
    const out: { date: string; label: string; hit: number }[] = [];
    const today = new Date();
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = i === 0 ? todayKey() : daysAgoKey(i);
      const summary = summariseDay(meals, key);
      out.push({
        date: key,
        label: DAY_LABELS[d.getDay()],
        hit: summary.blocksHit.length,
      });
    }
    return out;
  }, [meals]);

  const weekAllergens = useMemo(
    () => allergensInWindow(meals, DAYS),
    [meals],
  );
  const weekTextures = useMemo(() => texturesInWindow(meals, DAYS), [meals]);

  return (
    <section className="rounded-2xl bg-white/70 border border-sage-100 p-4 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-sage-700 mb-2">
          Last 7 days
        </h2>
        <div className="flex justify-between gap-1">
          {days.map((d, i) => (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div className="text-[10px] text-sage-400">{d.label}</div>
              <div
                className={`w-full aspect-square rounded-md flex items-center justify-center text-xs font-medium ${
                  d.hit === 0
                    ? "bg-warm-100 text-sage-300"
                    : d.hit >= 5
                      ? "bg-sage-500 text-white"
                      : d.hit >= 3
                        ? "bg-sage-300 text-sage-800"
                        : "bg-sage-100 text-sage-600"
                }`}
                title={`${d.date}: ${d.hit}/5 blocks`}
              >
                {d.hit > 0 ? d.hit : ""}
              </div>
              {i === days.length - 1 && (
                <div className="text-[9px] text-sage-400">today</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-sage-600 mb-1.5">
          Allergen rotation (last 7d)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ALLERGENS.map((a) => {
            const hit = weekAllergens.has(a);
            const rotates = ALLERGEN_META[a].rotate;
            return (
              <span
                key={a}
                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  hit
                    ? "bg-mint-soft/60 border-sage-300 text-sage-800"
                    : rotates
                      ? "bg-warm-100 border-warm-200 text-sage-400"
                      : "bg-transparent border-warm-200 text-sage-300"
                }`}
                title={
                  hit
                    ? "Given this week"
                    : rotates
                      ? "Try to revisit this week"
                      : "Optional"
                }
              >
                {ALLERGEN_META[a].label}
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-sage-600 mb-1.5">
          Texture mix (last 7d)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TEXTURES.map((t) => {
            const hit = weekTextures.has(t);
            const meta = TEXTURE_META[t];
            return (
              <span
                key={t}
                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  hit
                    ? "bg-mint-soft/60 border-sage-300 text-sage-800"
                    : "bg-warm-100 border-warm-200 text-sage-400"
                }`}
              >
                {meta.emoji} {meta.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
