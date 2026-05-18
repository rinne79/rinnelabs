"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DayTracker from "@/components/baby/DayTracker";
import MealList from "@/components/baby/MealList";
import MealLogger from "@/components/baby/MealLogger";
import MorningBrief from "@/components/baby/MorningBrief";
import ReminderCard from "@/components/baby/ReminderCard";
import WeekStrip from "@/components/baby/WeekStrip";
import { buildMorningSuggestions, summariseDay } from "@/lib/babyBrief";
import {
  loadMeals,
  loadSettings,
  saveMeals,
  saveSettings,
  todayKey,
} from "@/lib/babyStorage";
import { Meal } from "@/types/baby";

export default function BabyPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showLogger, setShowLogger] = useState(false);
  const [editing, setEditing] = useState<Meal | undefined>(undefined);
  const [showSettings, setShowSettings] = useState(false);
  const [briefDismissed, setBriefDismissed] = useState(false);

  useEffect(() => {
    const s = loadSettings();
    const loaded = loadMeals();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage
    setMeals(loaded);
    setBriefDismissed(s.briefDismissedDate === todayKey());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveMeals(meals);
  }, [meals, mounted]);

  const today = todayKey();
  const todaySummary = useMemo(() => summariseDay(meals, today), [meals, today]);
  const todaysMeals = useMemo(
    () => meals.filter((m) => m.date === today),
    [meals, today],
  );
  const suggestions = useMemo(
    () => (mounted ? buildMorningSuggestions(meals) : []),
    [meals, mounted],
  );

  const handleSave = (meal: Meal) => {
    setMeals((prev) => {
      const idx = prev.findIndex((m) => m.id === meal.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = meal;
        return next;
      }
      return [meal, ...prev];
    });
    setShowLogger(false);
    setEditing(undefined);
  };

  const handleDelete = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleEdit = (m: Meal) => {
    setEditing(m);
    setShowLogger(true);
  };

  const handleDismissBrief = () => {
    setBriefDismissed(true);
    saveSettings({ briefDismissedDate: today });
  };

  if (!mounted) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-sage-300 border-t-sage-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col max-w-xl w-full mx-auto px-4 pb-16">
      <header className="pt-10 pb-4 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sage-800 tracking-tight">
            Baby food
          </h1>
          <p className="text-xs text-sage-400 mt-0.5">
            10mo · CMPA · 5 daily blocks, chill rules
          </p>
        </div>
        <Link
          href="/"
          className="text-xs text-sage-400 hover:text-sage-600"
        >
          ← home
        </Link>
      </header>

      <div className="space-y-4">
        {!briefDismissed && (
          <MorningBrief
            suggestions={suggestions}
            onDismiss={handleDismissBrief}
          />
        )}

        <DayTracker summary={todaySummary} />

        {showLogger ? (
          <MealLogger
            onSave={handleSave}
            onCancel={() => {
              setShowLogger(false);
              setEditing(undefined);
            }}
            editing={editing}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowLogger(true)}
            className="w-full bg-sage-600 text-white text-sm font-medium py-3 rounded-2xl shadow-sm hover:bg-sage-700 transition"
          >
            + Log a meal
          </button>
        )}

        <section>
          <h2 className="text-sm font-semibold text-sage-700 mb-2 px-1">
            Today
          </h2>
          <MealList
            meals={todaysMeals}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>

        <WeekStrip meals={meals} />

        <section>
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="text-xs text-sage-400 hover:text-sage-600 px-1"
          >
            {showSettings ? "▾" : "▸"} Reminders & settings
          </button>
          {showSettings && (
            <div className="mt-3 space-y-3">
              <ReminderCard />
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      "Clear all logged meals? This can't be undone.",
                    )
                  ) {
                    setMeals([]);
                  }
                }}
                className="text-xs text-sage-400 hover:text-rose-600 underline"
              >
                Clear all data
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
