# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # Start Next.js dev server at http://localhost:3000
npm run build   # Production build
npm run lint    # ESLint (flat config, eslint-config-next)
```

There is no test suite. The web app requires `ANTHROPIC_API_KEY` in `.env.local` (see `.env.example`); without it the task-extraction API returns a 500.

The iOS app has no checked-in `.xcodeproj` — it is built by hand in Xcode following `ios/BrainDump/SETUP.md`, which also covers passing the API key via a User-Defined build setting. It cannot be built or run outside macOS.

## What this is

**Brain Dump**: a voice-to-task-list app for busy new mums. The user speaks freely, speech is transcribed live, and Claude extracts structured tasks (title, category, priority, time-sensitivity). Two parallel implementations of the same product live in this repo:

1. **Web** (`src/`) — Next.js 16 App Router, React 19, Tailwind CSS 4, TypeScript
2. **iOS** (`ios/BrainDump/`) — SwiftUI, SwiftData, ActivityKit Live Activities

### Web architecture

The whole app is one client page, `src/app/page.tsx`, plus one API route:

- `src/hooks/useSpeechRecognition.ts` wraps the browser Web Speech API (`SpeechRecognition`/`webkitSpeechRecognition`, `lang: "en-AU"`). It deliberately uses refs (`transcriptRef`, `onStopCallbackRef`) rather than state for the stop-callback flow to avoid stale closures — `stopRecording(onComplete)` fires the callback from `onend` with the final transcript. Preserve this pattern when touching it.
- On stop, the page POSTs the transcript to `src/app/api/extract-tasks/route.ts`, the only server-side code. It calls the Anthropic API via `@anthropic-ai/sdk` (`claude-sonnet-4-20250514`) with a prompt demanding JSON-only output, parses it, and returns `{ tasks: [...] }`. `id`, `completed`, and `createdAt` are added client-side.
- Tasks persist to `localStorage` via `src/lib/storage.ts`. There is no database or auth. The page gates rendering on a `mounted` flag to avoid hydration mismatch with localStorage.
- Shared types (`Task`, `Category`, `Priority`) live in `src/types/index.ts`. Categories and priorities are fixed unions — the Claude prompt, the types, and the iOS `ExtractedTask` all enumerate the same values.
- Path alias: `@/*` → `src/*`.

Note: `ai` and `@ai-sdk/anthropic` are in `package.json` but currently unused; the route uses the raw `@anthropic-ai/sdk` client.

### iOS architecture

Mirrors the web app one-to-one: `SpeechService` (Apple Speech framework) ↔ the web hook, `ClaudeService` (direct `URLSession` call to the Anthropic API) ↔ the API route, SwiftData `TaskItem` ↔ localStorage, `BrainDumpViewModel` ↔ `page.tsx` state. The extras are `LiveActivityService` and `BrainDumpWidgets/` (Lock Screen + Dynamic Island Live Activity showing recording/processing state); `Models/LiveActivityAttributes.swift` must belong to both Xcode targets.

### Cross-cutting convention

The task-extraction prompt and its JSON schema are **duplicated verbatim** in `src/app/api/extract-tasks/route.ts` and `ios/BrainDump/BrainDump/Services/ClaudeService.swift`. Any change to the prompt, categories, priorities, or output format must be made in both places (and in `src/types/index.ts` / `TaskItem.swift`).

## Styling

- Tailwind CSS 4 with CSS-first config: the design tokens are CSS variables in `src/app/globals.css` mapped through `@theme inline` (no `tailwind.config` file). The palette is custom — `sage-*`, `warm-*`, and soft accent colors (`rose-soft`, `sky-soft`, `amber-soft`, `lavender-soft`, `mint-soft`) — with `ios/BrainDump/BrainDump/Views/Colors.swift` mirroring the same values. Add new colors in both.
- UI copy uses Australian English ("organised") and a gentle, reassuring tone; speech recognition is `en-AU`.
