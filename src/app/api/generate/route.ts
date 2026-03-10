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
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please provide a concise summary of the following article: ${content}`,
    });

    return NextResponse.json({ result: response.text });
  } catch (err: any) {
    console.error("GENERATE ERROR FULL:", err);
    console.error("GENERATE ERROR MESSAGE:", err?.message);
    console.error("GENERATE ERROR STATUS:", err?.status);
    console.error("GENERATE ERROR STACK:", err?.stack);
    console.error("GENERATE ERROR RAW:", JSON.stringify(err, null, 2));

    return NextResponse.json(
      {
        error: err?.message || err?.statusText || "Failed to generate summary",
        status: err?.status || 500,
      },
      { status: err?.status || 500 },
    );
  }
}
