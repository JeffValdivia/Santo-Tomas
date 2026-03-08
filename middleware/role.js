const roleRoutes = {
  "/admin": "ADMIN",
  "/docente": "DOCENTE",
  "/alumno": "ALUMNO",
  "/directivo": "ADMIN",
  "/dashboard": "ADMIN"
};

export default defineNuxtRouteMiddleware(async (to) => {
  const matchedRoute = Object.keys(roleRoutes).find((route) => to.path.startsWith(route));
  if (!matchedRoute) {
    return;
  }

  try {
    const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;
    const res = await $fetch("/api/auth/me", { headers });
    const user = res.user;

    if (!user) {
      return navigateTo("/");
    }

    if (user.role !== roleRoutes[matchedRoute]) {
      return navigateTo("/");
    }
  } catch {
    return navigateTo("/");
  }
});
