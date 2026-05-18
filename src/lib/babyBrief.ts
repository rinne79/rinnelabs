import {
  Allergen,
  ALLERGENS,
  Block,
  BLOCKS,
  Meal,
  Texture,
  TEXTURES,
} from "@/types/baby";
import { ALLERGEN_META, BLOCK_META } from "./babyKnowledge";
import { daysAgoKey, todayKey } from "./babyStorage";

export interface DaySummary {
  blocksHit: Block[];
  blocksMissed: Block[];
  texturesHit: Texture[];
  allergensHit: Allergen[];
  mealCount: number;
}

export function summariseDay(meals: Meal[], date: string): DaySummary {
  const todays = meals.filter((m) => m.date === date);
  const blocks = new Set<Block>();
  const textures = new Set<Texture>();
  const allergens = new Set<Allergen>();
  for (const m of todays) {
    m.blocks.forEach((b) => blocks.add(b));
    m.textures.forEach((t) => textures.add(t));
    m.allergens.forEach((a) => allergens.add(a));
  }
  return {
    blocksHit: BLOCKS.filter((b) => blocks.has(b)),
    blocksMissed: BLOCKS.filter((b) => !blocks.has(b)),
    texturesHit: TEXTURES.filter((t) => textures.has(t)),
    allergensHit: ALLERGENS.filter((a) => allergens.has(a)),
    mealCount: todays.length,
  };
}

export function allergensInWindow(meals: Meal[], days: number): Set<Allergen> {
  const cutoff = daysAgoKey(days - 1);
  const set = new Set<Allergen>();
  for (const m of meals) {
    if (m.date >= cutoff) m.allergens.forEach((a) => set.add(a));
  }
  return set;
}

export function texturesInWindow(meals: Meal[], days: number): Set<Texture> {
  const cutoff = daysAgoKey(days - 1);
  const set = new Set<Texture>();
  for (const m of meals) {
    if (m.date >= cutoff) m.textures.forEach((t) => set.add(t));
  }
  return set;
}

export interface Suggestion {
  headline: string;
  detail?: string;
}

// Pick one randomish example from a block's list without repeating yesterday's wording.
function pickExamples(block: Block, n: number = 2): string[] {
  const xs = BLOCK_META[block].examples;
  const shuffled = [...xs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function buildMorningSuggestions(meals: Meal[]): Suggestion[] {
  const today = todayKey();
  const yesterday = daysAgoKey(1);
  const yest = summariseDay(meals, yesterday);
  const tod = summariseDay(meals, today);
  const suggestions: Suggestion[] = [];

  // First-time / quiet log: don't pretend yesterday had gaps
  if (meals.length === 0) {
    return [
      {
        headline: "Welcome — log your first meal anytime 🌿",
        detail:
          "Tap '+ Log a meal' and jot what she had. I'll auto-tag the building blocks and keep a chill score from there.",
      },
      {
        headline: "5 daily blocks: 🥩 iron · 🥛 calcium · 🥑 fat · 🌈 fruit+veg · 🍞 carbs",
        detail:
          "Aim to tick each one across the day — not every meal. Miss a couple? Catch them tomorrow.",
      },
    ];
  }

  // 1. Blocks missed yesterday — front-load today
  if (yest.mealCount > 0) {
    for (const block of yest.blocksMissed) {
      if (tod.blocksHit.includes(block)) continue;
      const examples = pickExamples(block, 2);
      suggestions.push({
        headline: `Slip in some ${BLOCK_META[block].label.toLowerCase()} today ${BLOCK_META[block].emoji}`,
        detail: `Easy wins: ${examples.join(", ")}.`,
      });
      if (suggestions.length >= 2) break;
    }
  }

  // 2. Allergens not seen in 7 days — rotation nudge
  const seen = allergensInWindow(meals, 7);
  const dueAllergens = ALLERGENS.filter(
    (a) => ALLERGEN_META[a].rotate && !seen.has(a),
  );
  if (dueAllergens.length > 0 && suggestions.length < 3) {
    const a = dueAllergens[0];
    suggestions.push({
      headline: `Time to revisit ${ALLERGEN_META[a].label.toLowerCase()}`,
      detail: allergenIdea(a),
    });
  }

  // 3. Texture nudge if a category has been missing for a week
  const tex = texturesInWindow(meals, 7);
  if (suggestions.length < 3) {
    if (!tex.has("finger")) {
      suggestions.push({
        headline: "Offer something to grab today 🥕",
        detail:
          "Soft finger food (toast strips, banana, well-cooked carrot) builds chewing + pincer grip.",
      });
    } else if (!tex.has("lumpy")) {
      suggestions.push({
        headline: "Throw in some lumps 🍲",
        detail: "Mashed beans or a chunky stew helps move on from smooth.",
      });
    }
  }

  // 4. Fallback if everything is on track
  if (suggestions.length === 0) {
    suggestions.push({
      headline: "Honestly? You're nailing it 🌿",
      detail: "Yesterday hit all 5 building blocks. Carry on, gently.",
    });
  }

  return suggestions.slice(0, 3);
}

function allergenIdea(a: Allergen): string {
  switch (a) {
    case "peanut":
      return "Smooth peanut butter thinned with water, spread thin on toast.";
    case "sesame":
      return "Tahini stirred into yogurt or smeared on bread.";
    case "egg":
      return "Scrambled egg or a finger of omelette.";
    case "fish":
      return "Flaked salmon, mackerel pâté, or tinned sardines mashed on toast.";
    case "wheat":
      return "Toast fingers or a few pieces of pasta.";
    case "soy":
      return "A few cubes of soft tofu or some edamame, well-mashed.";
    case "treenut":
      return "Almond or cashew butter thinned and spread thin.";
    case "shellfish":
      return "Optional — usually introduced later. Skip if you'd rather wait.";
  }
}
