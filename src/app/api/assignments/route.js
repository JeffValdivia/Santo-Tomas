import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const taskId = searchParams.get("taskId");

  const where = {};
  if (studentId) where.studentId = studentId;
  if (taskId) where.taskId = taskId;

  const assignments = await prisma.taskAssignment.findMany({
    where,
    orderBy: { assignedAt: "desc" },
    include: {
      student: { select: { id: true, name: true } },
      task: { select: { id: true, title: true } },
    },
  });

  return NextResponse.json(assignments);
}

export async function PATCH(request) {
  const data = await request.json();
  const { id, completed } = data;

  if (!id) {
    return NextResponse.json({ error: "Falta el id de la asignacion" }, { status: 400 });
  }

  const assignment = await prisma.taskAssignment.update({
    where: { id },
    data: { completedAt: completed ? new Date() : null },
  });

  return NextResponse.json(assignment);
}
