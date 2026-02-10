"use client";

import DocenteMenuLayout from "@/components/docente/DocenteMenuLayout";
import { useDocenteBaseData } from "@/components/docente/useDocenteData";

export default function DocentePage() {
  const { docentes, docenteId, setDocenteId } = useDocenteBaseData();
  const selectedIndex = docentes.findIndex((docente) => docente.id === docenteId);
  const courseCatalog = [
    { name: "Matemática", grade: "1°", section: "A", students: 28, attendance: 92, pendingTasks: 3 },
    { name: "Comunicación", grade: "2°", section: "B", students: 26, attendance: 88, pendingTasks: 5 },
    { name: "C. Sociales", grade: "3°", section: "A", students: 30, attendance: 90, pendingTasks: 2 },
    { name: "Ciencia y Tecnología", grade: "4°", section: "C", students: 27, attendance: 85, pendingTasks: 4 },
  ];
  const courseInfo =
    selectedIndex >= 0 ? courseCatalog[selectedIndex % courseCatalog.length] : courseCatalog[0];

  return (
    <DocenteMenuLayout>
      <div className="grid cols-2">
        <section className="card">
          <h2>Dashboard Docente</h2>
          <p className="badge">Curso asignado</p>
          <label style={{ display: "block", marginTop: 12 }}>
            Docente activo
            <select
              className="select"
              value={docenteId}
              onChange={(event) => setDocenteId(event.target.value)}
            >
              <option value="">Selecciona docente</option>
              {docentes.map((docente) => (
                <option key={docente.id} value={docente.id}>
                  {docente.name}
                </option>
              ))}
            </select>
          </label>
          <div className="card" style={{ padding: 16, marginTop: 12 }}>
            <strong>{courseInfo.name}</strong>
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>
              Grado: {courseInfo.grade} | Sección: {courseInfo.section}
            </div>
            <div className="grid cols-2" style={{ marginTop: 12, gap: 12 }}>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Alumnos</div>
                <strong style={{ fontSize: 20 }}>{courseInfo.students}</strong>
              </div>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Asistencia</div>
                <strong style={{ fontSize: 20 }}>{courseInfo.attendance}%</strong>
              </div>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Tareas pendientes</div>
                <strong style={{ fontSize: 20 }}>{courseInfo.pendingTasks}</strong>
              </div>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Docente</div>
                <strong style={{ fontSize: 14 }}>
                  {docenteId ? docentes.find((docente) => docente.id === docenteId)?.name : "Selecciona docente"}
                </strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocenteMenuLayout>
  );
}
