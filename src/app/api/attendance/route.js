import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const where = {};
  if (studentId) where.studentId = studentId;
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) where.date.lte = new Date(dateTo);
  }

  const attendance = await prisma.attendance.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      student: { select: { id: true, name: true } },
      recordedBy: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(attendance);
}

export async function POST(request) {
  const data = await request.json();
  const { studentId, recordedById, status, date, note } = data;

  if (!studentId || !recordedById || !status || !date) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const attendance = await prisma.attendance.create({
    data: {
      studentId,
      recordedById,
      status,
      date: new Date(date),
      note: note || null,
    },
  });

  return NextResponse.json(attendance, { status: 201 });
}
