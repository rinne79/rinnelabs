import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json(
      { error: "Please provide some text to process" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured. Add ANTHROPIC_API_KEY to your .env.local file." },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a helpful assistant for a busy new mum. She just did a "brain dump" and spoke out everything on her mind. Your job is to extract individual tasks from her words.

For each task, provide:
- title: A clear, concise task description
- category: One of "Baby", "Household", "Personal", "Finance", "Health"
- priority: One of "High", "Medium", "Low"
- timeSensitive: If there's a deadline or urgency mentioned, include it as a short string (e.g. "Thursday", "ASAP", "This week", "Tomorrow"). If not time-sensitive, set to null.

Respond with ONLY valid JSON in this exact format, no other text:
{"tasks": [{"title": "...", "category": "...", "priority": "...", "timeSensitive": "..." or null}]}

Here is her brain dump:
"${text}"`,
      },
    ],
  });

  try {
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }
    const parsed = JSON.parse(content.text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response" },
      { status: 500 }
    );
  }
}
