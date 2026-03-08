import { prisma } from "~/server/utils/db";

export default defineEventHandler(async () => {
  return prisma.user.findMany({
    where: { role: "ALUMNO" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true
    },
    orderBy: { name: "asc" }
  });
});


