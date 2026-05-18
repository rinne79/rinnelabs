export const BLOCKS = ["iron", "calcium", "fat", "veg", "carb"] as const;
export type Block = (typeof BLOCKS)[number];

export const TEXTURES = ["puree", "lumpy", "finger"] as const;
export type Texture = (typeof TEXTURES)[number];

export const ALLERGENS = [
  "egg",
  "peanut",
  "sesame",
  "fish",
  "wheat",
  "soy",
  "treenut",
  "shellfish",
] as const;
export type Allergen = (typeof ALLERGENS)[number];

export const SLOTS = ["breakfast", "lunch", "dinner", "snack"] as const;
export type Slot = (typeof SLOTS)[number];

export type MealRating = "good" | "meh" | "shrug";

export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD (local)
  slot: Slot;
  description: string;
  blocks: Block[];
  textures: Texture[];
  allergens: Allergen[];
  rating?: MealRating;
  createdAt: string;
}

export interface BabySettings {
  briefDismissedDate?: string;
}
