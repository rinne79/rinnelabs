"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function useSpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !("SpeechRecognition" in window) &&
      !("webkitSpeechRecognition" in window)
    ) {
      setIsSupported(false);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-AU";

    finalTranscriptRef.current = "";
    setTranscript("");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(finalTranscriptRef.current + interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "aborted") {
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback((): string => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    return transcript;
  }, [transcript]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    finalTranscriptRef.current = "";
  }, []);

  return {
    isRecording,
    transcript,
    isSupported,
    startRecording,
    stopRecording,
    resetTranscript,
  };
}
