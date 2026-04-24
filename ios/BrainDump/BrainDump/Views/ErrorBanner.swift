import SwiftUI

struct ErrorBanner: View {
    let message: String

    var body: some View {
        Text(message)
            .font(.subheadline)
            .foregroundStyle(Color.sage700)
            .multilineTextAlignment(.center)
            .padding()
            .frame(maxWidth: .infinity)
            .background(Color.roseSoft.opacity(0.5))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .padding(.horizontal)
    }
}
