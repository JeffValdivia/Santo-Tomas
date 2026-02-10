"use client";

import { useRouter } from "next/navigation";

export default function DocenteMenuLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="thesis-shell">
      <aside className="thesis-sidebar">
        <h4>Menu Docente</h4>
        <nav className="thesis-menu">
          <a href="/docente">Panel Docente</a>
          <a href="/docente/notas">Registro de notas</a>
          <a href="/docente/asistencia">Registrar asistencia</a>
          <a href="/docente/consolidado">Consolidado de asistencias</a>
          <a href="/docente/reporte">Reporte de tareas</a>
          <button type="button" className="thesis-menu-button thesis-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </nav>
      </aside>
      <div className="dashboard-shell">{children}</div>
    </div>
  );
}
