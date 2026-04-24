import ActivityKit
import Foundation

final class LiveActivityService {
    private var currentActivity: Activity<BrainDumpAttributes>?

    var isRunning: Bool {
        currentActivity != nil
    }

    func startActivity(totalTasks: Int, completedTasks: Int, topTask: String?, topTaskCategory: String?) {
        guard ActivityAuthorizationInfo().areActivitiesEnabled else { return }

        let attributes = BrainDumpAttributes(sessionStarted: Date())
        let state = BrainDumpAttributes.ContentState(
            totalTasks: totalTasks,
            completedTasks: completedTasks,
            topTask: topTask,
            topTaskCategory: topTaskCategory
        )

        let content = ActivityContent(state: state, staleDate: nil)

        do {
            currentActivity = try Activity.request(
                attributes: attributes,
                content: content,
                pushType: nil
            )
        } catch {
            print("Failed to start Live Activity: \(error)")
        }
    }

    func updateActivity(totalTasks: Int, completedTasks: Int, topTask: String?, topTaskCategory: String?) {
        guard let activity = currentActivity else { return }

        let state = BrainDumpAttributes.ContentState(
            totalTasks: totalTasks,
            completedTasks: completedTasks,
            topTask: topTask,
            topTaskCategory: topTaskCategory
        )

        Task {
            await activity.update(ActivityContent(state: state, staleDate: nil))
        }
    }

    func endActivity() {
        guard let activity = currentActivity else { return }

        Task {
            await activity.end(nil, dismissalPolicy: .immediate)
        }
        currentActivity = nil
    }
}
