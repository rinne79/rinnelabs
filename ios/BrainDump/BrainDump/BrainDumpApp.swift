import SwiftUI
import SwiftData

@main
struct BrainDumpApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: TaskItem.self)
    }
}
