import { prisma } from "~/server/utils/db";
import { hashPassword } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  if (event.method === "POST") {
    const data = await readBody(event);
    const { name, email, role, phone, password } = data;

    if (!name || !email || !role || !password) {
      throw createError({ statusCode: 400, statusMessage: "Faltan campos obligatorios" });
    }

    const passwordHash = await hashPassword(password);

    setResponseStatus(event, 201);
    return prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash,
        phone: phone || null
      }
    });
  }

  throw createError({ statusCode: 405, statusMessage: "Método no permitido" });
});


