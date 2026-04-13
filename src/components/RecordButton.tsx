"use client";

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onToggle: () => void;
}

export default function RecordButton({
  isRecording,
  isProcessing,
  onToggle,
}: RecordButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full bg-sage-400/30 animate-pulse-ring" />
            <div
              className="absolute inset-0 rounded-full bg-sage-400/20 animate-pulse-ring"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}
        <button
          onClick={onToggle}
          disabled={isProcessing}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
            isProcessing
              ? "bg-warm-300 cursor-not-allowed"
              : isRecording
                ? "bg-sage-500 shadow-lg shadow-sage-500/30 scale-105"
                : "bg-sage-400 hover:bg-sage-500 shadow-md hover:shadow-lg"
          }`}
          aria-label={
            isProcessing
              ? "Processing..."
              : isRecording
                ? "Stop recording"
                : "Start recording"
          }
        >
          {isProcessing ? (
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : isRecording ? (
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-sm text-sage-500 font-medium">
        {isProcessing
          ? "Organising your thoughts..."
          : isRecording
            ? "Listening... tap to stop"
            : "Tap to brain dump"}
      </p>
    </div>
  );
}
