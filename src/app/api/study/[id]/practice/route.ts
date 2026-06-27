import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPracticeQuestions } from "@/lib/practice-questions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const topic = await prisma.studyTopic.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  const questions = getPracticeQuestions(topic.name);
  const progress = await prisma.studyPracticeProgress.findMany({
    where: { userId: session.user.id, studyTopicId: topic.id },
    select: { questionId: true, completedAt: true },
  });
  const completedIds = new Set(progress.map((item) => item.questionId));
  const completedCount = questions.filter((question) => completedIds.has(question.id)).length;
  const nextStatus =
    completedCount === 0
      ? "not_started"
      : completedCount >= questions.length
        ? "completed"
        : "in_progress";

  if (topic.status !== nextStatus) {
    await prisma.studyTopic.update({
      where: { id: topic.id },
      data: { status: nextStatus },
    });
  }

  return NextResponse.json({
    topic: { ...topic, status: nextStatus },
    completedCount,
    totalQuestions: questions.length,
    progressPercent: Math.round((completedCount / questions.length) * 100),
    questions: questions.map((question) => ({
      ...question,
      completed: completedIds.has(question.id),
    })),
  });
}
