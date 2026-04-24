# Brain Dump iOS - Xcode Setup Guide

## Step 1: Create the Xcode Project

1. Open Xcode
2. **File > New > Project**
3. Choose **App** under iOS, click Next
4. Settings:
   - Product Name: **BrainDump**
   - Team: Your Apple ID
   - Organization Identifier: **com.rinnelabs**
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Storage: **SwiftData**
5. Save it somewhere temporary (we'll copy the generated files)

## Step 2: Add the Widget Extension (for Live Activities)

1. In Xcode: **File > New > Target**
2. Choose **Widget Extension**
3. Product Name: **BrainDumpWidgets**
4. Check **Include Live Activity**
5. Click Finish, then Activate when prompted

## Step 3: Add our Swift files

1. Delete the auto-generated Swift files from both targets in Xcode
2. Drag these folders into the BrainDump target in Xcode:
   - `BrainDump/Models/`
   - `BrainDump/Services/`
   - `BrainDump/Views/`
   - `BrainDump/ViewModels/`
   - `BrainDump/BrainDumpApp.swift`
   - `BrainDump/Info.plist`
3. Drag these files into the BrainDumpWidgets target:
   - `BrainDumpWidgets/BrainDumpWidgets.swift`
   - `BrainDumpWidgets/BrainDumpWidgetsBundle.swift`
4. **Important**: `Models/LiveActivityAttributes.swift` must be added to BOTH targets
   (select it > File Inspector > check both BrainDump and BrainDumpWidgets)

## Step 4: Configure the API Key

1. In Xcode, select the BrainDump target
2. Go to **Build Settings** > search for **User-Defined**
3. Click **+** to add a new setting: `ANTHROPIC_API_KEY`
4. Set the value to your API key: `sk-ant-api03-...`

This gets read at runtime via Info.plist's `$(ANTHROPIC_API_KEY)` reference.

## Step 5: Capabilities

1. Select the BrainDump target > **Signing & Capabilities**
2. Ensure your Team / Apple ID is set
3. The app uses these frameworks (no additional capabilities needed):
   - Speech (for voice recognition)
   - AVFoundation (for microphone)
   - ActivityKit (for Live Activities)

## Step 6: Run

1. Connect your iPhone or select a simulator
2. Press **Cmd+R** to build and run
3. The app will ask for Microphone and Speech Recognition permission on first launch

## File Structure

```
BrainDump/
├── BrainDumpApp.swift          # App entry point
├── Info.plist                   # Permissions + API key
├── Models/
│   ├── TaskItem.swift           # SwiftData model
│   └── LiveActivityAttributes.swift  # Shared with widget
├── Services/
│   ├── ClaudeService.swift      # Claude API integration
│   ├── SpeechService.swift      # Apple Speech framework
│   └── LiveActivityService.swift # ActivityKit manager
├── ViewModels/
│   └── BrainDumpViewModel.swift # Main app logic
└── Views/
    ├── Colors.swift             # Sage/warm colour palette
    ├── ContentView.swift        # Main screen
    ├── HeaderView.swift
    ├── RecordButtonView.swift   # Animated mic button
    ├── TranscriptView.swift     # Live speech preview
    ├── TaskCardView.swift       # Individual task card
    ├── TaskListView.swift       # Grouped task list
    ├── EmptyStateView.swift
    └── ErrorBanner.swift

BrainDumpWidgets/
├── BrainDumpWidgets.swift       # Live Activity UI (Lock Screen + Dynamic Island)
└── BrainDumpWidgetsBundle.swift # Widget bundle entry point
```
