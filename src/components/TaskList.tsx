"use client";

import { Task, Category } from "@/types";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onClearCompleted: () => void;
}

const categoryOrder: Category[] = [
  "Baby",
  "Health",
  "Household",
  "Finance",
  "Personal",
];

export default function TaskList({
  tasks,
  onToggle,
  onClearCompleted,
}: TaskListProps) {
  if (tasks.length === 0) return null;

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  // Group tasks by category, maintaining priority order within each group
  const grouped = categoryOrder.reduce(
    (acc, category) => {
      const categoryTasks = tasks
        .filter((t) => t.category === category)
        .sort((a, b) => {
          // Completed items go to the bottom
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          // Then sort by priority
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
      if (categoryTasks.length > 0) {
        acc[category] = categoryTasks;
      }
      return acc;
    },
    {} as Record<string, Task[]>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-sage-500">
          {completedCount} of {totalCount} done
        </p>
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-sm text-sage-400 hover:text-sage-600 transition-colors"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-warm-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-sage-400 rounded-full transition-all duration-500"
          style={{
            width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
          }}
        />
      </div>

      {Object.entries(grouped).map(([category, categoryTasks]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-sage-400 uppercase tracking-wider mb-2 px-1">
            {category}
          </h3>
          <div className="space-y-2">
            {categoryTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={onToggle} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
