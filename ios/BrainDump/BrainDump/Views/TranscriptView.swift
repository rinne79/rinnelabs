import SwiftUI

struct TranscriptView: View {
    let transcript: String
    let isRecording: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(isRecording ? "Hearing you..." : "You said:")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundStyle(Color.sage400)

            HStack(alignment: .bottom) {
                Text(transcript.isEmpty ? "Start speaking..." : transcript)
                    .foregroundStyle(transcript.isEmpty ? Color.sage300 : Color.sage800)
                    .italic(transcript.isEmpty)

                if isRecording {
                    Rectangle()
                        .fill(Color.sage400)
                        .frame(width: 2, height: 16)
                        .opacity(isRecording ? 1 : 0)
                        .animation(.easeInOut(duration: 0.6).repeatForever(), value: isRecording)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(.white.opacity(0.6))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.sage100, lineWidth: 1)
        )
        .padding(.horizontal)
    }
}
