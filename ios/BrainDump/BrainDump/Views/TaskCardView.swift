import SwiftUI

struct TaskCardView: View {
    let task: TaskItem
    let onToggle: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Button(action: onToggle) {
                Circle()
                    .strokeBorder(task.completed ? Color.sage400 : Color.sage300, lineWidth: 2)
                    .background(
                        Circle().fill(task.completed ? Color.sage400 : .clear)
                    )
                    .overlay(
                        task.completed
                            ? Image(systemName: "checkmark")
                                .font(.caption2)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            : nil
                    )
                    .frame(width: 24, height: 24)
            }
            .padding(.top, 2)

            VStack(alignment: .leading, spacing: 8) {
                Text(task.title)
                    .fontWeight(.medium)
                    .foregroundStyle(task.completed ? Color.sage400 : Color.sage800)
                    .strikethrough(task.completed)

                HStack(spacing: 6) {
                    CategoryBadge(category: task.category)
                    PriorityBadge(priority: task.priority)

                    if let time = task.timeSensitive {
                        TimeBadge(text: time)
                    }
                }
            }
        }
        .padding()
        .background(task.completed ? Color.warm100.opacity(0.5) : .white.opacity(0.7))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            task.completed
                ? nil
                : RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.sage100, lineWidth: 1)
        )
        .opacity(task.completed ? 0.6 : 1)
    }
}

struct CategoryBadge: View {
    let category: TaskCategory

    var body: some View {
        Text(category.rawValue)
            .font(.caption2)
            .fontWeight(.medium)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(category.color)
            .clipShape(Capsule())
    }
}

struct PriorityBadge: View {
    let priority: TaskPriority

    var body: some View {
        Text(priority.rawValue)
            .font(.caption2)
            .fontWeight(.medium)
            .foregroundStyle(priority == .high ? .white : Color.sage800)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(priority.color)
            .clipShape(Capsule())
    }
}

struct TimeBadge: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.caption2)
            .fontWeight(.medium)
            .foregroundStyle(Color.sage700)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(Color.sage100)
            .clipShape(Capsule())
    }
}

extension TaskCategory {
    var color: Color {
        switch self {
        case .baby: return Color.roseSoft
        case .household: return Color.skySoft
        case .personal: return Color.lavenderSoft
        case .finance: return Color.amberSoft
        case .health: return Color.mintSoft
        }
    }
}

extension TaskPriority {
    var color: Color {
        switch self {
        case .high: return Color.sage600
        case .medium: return Color.sage300
        case .low: return Color.warm200
        }
    }
}
