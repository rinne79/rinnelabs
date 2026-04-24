import Foundation
import SwiftData
import Observation

@Observable
final class BrainDumpViewModel {
    var isProcessing = false
    var errorMessage: String?

    let speechService = SpeechService()
    private let liveActivityService = LiveActivityService()
    private var claudeService: ClaudeService?

    init() {
        if let apiKey = Bundle.main.object(forInfoDictionaryKey: "ANTHROPIC_API_KEY") as? String,
           !apiKey.isEmpty {
            claudeService = ClaudeService(apiKey: apiKey)
        }
    }

    func requestPermissions() {
        speechService.requestAuthorization()
    }

    func toggleRecording(modelContext: ModelContext) {
        if speechService.isRecording {
            speechService.stopRecording()
            let text = speechService.transcript
            if !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                processTranscript(text, modelContext: modelContext)
            }
        } else {
            errorMessage = nil
            speechService.startRecording()
        }
    }

    private func processTranscript(_ text: String, modelContext: ModelContext) {
        guard let claudeService else {
            errorMessage = "API key not configured. Add ANTHROPIC_API_KEY to Info.plist."
            return
        }

        isProcessing = true
        errorMessage = nil

        Task { @MainActor in
            do {
                let extracted = try await claudeService.extractTasks(from: text)

                for task in extracted {
                    let category = TaskCategory(rawValue: task.category) ?? .personal
                    let priority = TaskPriority(rawValue: task.priority) ?? .medium

                    let item = TaskItem(
                        title: task.title,
                        category: category,
                        priority: priority,
                        timeSensitive: task.timeSensitive
                    )
                    modelContext.insert(item)
                }

                try modelContext.save()
                speechService.transcript = ""
                updateLiveActivity(modelContext: modelContext)
            } catch {
                errorMessage = error.localizedDescription
            }

            isProcessing = false
        }
    }

    func toggleTask(_ task: TaskItem, modelContext: ModelContext) {
        task.completed.toggle()
        try? modelContext.save()
        updateLiveActivity(modelContext: modelContext)
    }

    func clearCompleted(tasks: [TaskItem], modelContext: ModelContext) {
        for task in tasks where task.completed {
            modelContext.delete(task)
        }
        try? modelContext.save()
        updateLiveActivity(modelContext: modelContext)
    }

    // MARK: - Live Activity

    func toggleLiveActivity(tasks: [TaskItem]) {
        if liveActivityService.isRunning {
            liveActivityService.endActivity()
        } else {
            let incomplete = tasks.filter { !$0.completed }
            let top = incomplete
                .sorted { $0.priority.sortOrder < $1.priority.sortOrder }
                .first

            liveActivityService.startActivity(
                totalTasks: tasks.count,
                completedTasks: tasks.filter(\.completed).count,
                topTask: top?.title,
                topTaskCategory: top?.category.rawValue
            )
        }
    }

    var isLiveActivityRunning: Bool {
        liveActivityService.isRunning
    }

    private func updateLiveActivity(modelContext: ModelContext) {
        guard liveActivityService.isRunning else { return }

        let descriptor = FetchDescriptor<TaskItem>()
        guard let tasks = try? modelContext.fetch(descriptor) else { return }

        let incomplete = tasks.filter { !$0.completed }
        let top = incomplete
            .sorted { $0.priority.sortOrder < $1.priority.sortOrder }
            .first

        liveActivityService.updateActivity(
            totalTasks: tasks.count,
            completedTasks: tasks.filter(\.completed).count,
            topTask: top?.title,
            topTaskCategory: top?.category.rawValue
        )
    }
}
