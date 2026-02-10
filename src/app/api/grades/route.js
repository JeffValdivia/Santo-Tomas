import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  const grades = await prisma.grade.findMany({
    where: studentId ? { studentId } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      task: true,
    },
  });

  return NextResponse.json(grades);
}

export async function POST(request) {
  const data = await request.json();
  const { studentId, createdById, score, comment, taskId } = data;

  if (!studentId || !createdById || score === undefined) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const grade = await prisma.grade.create({
    data: {
      studentId,
      createdById,
      score: Number(score),
      comment: comment || null,
      taskId: taskId || null,
    },
  });

  return NextResponse.json(grade, { status: 201 });
}
