import { NextResponse } from "next/server";
import { verifyAuthToken } from "./src/lib/jwt";

const roleRoutes = {
  "/admin": "ADMIN",
  "/docente": "DOCENTE",
  "/alumno": "ALUMNO",
  "/directivo": "ADMIN",
  "/dashboard": "ADMIN",
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const matchedRoute = Object.keys(roleRoutes).find((route) => pathname.startsWith(route));
  if (!matchedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("st_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = await verifyAuthToken(token);
    const requiredRole = roleRoutes[matchedRoute];

    if (payload.role !== requiredRole) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/docente/:path*", "/alumno/:path*", "/directivo/:path*", "/dashboard/:path*"],
};
