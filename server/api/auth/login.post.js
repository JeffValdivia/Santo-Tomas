import { prisma } from "~/server/utils/db";
import { verifyPassword } from "~/server/utils/auth";
import { signAuthToken } from "~/server/utils/jwt";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Faltan credenciales" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const demoUsers = [
      { email: "admin@santotomas.edu", password: "Admin123", role: "ADMIN", name: "Admin Principal" },
      { email: "docente@santotomas.edu", password: "Docente123", role: "DOCENTE", name: "Docente Principal" },
      { email: "alumno@santotomas.edu", password: "Alumno123", role: "ALUMNO", name: "Alumno Principal" }
    ];

    const demoMatch = demoUsers.find((demoUser) => demoUser.email === email && demoUser.password === password);
    if (!demoMatch) {
      throw createError({ statusCode: 401, statusMessage: "Credenciales inválidas" });
    }

    const token = await signAuthToken({
      sub: `demo-${demoMatch.role.toLowerCase()}`,
      role: demoMatch.role,
      name: demoMatch.name,
      email: demoMatch.email
    });

    setCookie(event, "st_token", token, { httpOnly: true, sameSite: "lax", path: "/" });

    return {
      id: `demo-${demoMatch.role.toLowerCase()}`,
      name: demoMatch.name,
      role: demoMatch.role
    };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: "Credenciales inválidas" });
  }

  const token = await signAuthToken({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email
  });

  setCookie(event, "st_token", token, { httpOnly: true, sameSite: "lax", path: "/" });

  return {
    id: user.id,
    name: user.name,
    role: user.role
  };
});


