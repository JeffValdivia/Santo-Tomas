import "./globals.css";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/jwt";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
  title: "Sistema de Monitoreo Académico",
  description: "Registro de alumnos, notas, comentarios y tareas con notificaciones WhatsApp.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("st_token")?.value;
  let role = null;
  let userName = null;

  if (token) {
    try {
      const payload = await verifyAuthToken(token);
      role = payload.role;
      userName = payload.name;
    } catch (error) {
      role = null;
    }
  }

  return (
    <html lang="es">
      <body>
        <header className="header">
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="title">Santo Tomas | Monitoreo Académico</div>
          </div>
        </header>
        <main>
          <div className="container">
            {role ? (
              <p className="muted" style={{ marginTop: 0 }}>
                Sesion activa: {userName} ({role})
              </p>
            ) : null}
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
