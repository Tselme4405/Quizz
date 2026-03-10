import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in .env" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 },
      );
    }

    const prompt = `
Generate 5 multiple-choice quiz questions from the article below.

Return ONLY valid JSON.
Do not add explanation.
Do not add markdown.
Do not wrap the response in triple backticks.

Return exactly this format:
[
  {
    "question": "Question here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  }
]

Article:
${content}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError: any) {
      console.error("Quiz JSON parse error:", parseError);
      console.error("Raw AI response:", rawText);

      return NextResponse.json(
        {
          error: "AI did not return valid JSON",
          raw: rawText,
        },
        { status: 500 },
      );
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json(
        { error: "AI returned empty or invalid quiz array" },
        { status: 500 },
      );
    }

    return NextResponse.json({ result: parsed }, { status: 200 });
  } catch (err: any) {
    console.error("Generate quizzes error:", err);
    return NextResponse.json(
      {
        error: err?.message || "Failed to generate quizzes",
      },
      { status: 500 },
    );
  }
}
