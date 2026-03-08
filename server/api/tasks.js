import { prisma } from "~/server/utils/db";
import { sendWhatsAppMessage } from "~/server/utils/whatsapp";

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const query = getQuery(event);
    const studentId = query.studentId;
    const docenteId = query.docenteId;

    const where = {};
    if (docenteId) where.createdById = String(docenteId);

    return prisma.task.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        assignments: {
          include: {
            student: { select: { id: true, name: true, email: true, role: true, phone: true } }
          },
          where: studentId ? { studentId: String(studentId) } : undefined
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  if (event.method === "POST") {
    const data = await readBody(event);
    const { title, description, dueDate, createdById, studentIds } = data;

    if (!title || !description || !createdById || !Array.isArray(studentIds)) {
      throw createError({ statusCode: 400, statusMessage: "Faltan campos obligatorios" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById,
        assignments: {
          create: studentIds.map((studentId) => ({ studentId }))
        }
      },
      include: {
        assignments: {
          include: { student: true }
        }
      }
    });

    await Promise.all(
      task.assignments
        .filter((assignment) => assignment.student.phone)
        .map((assignment) =>
          sendWhatsAppMessage({
            to: assignment.student.phone,
            body: `Nueva tÁrea: ${task.title}. Fecha límite: ${dueDate || "sin fecha"}.`
          })
        )
    );

    setResponseStatus(event, 201);
    return task;
  }

  throw createError({ statusCode: 405, statusMessage: "Método no permitido" });
});


