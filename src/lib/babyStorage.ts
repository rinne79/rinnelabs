import { BabySettings, Meal } from "@/types/baby";

const MEALS_KEY = "rinne-baby-meals-v1";
const SETTINGS_KEY = "rinne-baby-settings-v1";

export function loadMeals(): Meal[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(MEALS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMeals(meals: Meal[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function loadSettings(): BabySettings {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as BabySettings;
  } catch {
    return {};
  }
}

export function saveSettings(settings: BabySettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysAgoKey(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return todayKey(d);
}
