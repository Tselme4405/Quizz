import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { articleId: string } },
) {
  try {
    const { articleId } = params;

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { quizzes: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ article }, { status: 200 });
  } catch (err: any) {
    console.error("Article get error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "failed to get article" },
      { status: 500 },
    );
  }
}
