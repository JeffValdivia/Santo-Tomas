import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const students = await prisma.user.findMany({
    where: { role: "ALUMNO" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(students);
}
