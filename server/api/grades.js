import { prisma } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const query = getQuery(event);
    const studentId = query.studentId;

    return prisma.grade.findMany({
      where: studentId ? { studentId: String(studentId) } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        task: true
      }
    });
  }

  if (event.method === "POST") {
    const data = await readBody(event);
    const { studentId, createdById, score, comment, taskId } = data;

    if (!studentId || !createdById || score === undefined) {
      throw createError({ statusCode: 400, statusMessage: "Faltan campos obligatorios" });
    }

    setResponseStatus(event, 201);
    return prisma.grade.create({
      data: {
        studentId,
        createdById,
        score: Number(score),
        comment: comment || null,
        taskId: taskId || null
      }
    });
  }

  throw createError({ statusCode: 405, statusMessage: "Método no permitido" });
});


