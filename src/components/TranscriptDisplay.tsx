"use client";

interface TranscriptDisplayProps {
  transcript: string;
  isRecording: boolean;
}

export default function TranscriptDisplay({
  transcript,
  isRecording,
}: TranscriptDisplayProps) {
  if (!transcript && !isRecording) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-sage-100">
        <p className="text-sm text-sage-400 mb-1 font-medium">
          {isRecording ? "Hearing you..." : "You said:"}
        </p>
        <p className="text-sage-800 leading-relaxed">
          {transcript || (
            <span className="text-sage-300 italic">
              Start speaking...
            </span>
          )}
          {isRecording && (
            <span className="inline-block w-1.5 h-4 bg-sage-400 ml-0.5 animate-pulse align-text-bottom" />
          )}
        </p>
      </div>
    </div>
  );
}
