import SwiftUI
import SwiftData

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \TaskItem.createdAt, order: .reverse) private var tasks: [TaskItem]
    @State private var viewModel = BrainDumpViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                HeaderView()

                RecordButtonView(
                    isRecording: viewModel.speechService.isRecording,
                    isProcessing: viewModel.isProcessing,
                    onTap: { viewModel.toggleRecording(modelContext: modelContext) }
                )

                if !viewModel.speechService.transcript.isEmpty || viewModel.speechService.isRecording {
                    TranscriptView(
                        transcript: viewModel.speechService.transcript,
                        isRecording: viewModel.speechService.isRecording
                    )
                }

                if let error = viewModel.errorMessage ?? viewModel.speechService.errorMessage {
                    ErrorBanner(message: error)
                }

                if !tasks.isEmpty {
                    Divider()
                        .padding(.horizontal)

                    TaskListView(
                        tasks: tasks,
                        onToggle: { task in viewModel.toggleTask(task, modelContext: modelContext) },
                        onClearCompleted: { viewModel.clearCompleted(tasks: tasks, modelContext: modelContext) },
                        onToggleLiveActivity: { viewModel.toggleLiveActivity(tasks: tasks) },
                        isLiveActivityRunning: viewModel.isLiveActivityRunning
                    )
                } else if !viewModel.speechService.isRecording && !viewModel.isProcessing {
                    EmptyStateView()
                }
            }
            .padding(.bottom, 40)
        }
        .background(Color.warmBackground)
        .onAppear {
            viewModel.requestPermissions()
        }
    }
}

#Preview {
    ContentView()
        .modelContainer(for: TaskItem.self, inMemory: true)
}
