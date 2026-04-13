export type Category = "Baby" | "Household" | "Personal" | "Finance" | "Health";

export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  timeSensitive: string | null; // e.g. "Thursday", "ASAP", "This week", or null
  completed: boolean;
  createdAt: string;
}

export interface BrainDumpResponse {
  tasks: Omit<Task, "id" | "completed" | "createdAt">[];
}
