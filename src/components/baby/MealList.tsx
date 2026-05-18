"use client";

import { BLOCK_META } from "@/lib/babyKnowledge";
import { Meal } from "@/types/baby";

interface Props {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

const SLOT_EMOJI: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  snack: "🥨",
  dinner: "🌙",
};

const RATING_EMOJI: Record<string, string> = {
  good: "👍",
  meh: "😐",
  shrug: "🤷",
};

export default function MealList({ meals, onEdit, onDelete }: Props) {
  if (meals.length === 0) {
    return (
      <p className="text-center text-sm text-sage-400 py-6">
        No meals logged yet today.
      </p>
    );
  }

  // Sort by slot, then createdAt
  const order = ["breakfast", "lunch", "snack", "dinner"];
  const sorted = [...meals].sort((a, b) => {
    const oa = order.indexOf(a.slot);
    const ob = order.indexOf(b.slot);
    if (oa !== ob) return oa - ob;
    return a.createdAt.localeCompare(b.createdAt);
  });

  return (
    <ul className="space-y-2">
      {sorted.map((m) => (
        <li
          key={m.id}
          className="bg-white border border-sage-100 rounded-xl p-3 flex gap-3 items-start"
        >
          <span className="text-xl shrink-0 mt-0.5">
            {SLOT_EMOJI[m.slot] ?? "•"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-xs uppercase tracking-wider text-sage-400 capitalize">
                {m.slot}
              </p>
              {m.rating && (
                <span className="text-sm" aria-label={`rating: ${m.rating}`}>
                  {RATING_EMOJI[m.rating]}
                </span>
              )}
            </div>
            {m.description && (
              <p className="text-sm text-sage-800 mt-0.5 break-words">
                {m.description}
              </p>
            )}
            {m.blocks.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {m.blocks.map((b) => (
                  <span
                    key={b}
                    className={`text-[11px] px-1.5 py-0.5 rounded-md ${BLOCK_META[b].tint} text-sage-700`}
                  >
                    {BLOCK_META[b].emoji} {BLOCK_META[b].label}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-2 text-[11px]">
              <button
                type="button"
                onClick={() => onEdit(m)}
                className="text-sage-500 hover:text-sage-700"
              >
                edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this meal?")) onDelete(m.id);
                }}
                className="text-sage-400 hover:text-rose-600"
              >
                delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
