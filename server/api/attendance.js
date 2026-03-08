import { prisma } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const query = getQuery(event);
    const studentId = query.studentId;
    const dateFrom = query.dateFrom;
    const dateTo = query.dateTo;

    const where = {};
    if (studentId) where.studentId = String(studentId);
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(String(dateFrom));
      if (dateTo) where.date.lte = new Date(String(dateTo));
    }

    return prisma.attendance.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        student: { select: { id: true, name: true } },
        recordedBy: { select: { id: true, name: true } }
      }
    });
  }

  if (event.method === "POST") {
    const data = await readBody(event);
    const { studentId, recordedById, status, date, note } = data;

    if (!studentId || !recordedById || !status || !date) {
      throw createError({ statusCode: 400, statusMessage: "Faltan campos obligatorios" });
    }

    setResponseStatus(event, 201);
    return prisma.attendance.create({
      data: {
        studentId,
        recordedById,
        status,
        date: new Date(date),
        note: note || null
      }
    });
  }

  throw createError({ statusCode: 405, statusMessage: "Método no permitido" });
});


