"use client";

import { useEffect, useState } from "react";
import DocenteMenuLayout from "@/components/docente/DocenteMenuLayout";
import {
  fallbackStudents,
  shuffleList,
  useDocenteBaseData,
} from "@/components/docente/useDocenteData";

export default function DocenteConsolidadoPage() {
  const { docentes, students, docenteId, setDocenteId } = useDocenteBaseData();
  const [consolidatedAttendance, setConsolidatedAttendance] = useState([]);

  useEffect(() => {
    const sourceStudents = students.length ? students : fallbackStudents;
    const shuffled = shuffleList(sourceStudents);
    const sample = shuffled.slice(0, Math.min(10, shuffled.length));

    setConsolidatedAttendance(
      sample.map((student) => {
        const absences = Math.floor(Math.random() * 6);
        const lates = Math.floor(Math.random() * 4);
        const presents = 18 + Math.floor(Math.random() * 8);
        const total = absences + lates + presents;
        const attendancePercent = total ? Math.round((presents / total) * 100) : 0;
        return {
          id: student.id,
          name: student.name,
          absences,
          lates,
          presents,
          attendancePercent,
        };
      })
    );
  }, [students]);

  return (
    <DocenteMenuLayout>
      <div className="grid cols-2">
        <section className="card">
        <h2>Consolidado de asistencias</h2>
        <p className="badge">Inasistencias y métricas</p>

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

        <div className="card" style={{ padding: 16, marginTop: 16 }}>
          <h3>Resumen por alumno</h3>
          <div className="grid" style={{ gap: 8, marginTop: 8 }}>
            {consolidatedAttendance.map((item) => (
              <div key={item.id} className="card" style={{ padding: 12 }}>
                <strong>{item.name}</strong>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  Inasistencias: {item.absences} | Tardanzas: {item.lates} | Presentes: {item.presents}
                </div>
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 12 }}>Asistencia: {item.attendancePercent}%</div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      marginTop: 4,
                    }}
                  >
                    <div
                      style={{
                        width: `${item.attendancePercent}%`,
                        height: "100%",
                        background: "#16a34a",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            Datos ficticios generados para visualización.
          </p>
        </div>
        </section>
      </div>
    </DocenteMenuLayout>
  );
}
