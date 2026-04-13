"use client";

import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Baby: "bg-rose-soft text-sage-800",
  Household: "bg-sky-soft text-sage-800",
  Personal: "bg-lavender-soft text-sage-800",
  Finance: "bg-amber-soft text-sage-800",
  Health: "bg-mint-soft text-sage-800",
};

const priorityStyles: Record<string, string> = {
  High: "bg-sage-600 text-white",
  Medium: "bg-sage-300 text-sage-800",
  Low: "bg-warm-200 text-sage-600",
};

export default function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-xl transition-all duration-200 ${
        task.completed
          ? "bg-warm-100/50 opacity-60"
          : "bg-white/70 backdrop-blur-sm border border-sage-100 shadow-sm"
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          task.completed
            ? "bg-sage-400 border-sage-400"
            : "border-sage-300 hover:border-sage-400"
        }`}
        aria-label={
          task.completed ? "Mark as incomplete" : "Mark as complete"
        }
      >
        {task.completed && (
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium leading-snug ${
            task.completed
              ? "line-through text-sage-400"
              : "text-sage-800"
          }`}
        >
          {task.title}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[task.category] || "bg-warm-200 text-sage-600"}`}
          >
            {task.category}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}
          >
            {task.priority}
          </span>
          {task.timeSensitive && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-700">
              {task.timeSensitive}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
