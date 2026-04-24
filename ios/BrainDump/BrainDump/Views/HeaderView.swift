import SwiftUI

struct HeaderView: View {
    var body: some View {
        VStack(spacing: 4) {
            Text("Brain Dump")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundStyle(Color.sage800)

            Text("Speak your mind, get organised")
                .font(.subheadline)
                .foregroundStyle(Color.sage400)
        }
        .padding(.top, 48)
        .padding(.bottom, 8)
    }
}
