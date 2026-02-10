import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth.js";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword("Admin123");
  const docentePassword = await hashPassword("Docente123");
  const alumnoPassword = await hashPassword("Alumno123");

  await prisma.user.upsert({
    where: { email: "admin@santotomas.edu" },
    update: {},
    create: {
      name: "Admin Principal",
      email: "admin@santotomas.edu",
      role: "ADMIN",
      phone: "+51911111111",
      passwordHash: adminPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "docente@santotomas.edu" },
    update: {},
    create: {
      name: "Docente Principal",
      email: "docente@santotomas.edu",
      role: "DOCENTE",
      phone: "+51922222222",
      passwordHash: docentePassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "alumno@santotomas.edu" },
    update: {},
    create: {
      name: "Alumno Principal",
      email: "alumno@santotomas.edu",
      role: "ALUMNO",
      phone: "+51933333333",
      passwordHash: alumnoPassword,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
