import SwiftUI

struct EmptyStateView: View {
    @State private var bouncing = false

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "mic.fill")
                .font(.system(size: 40))
                .foregroundStyle(Color.sage300)
                .offset(y: bouncing ? -4 : 0)
                .animation(.easeInOut(duration: 2).repeatForever(), value: bouncing)
                .onAppear { bouncing = true }

            Text("Tap the button and tell me\neverything on your mind.\nI'll sort it out for you.")
                .font(.subheadline)
                .foregroundStyle(Color.sage400)
                .multilineTextAlignment(.center)
                .lineSpacing(4)
        }
        .padding(.top, 48)
    }
}
