import ActivityKit
import SwiftUI
import WidgetKit

struct BrainDumpWidgetsLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: BrainDumpAttributes.self) { context in
            // Lock Screen banner
            LockScreenView(state: context.state)
                .padding()
                .activityBackgroundTint(Color(red: 0.965, green: 0.969, blue: 0.961))
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Label(
                        "\(context.state.completedTasks)/\(context.state.totalTasks)",
                        systemImage: "checkmark.circle.fill"
                    )
                    .font(.caption)
                    .foregroundStyle(Color(red: 0.420, green: 0.490, blue: 0.369))
                }
                DynamicIslandExpandedRegion(.trailing) {
                    if let category = context.state.topTaskCategory {
                        Text(category)
                            .font(.caption2)
                            .fontWeight(.medium)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(Color(red: 0.910, green: 0.922, blue: 0.898))
                            .clipShape(Capsule())
                    }
                }
                DynamicIslandExpandedRegion(.bottom) {
                    if let topTask = context.state.topTask {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Next up")
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                            Text(topTask)
                                .font(.subheadline)
                                .fontWeight(.medium)
                                .lineLimit(2)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                    } else {
                        Text("All done!")
                            .font(.subheadline)
                            .fontWeight(.medium)
                    }
                }
            } compactLeading: {
                Image(systemName: "brain.head.profile")
                    .foregroundStyle(Color(red: 0.420, green: 0.490, blue: 0.369))
            } compactTrailing: {
                Text("\(context.state.completedTasks)/\(context.state.totalTasks)")
                    .font(.caption2)
                    .fontWeight(.medium)
                    .foregroundStyle(Color(red: 0.420, green: 0.490, blue: 0.369))
            } minimal: {
                Image(systemName: "brain.head.profile")
                    .foregroundStyle(Color(red: 0.420, green: 0.490, blue: 0.369))
            }
        }
    }
}

struct LockScreenView: View {
    let state: BrainDumpAttributes.ContentState

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: "brain.head.profile")
                    .foregroundStyle(Color(red: 0.420, green: 0.490, blue: 0.369))
                Text("Brain Dump")
                    .font(.subheadline)
                    .fontWeight(.semibold)

                Spacer()

                Text("\(state.completedTasks) of \(state.totalTasks) done")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            // Progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(Color(red: 0.886, green: 0.875, blue: 0.847))
                        .frame(height: 4)

                    Capsule()
                        .fill(Color(red: 0.420, green: 0.490, blue: 0.369))
                        .frame(
                            width: state.totalTasks > 0
                                ? geometry.size.width * Double(state.completedTasks) / Double(state.totalTasks)
                                : 0,
                            height: 4
                        )
                }
            }
            .frame(height: 4)

            if let topTask = state.topTask {
                HStack(spacing: 6) {
                    Text("Next:")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text(topTask)
                        .font(.caption)
                        .fontWeight(.medium)
                        .lineLimit(1)
                }
            }
        }
    }
}
