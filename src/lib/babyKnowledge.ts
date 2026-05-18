import { Allergen, Block, Texture } from "@/types/baby";

export const BLOCK_META: Record<
  Block,
  { label: string; emoji: string; tint: string; why: string; examples: string[] }
> = {
  iron: {
    label: "Iron",
    emoji: "🥩",
    tint: "bg-rose-soft/50",
    why: "Birth stores run out around now — top priority",
    examples: [
      "scrambled egg",
      "lentil dahl",
      "beans on toast",
      "shredded chicken",
      "fortified baby cereal",
      "spinach in pasta",
    ],
  },
  calcium: {
    label: "Calcium",
    emoji: "🥛",
    tint: "bg-sky-soft/50",
    why: "Extra critical with CMPA — no dairy default",
    examples: [
      "calcium-fortified plant yogurt",
      "tahini on toast",
      "tofu cubes",
      "fortified oat milk in porridge",
      "tinned sardines (boned)",
      "broccoli florets",
    ],
  },
  fat: {
    label: "Healthy fat",
    emoji: "🥑",
    tint: "bg-mint-soft/50",
    why: "Brain development — babies need a high % of fat",
    examples: [
      "avocado smash",
      "nut butter on toast",
      "salmon flakes",
      "olive oil drizzle",
      "egg yolk",
      "seed butter",
    ],
  },
  veg: {
    label: "Fruit + veg",
    emoji: "🌈",
    tint: "bg-amber-soft/50",
    why: "Gut microbiome + flavour exposure — aim 3 colours",
    examples: [
      "berries",
      "roasted carrot sticks",
      "mashed peas",
      "banana",
      "sweetcorn",
      "cucumber spears",
    ],
  },
  carb: {
    label: "Energy carb",
    emoji: "🍞",
    tint: "bg-lavender-soft/50",
    why: "Tiny stomach needs dense fuel",
    examples: [
      "porridge",
      "toast fingers",
      "pasta",
      "rice",
      "sweet potato wedges",
      "couscous",
    ],
  },
};

export const TEXTURE_META: Record<Texture, { label: string; emoji: string }> = {
  puree: { label: "Purée", emoji: "🥣" },
  lumpy: { label: "Lumpy / mashed", emoji: "🍲" },
  finger: { label: "Finger food", emoji: "🥕" },
};

export const ALLERGEN_META: Record<
  Allergen,
  { label: string; rotate: boolean }
> = {
  egg: { label: "Egg", rotate: true },
  peanut: { label: "Peanut", rotate: true },
  sesame: { label: "Sesame", rotate: true },
  fish: { label: "Fish", rotate: true },
  wheat: { label: "Wheat", rotate: true },
  soy: { label: "Soy", rotate: true },
  treenut: { label: "Tree nut", rotate: true },
  shellfish: { label: "Shellfish", rotate: false },
};

// Heuristic auto-tagging from free text.
// Conservative — better to under-tag than mislabel.
export function autoTag(text: string): {
  blocks: Block[];
  allergens: Allergen[];
} {
  const t = text.toLowerCase();
  const has = (...words: string[]) => words.some((w) => t.includes(w));

  const blocks = new Set<Block>();
  const allergens = new Set<Allergen>();

  // Iron sources
  if (
    has(
      "egg",
      "chicken",
      "beef",
      "lamb",
      "pork",
      "mince",
      "lentil",
      "bean",
      "chickpea",
      "dahl",
      "dal",
      "liver",
      "spinach",
      "fortified cereal",
      "weetabix",
      "ready brek",
    )
  )
    blocks.add("iron");

  // Calcium sources (CMPA-safe ones)
  if (
    has(
      "fortified",
      "yogurt",
      "yoghurt",
      "tahini",
      "tofu",
      "sardine",
      "broccoli",
      "kale",
      "fortified oat milk",
      "oat m!lk",
    )
  )
    blocks.add("calcium");

  // Healthy fats
  if (
    has(
      "avocado",
      "olive oil",
      "salmon",
      "mackerel",
      "sardine",
      "nut butter",
      "peanut butter",
      "almond butter",
      "tahini",
      "seed",
    )
  )
    blocks.add("fat");
  if (has("egg")) blocks.add("fat"); // yolk

  // Veg & fruit
  if (
    has(
      "berry",
      "berries",
      "blueberr",
      "raspberr",
      "strawberr",
      "banana",
      "apple",
      "pear",
      "mango",
      "kiwi",
      "orange",
      "tomato",
      "carrot",
      "broccoli",
      "pea",
      "courgette",
      "zucchini",
      "sweetcorn",
      "corn",
      "cucumber",
      "pepper",
      "spinach",
      "kale",
      "avocado",
      "sweet potato",
      "butternut",
      "squash",
      "parsnip",
      "fruit",
      "veg",
    )
  )
    blocks.add("veg");

  // Carbs
  if (
    has(
      "toast",
      "bread",
      "pasta",
      "rice",
      "potato",
      "porridge",
      "oat",
      "couscous",
      "noodle",
      "tortilla",
      "wrap",
      "pancake",
      "cracker",
      "cereal",
    )
  )
    blocks.add("carb");

  // Allergens
  if (has("egg")) allergens.add("egg");
  if (has("peanut")) allergens.add("peanut");
  if (has("sesame", "tahini", "hummus")) allergens.add("sesame");
  if (
    has(
      "salmon",
      "tuna",
      "cod",
      "mackerel",
      "sardine",
      "haddock",
      "fish",
      "trout",
    )
  )
    allergens.add("fish");
  if (
    has(
      "bread",
      "toast",
      "pasta",
      "couscous",
      "wheat",
      "noodle",
      "cracker",
      "weetabix",
      "tortilla",
      "wrap",
      "pancake",
    )
  )
    allergens.add("wheat");
  if (has("soy", "soya", "tofu", "edamame", "tempeh"))
    allergens.add("soy");
  if (
    has(
      "almond",
      "cashew",
      "walnut",
      "hazelnut",
      "pistachio",
      "pecan",
      "tree nut",
      "treenut",
    )
  )
    allergens.add("treenut");
  if (has("prawn", "shrimp", "crab", "lobster", "shellfish"))
    allergens.add("shellfish");

  return { blocks: Array.from(blocks), allergens: Array.from(allergens) };
}
