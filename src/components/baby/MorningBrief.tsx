"use client";

import { Suggestion } from "@/lib/babyBrief";

interface Props {
  suggestions: Suggestion[];
  onDismiss: () => void;
}

export default function MorningBrief({ suggestions, onDismiss }: Props) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Hey there" : "Evening";

  return (
    <section className="rounded-2xl bg-sage-50 border border-sage-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-sage-400">
            {greeting}
          </p>
          <h2 className="text-base font-semibold text-sage-800">
            Today&apos;s nudge
          </h2>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-sage-400 hover:text-sage-600 px-2 py-1 rounded-md"
          aria-label="Dismiss today's brief"
        >
          got it
        </button>
      </div>
      <ul className="space-y-2.5">
        {suggestions.map((s, i) => (
          <li key={i} className="text-sm text-sage-700">
            <p className="font-medium">{s.headline}</p>
            {s.detail && (
              <p className="text-sage-500 text-[13px] mt-0.5">{s.detail}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
