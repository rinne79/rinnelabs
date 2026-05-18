"use client";

import { useMemo, useState } from "react";
import {
  ALLERGEN_META,
  BLOCK_META,
  TEXTURE_META,
  autoTag,
} from "@/lib/babyKnowledge";
import {
  ALLERGENS,
  Allergen,
  Block,
  BLOCKS,
  Meal,
  MealRating,
  Slot,
  SLOTS,
  Texture,
  TEXTURES,
} from "@/types/baby";
import { todayKey } from "@/lib/babyStorage";

interface Props {
  onSave: (meal: Meal) => void;
  onCancel: () => void;
  editing?: Meal;
}

function defaultSlot(): Slot {
  const h = new Date().getHours();
  if (h < 10) return "breakfast";
  if (h < 14) return "lunch";
  if (h < 17) return "snack";
  return "dinner";
}

const RATINGS: { value: MealRating; emoji: string; label: string }[] = [
  { value: "good", emoji: "👍", label: "Loved it" },
  { value: "meh", emoji: "😐", label: "Some of it" },
  { value: "shrug", emoji: "🤷", label: "Not into it" },
];

export default function MealLogger({ onSave, onCancel, editing }: Props) {
  const [slot, setSlot] = useState<Slot>(editing?.slot ?? defaultSlot());
  const [description, setDescription] = useState(editing?.description ?? "");
  const [blocks, setBlocks] = useState<Set<Block>>(
    new Set(editing?.blocks ?? []),
  );
  const [allergens, setAllergens] = useState<Set<Allergen>>(
    new Set(editing?.allergens ?? []),
  );
  const [textures, setTextures] = useState<Set<Texture>>(
    new Set(editing?.textures ?? []),
  );
  const [rating, setRating] = useState<MealRating | undefined>(editing?.rating);
  const [showAllergens, setShowAllergens] = useState(false);
  const [autoTagged, setAutoTagged] = useState(false);

  // Auto-tag as the user types — only adds chips, never removes manual ones.
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (editing) return;
    const trimmed = value.trim();
    if (!trimmed) {
      setAutoTagged(false);
      return;
    }
    const { blocks: autoBlocks, allergens: autoAllergens } = autoTag(trimmed);
    setBlocks((prev) => {
      const next = new Set(prev);
      autoBlocks.forEach((b) => next.add(b));
      return next;
    });
    setAllergens((prev) => {
      const next = new Set(prev);
      autoAllergens.forEach((a) => next.add(a));
      return next;
    });
    setAutoTagged(autoBlocks.length + autoAllergens.length > 0);
  };

  const toggle = <T,>(set: Set<T>, value: T, setFn: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setFn(next);
  };

  const canSave = useMemo(
    () => description.trim().length > 0 || blocks.size > 0,
    [description, blocks],
  );

  const handleSave = () => {
    if (!canSave) return;
    const meal: Meal = {
      id: editing?.id ?? crypto.randomUUID(),
      date: editing?.date ?? todayKey(),
      slot,
      description: description.trim(),
      blocks: Array.from(blocks),
      allergens: Array.from(allergens),
      textures: Array.from(textures),
      rating,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    };
    onSave(meal);
  };

  return (
    <div className="rounded-2xl bg-white border border-sage-200 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-sage-700">
          {editing ? "Edit meal" : "Log a meal"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-sage-400 hover:text-sage-600"
        >
          cancel
        </button>
      </div>

      {/* Slot */}
      <div className="flex gap-1.5 flex-wrap">
        {SLOTS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSlot(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition capitalize ${
              slot === s
                ? "bg-sage-600 text-white border-sage-600"
                : "bg-white text-sage-600 border-sage-200 hover:border-sage-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Description */}
      <div>
        <label className="text-xs text-sage-500 block mb-1.5">
          What did she have?
        </label>
        <textarea
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="e.g. toast with avo and fried egg"
          rows={2}
          className="w-full text-sm rounded-xl border border-sage-200 px-3 py-2 bg-warm-50 focus:outline-none focus:border-sage-400 resize-none"
        />
        {autoTagged && !editing && (
          <p className="text-[11px] text-sage-400 mt-1">
            ✨ I&apos;ve guessed the tags below — tweak if wrong.
          </p>
        )}
      </div>

      {/* Blocks */}
      <div>
        <p className="text-xs text-sage-500 mb-1.5">Building blocks hit</p>
        <div className="flex flex-wrap gap-1.5">
          {BLOCKS.map((b) => {
            const active = blocks.has(b);
            const meta = BLOCK_META[b];
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggle(blocks, b, setBlocks)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition flex items-center gap-1 ${
                  active
                    ? `${meta.tint} border-sage-300 text-sage-800`
                    : "bg-white text-sage-500 border-sage-200"
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Texture */}
      <div>
        <p className="text-xs text-sage-500 mb-1.5">Texture (optional)</p>
        <div className="flex flex-wrap gap-1.5">
          {TEXTURES.map((t) => {
            const active = textures.has(t);
            const meta = TEXTURE_META[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggle(textures, t, setTextures)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition flex items-center gap-1 ${
                  active
                    ? "bg-sage-100 border-sage-300 text-sage-800"
                    : "bg-white text-sage-500 border-sage-200"
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Allergens (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setShowAllergens((v) => !v)}
          className="text-xs text-sage-500 mb-1.5 flex items-center gap-1 hover:text-sage-700"
        >
          <span>{showAllergens ? "▾" : "▸"}</span>
          <span>Allergen exposure</span>
          {allergens.size > 0 && (
            <span className="text-sage-700 font-medium">
              ({allergens.size})
            </span>
          )}
        </button>
        {showAllergens && (
          <div className="flex flex-wrap gap-1.5">
            {ALLERGENS.map((a) => {
              const active = allergens.has(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggle(allergens, a, setAllergens)}
                  className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                    active
                      ? "bg-amber-soft/60 border-sage-300 text-sage-800"
                      : "bg-white text-sage-500 border-sage-200"
                  }`}
                >
                  {ALLERGEN_META[a].label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs text-sage-500 mb-1.5">How did it go?</p>
        <div className="flex gap-2">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() =>
                setRating((cur) => (cur === r.value ? undefined : r.value))
              }
              className={`text-xl px-3 py-1.5 rounded-xl border transition ${
                rating === r.value
                  ? "bg-mint-soft/60 border-sage-300"
                  : "bg-white border-sage-200"
              }`}
              aria-label={r.label}
              title={r.label}
            >
              {r.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="flex-1 bg-sage-600 text-white text-sm font-medium py-2.5 rounded-xl disabled:bg-sage-200 disabled:text-sage-400"
        >
          {editing ? "Save changes" : "Log meal"}
        </button>
      </div>
    </div>
  );
}
