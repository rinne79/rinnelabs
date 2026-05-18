"use client";

import { useState } from "react";
import { buildDailyReminderIcs, downloadIcs } from "@/lib/babyIcs";

export default function ReminderCard() {
  const [hour, setHour] = useState(8);
  const [done, setDone] = useState(false);

  const handleDownload = () => {
    const hh = String(hour).padStart(2, "0");
    const ics = buildDailyReminderIcs({
      hour,
      minute: 0,
      summary: "Check today's baby food brief",
      description:
        "Open the food tracker and see today's suggested building blocks.",
    });
    downloadIcs(`baby-brief-${hh}00.ics`, ics);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <section className="rounded-2xl border border-sage-200 bg-warm-50 p-4">
      <h2 className="text-sm font-semibold text-sage-700">
        Daily morning reminder
      </h2>
      <p className="text-[13px] text-sage-500 mt-1">
        Adds a recurring event to your phone calendar — your calendar app
        handles the notification, even when this page is closed.
      </p>
      <div className="flex items-center gap-2 mt-3">
        <label className="text-xs text-sage-600">Time</label>
        <select
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="text-sm rounded-lg border border-sage-200 bg-white px-2 py-1"
        >
          {Array.from({ length: 12 }, (_, i) => i + 6).map((h) => (
            <option key={h} value={h}>
              {h < 12 ? `${h}:00 am` : h === 12 ? "12:00 pm" : `${h - 12}:00 pm`}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleDownload}
          className="ml-auto text-sm bg-sage-600 text-white px-3 py-1.5 rounded-lg"
        >
          {done ? "✓ Open the file" : "Add to calendar"}
        </button>
      </div>
      {done && (
        <p className="text-[12px] text-sage-500 mt-2">
          On iPhone, tap the downloaded file → Add to Calendar. On Android,
          open with Google Calendar.
        </p>
      )}
    </section>
  );
}
