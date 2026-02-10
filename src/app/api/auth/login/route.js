import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { signAuthToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const demoUsers = [
      { email: "admin@santotomas.edu", password: "Admin123", role: "ADMIN", name: "Admin Principal" },
      { email: "docente@santotomas.edu", password: "Docente123", role: "DOCENTE", name: "Docente Principal" },
      { email: "alumno@santotomas.edu", password: "Alumno123", role: "ALUMNO", name: "Alumno Principal" },
    ];

    const demoMatch = demoUsers.find(
      (demoUser) => demoUser.email === email && demoUser.password === password
    );

    if (!demoMatch) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = await signAuthToken({
      sub: `demo-${demoMatch.role.toLowerCase()}`,
      role: demoMatch.role,
      name: demoMatch.name,
      email: demoMatch.email,
    });

    const response = NextResponse.json({
      id: `demo-${demoMatch.role.toLowerCase()}`,
      name: demoMatch.name,
      role: demoMatch.role,
    });

    response.cookies.set("st_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const token = await signAuthToken({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  const response = NextResponse.json({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  response.cookies.set("st_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
