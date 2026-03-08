export default defineEventHandler(async (event) => {
  setCookie(event, "st_token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return { ok: true };
});


