import SwiftUI

struct RecordButtonView: View {
    let isRecording: Bool
    let isProcessing: Bool
    let onTap: () -> Void

    @State private var pulseScale: CGFloat = 1.0

    var body: some View {
        VStack(spacing: 16) {
            ZStack {
                if isRecording {
                    Circle()
                        .fill(Color.sage400.opacity(0.2))
                        .frame(width: 120, height: 120)
                        .scaleEffect(pulseScale)
                        .opacity(2 - Double(pulseScale))
                        .onAppear {
                            withAnimation(.easeOut(duration: 1.5).repeatForever(autoreverses: false)) {
                                pulseScale = 1.5
                            }
                        }
                        .onDisappear {
                            pulseScale = 1.0
                        }
                }

                Button(action: onTap) {
                    ZStack {
                        Circle()
                            .fill(buttonColor)
                            .frame(width: 96, height: 96)
                            .shadow(color: isRecording ? Color.sage500.opacity(0.3) : .clear, radius: 12)

                        if isProcessing {
                            ProgressView()
                                .tint(.white)
                                .scaleEffect(1.2)
                        } else if isRecording {
                            Image(systemName: "stop.fill")
                                .font(.title)
                                .foregroundStyle(.white)
                        } else {
                            Image(systemName: "mic.fill")
                                .font(.title)
                                .foregroundStyle(.white)
                        }
                    }
                }
                .disabled(isProcessing)
                .scaleEffect(isRecording ? 1.05 : 1.0)
                .animation(.easeInOut(duration: 0.2), value: isRecording)
            }

            Text(statusText)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundStyle(Color.sage500)
        }
    }

    private var buttonColor: Color {
        if isProcessing {
            return Color.warm300
        } else if isRecording {
            return Color.sage500
        } else {
            return Color.sage400
        }
    }

    private var statusText: String {
        if isProcessing {
            return "Organising your thoughts..."
        } else if isRecording {
            return "Listening... tap to stop"
        } else {
            return "Tap to brain dump"
        }
    }
}
