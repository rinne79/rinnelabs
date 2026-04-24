import SwiftUI

struct TaskListView: View {
    let tasks: [TaskItem]
    let onToggle: (TaskItem) -> Void
    let onClearCompleted: () -> Void
    let onToggleLiveActivity: () -> Void
    let isLiveActivityRunning: Bool

    private var completedCount: Int { tasks.filter(\.completed).count }
    private var progress: Double {
        tasks.isEmpty ? 0 : Double(completedCount) / Double(tasks.count)
    }

    private var groupedTasks: [(TaskCategory, [TaskItem])] {
        let order: [TaskCategory] = [.baby, .health, .household, .finance, .personal]
        return order.compactMap { category in
            let categoryTasks = tasks
                .filter { $0.category == category }
                .sorted { a, b in
                    if a.completed != b.completed { return !a.completed }
                    return a.priority.sortOrder < b.priority.sortOrder
                }
            return categoryTasks.isEmpty ? nil : (category, categoryTasks)
        }
    }

    var body: some View {
        VStack(spacing: 16) {
            HStack {
                Text("\(completedCount) of \(tasks.count) done")
                    .font(.subheadline)
                    .foregroundStyle(Color.sage500)

                Spacer()

                Button(action: onToggleLiveActivity) {
                    Image(systemName: isLiveActivityRunning ? "pin.slash.fill" : "pin.fill")
                        .font(.subheadline)
                        .foregroundStyle(Color.sage400)
                }

                if completedCount > 0 {
                    Button("Clear completed", action: onClearCompleted)
                        .font(.subheadline)
                        .foregroundStyle(Color.sage400)
                }
            }
            .padding(.horizontal)

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(Color.warm200)
                        .frame(height: 6)

                    Capsule()
                        .fill(Color.sage400)
                        .frame(width: geometry.size.width * progress, height: 6)
                        .animation(.easeInOut(duration: 0.5), value: progress)
                }
            }
            .frame(height: 6)
            .padding(.horizontal)

            ForEach(groupedTasks, id: \.0) { category, categoryTasks in
                VStack(alignment: .leading, spacing: 8) {
                    Text(category.rawValue.uppercased())
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(Color.sage400)
                        .tracking(1)
                        .padding(.horizontal, 4)

                    ForEach(categoryTasks, id: \.id) { task in
                        TaskCardView(task: task) {
                            onToggle(task)
                        }
                    }
                }
                .padding(.horizontal)
            }
        }
    }
}
