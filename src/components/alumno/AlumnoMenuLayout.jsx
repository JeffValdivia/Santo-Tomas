"use client";

import { useRouter } from "next/navigation";

export default function AlumnoMenuLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="thesis-shell">
      <aside className="thesis-sidebar">
        <h4>Menu Alumno</h4>
        <nav className="thesis-menu">
          <a href="/alumno">Panel Alumno</a>
          <a href="/alumno#tareas">Tareas asignadas</a>
          <a href="/alumno#notas">Notas y comentarios</a>
          <a href="/alumno#asistencia">Asistencia</a>
          <button type="button" className="thesis-menu-button thesis-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </nav>
      </aside>
      <div className="dashboard-shell">{children}</div>
    </div>
  );
}
