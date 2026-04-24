import ActivityKit
import Foundation

struct BrainDumpAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var totalTasks: Int
        var completedTasks: Int
        var topTask: String?
        var topTaskCategory: String?
    }

    var sessionStarted: Date
}
