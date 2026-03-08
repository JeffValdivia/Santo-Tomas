import { prisma } from "~/server/utils/db";
import { verifyAuthToken } from "~/server/utils/jwt";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "st_token");
  if (!token) {
    return { user: null };
  }

  try {
    const payload = await verifyAuthToken(token);
    if (String(payload.sub).startsWith("demo-")) {
      return {
        user: {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role
        }
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true }
    });

    return { user };
  } catch {
    return { user: null };
  }
});


