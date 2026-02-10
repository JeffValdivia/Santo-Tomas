"use client";

import { useRouter } from "next/navigation";

export default function ThesisLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="thesis-shell">
      <aside className="thesis-sidebar">
        <h4>Menu Tesis</h4>
        <nav className="thesis-menu">
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/logro">Niveles de Logro por Área</a>
          <a href="/dashboard/tardanzas">Tardanzas</a>
          <a href="/dashboard/inasistencias">Inasistencias</a>
          <a href="/dashboard/riesgo">Estudiantes en Riesgo</a>
          <a href="/dashboard/indicadores">Indicadores Académicos</a>
          <a href="/dashboard/seguimiento">Seguimiento y Alertas</a>
          <button type="button" className="thesis-menu-button thesis-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </nav>
      </aside>
      <div className="dashboard-shell">{children}</div>
    </div>
  );
}
