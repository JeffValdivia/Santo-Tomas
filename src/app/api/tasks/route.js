import { prisma } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const docenteId = searchParams.get("docenteId");

  const where = {};
  if (docenteId) {
    where.createdById = docenteId;
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      assignments: {
        include: {
          student: {
            select: { id: true, name: true, email: true, role: true, phone: true },
          },
        },
        where: studentId ? { studentId } : undefined,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(request) {
  const data = await request.json();
  const { title, description, dueDate, createdById, studentIds } = data;

  if (!title || !description || !createdById || !Array.isArray(studentIds)) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdById,
      assignments: {
        create: studentIds.map((studentId) => ({ studentId })),
      },
    },
    include: {
      assignments: {
        include: { student: true },
      },
    },
  });

  await Promise.all(
    task.assignments
      .filter((assignment) => assignment.student.phone)
      .map((assignment) =>
        sendWhatsAppMessage({
          to: assignment.student.phone,
          body: `Nueva tarea: ${task.title}. Fecha límite: ${dueDate || "sin fecha"}.`,
        })
      )
  );

  return NextResponse.json(task, { status: 201 });
}
