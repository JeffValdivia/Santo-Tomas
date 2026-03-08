import { prisma } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const query = getQuery(event);
    const studentId = query.studentId;
    const taskId = query.taskId;

    const where = {};
    if (studentId) where.studentId = String(studentId);
    if (taskId) where.taskId = String(taskId);

    return prisma.taskAssignment.findMany({
      where,
      orderBy: { assignedAt: "desc" },
      include: {
        student: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } }
      }
    });
  }

  if (event.method === "PATCH") {
    const data = await readBody(event);
    const { id, completed } = data;

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: "Falta el id de la asignacion" });
    }

    return prisma.taskAssignment.update({
      where: { id },
      data: { completedAt: completed ? new Date() : null }
    });
  }

  throw createError({ statusCode: 405, statusMessage: "Método no permitido" });
});


