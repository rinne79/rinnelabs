import Foundation
import SwiftData

enum TaskCategory: String, Codable, CaseIterable {
    case baby = "Baby"
    case household = "Household"
    case personal = "Personal"
    case finance = "Finance"
    case health = "Health"
}

enum TaskPriority: String, Codable, CaseIterable {
    case high = "High"
    case medium = "Medium"
    case low = "Low"

    var sortOrder: Int {
        switch self {
        case .high: return 0
        case .medium: return 1
        case .low: return 2
        }
    }
}

@Model
final class TaskItem {
    var id: UUID
    var title: String
    var category: TaskCategory
    var priority: TaskPriority
    var timeSensitive: String?
    var completed: Bool
    var createdAt: Date

    init(
        title: String,
        category: TaskCategory,
        priority: TaskPriority,
        timeSensitive: String? = nil,
        completed: Bool = false
    ) {
        self.id = UUID()
        self.title = title
        self.category = category
        self.priority = priority
        self.timeSensitive = timeSensitive
        self.completed = completed
        self.createdAt = Date()
    }
}
