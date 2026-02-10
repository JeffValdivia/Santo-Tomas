import { prisma } from "@/lib/db";
import { verifyAuthToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(request) {
  const token = request.cookies.get("st_token")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const payload = await verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
