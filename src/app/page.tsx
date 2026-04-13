"use client";

import { useState, useEffect, useCallback } from "react";
import RecordButton from "@/components/RecordButton";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import TaskList from "@/components/TaskList";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Task } from "@/types";
import { loadTasks, saveTasks } from "@/lib/storage";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    isRecording,
    transcript,
    isSupported,
    startRecording,
    stopRecording,
    resetTranscript,
  } = useSpeechRecognition();

  // Load tasks from localStorage on mount
  useEffect(() => {
    setTasks(loadTasks());
    setMounted(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      saveTasks(tasks);
    }
  }, [tasks, mounted]);

  const processTranscript = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setIsProcessing(true);
      setError(null);

      try {
        const response = await fetch("/api/extract-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Something went wrong");
        }

        const data = await response.json();

        const newTasks: Task[] = data.tasks.map(
          (t: Omit<Task, "id" | "completed" | "createdAt">) => ({
            ...t,
            id: crypto.randomUUID(),
            completed: false,
            createdAt: new Date().toISOString(),
          })
        );

        setTasks((prev) => [...newTasks, ...prev]);
        resetTranscript();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process your brain dump"
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [resetTranscript]
  );

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      const finalTranscript = stopRecording();
      if (finalTranscript.trim()) {
        processTranscript(finalTranscript);
      }
    } else {
      setError(null);
      startRecording();
    }
  }, [isRecording, stopRecording, startRecording, processTranscript]);

  const handleToggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const handleClearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  if (!mounted) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-sage-300 border-t-sage-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 text-center">
        <h1 className="text-2xl font-semibold text-sage-800 tracking-tight">
          Brain Dump
        </h1>
        <p className="text-sm text-sage-400 mt-1">
          Speak your mind, get organised
        </p>
      </header>

      {/* Recording Section */}
      <section className="flex flex-col items-center gap-6 px-6 pb-6">
        {!isSupported && (
          <div className="w-full max-w-md bg-amber-soft/50 text-sage-700 rounded-xl p-4 text-sm text-center">
            Speech recognition isn&apos;t supported in this browser. Try Chrome
            or Safari on your phone.
          </div>
        )}

        <RecordButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onToggle={handleToggleRecording}
        />

        <TranscriptDisplay
          transcript={transcript}
          isRecording={isRecording}
        />

        {error && (
          <div className="w-full max-w-md bg-rose-soft/50 text-sage-700 rounded-xl p-4 text-sm text-center">
            {error}
          </div>
        )}
      </section>

      {/* Divider */}
      {tasks.length > 0 && (
        <div className="mx-6 border-t border-sage-100" />
      )}

      {/* Task List */}
      <section className="flex-1 px-6 py-6 pb-12">
        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onClearCompleted={handleClearCompleted}
        />

        {tasks.length === 0 && !isRecording && !isProcessing && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 animate-gentle-bounce">
              <svg
                className="w-12 h-12 mx-auto text-sage-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <p className="text-sage-400 text-sm">
              Tap the button and tell me everything<br />
              on your mind. I&apos;ll sort it out for you.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
