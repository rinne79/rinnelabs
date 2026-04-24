import Foundation

struct ExtractedTask: Codable {
    let title: String
    let category: String
    let priority: String
    let timeSensitive: String?
}

struct ExtractionResponse: Codable {
    let tasks: [ExtractedTask]
}

actor ClaudeService {
    private let apiKey: String

    init(apiKey: String) {
        self.apiKey = apiKey
    }

    func extractTasks(from text: String) async throws -> [ExtractedTask] {
        let url = URL(string: "https://api.anthropic.com/v1/messages")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "content-type")
        request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
        request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")

        let prompt = """
        You are a helpful assistant for a busy new mum. She just did a "brain dump" and spoke out everything on her mind. Your job is to extract individual tasks from her words.

        For each task, provide:
        - title: A clear, concise task description
        - category: One of "Baby", "Household", "Personal", "Finance", "Health"
        - priority: One of "High", "Medium", "Low"
        - timeSensitive: If there's a deadline or urgency mentioned, include it as a short string (e.g. "Thursday", "ASAP", "This week", "Tomorrow"). If not time-sensitive, set to null.

        Respond with ONLY valid JSON in this exact format, no other text:
        {"tasks": [{"title": "...", "category": "...", "priority": "...", "timeSensitive": "..." or null}]}

        Here is her brain dump:
        "\(text)"
        """

        let body: [String: Any] = [
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 1024,
            "messages": [
                ["role": "user", "content": prompt]
            ]
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
            throw ClaudeError.apiError(statusCode: statusCode)
        }

        let apiResponse = try JSONDecoder().decode(ClaudeAPIResponse.self, from: data)
        guard let textContent = apiResponse.content.first?.text else {
            throw ClaudeError.noContent
        }

        guard let jsonData = textContent.data(using: .utf8) else {
            throw ClaudeError.invalidJSON
        }

        let extraction = try JSONDecoder().decode(ExtractionResponse.self, from: jsonData)
        return extraction.tasks
    }
}

private struct ClaudeAPIResponse: Codable {
    let content: [ContentBlock]
}

private struct ContentBlock: Codable {
    let type: String
    let text: String?
}

enum ClaudeError: LocalizedError {
    case apiError(statusCode: Int)
    case noContent
    case invalidJSON

    var errorDescription: String? {
        switch self {
        case .apiError(let code):
            return "API request failed (status \(code))"
        case .noContent:
            return "No response from AI"
        case .invalidJSON:
            return "Failed to parse AI response"
        }
    }
}
