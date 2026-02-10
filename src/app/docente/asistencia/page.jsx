"use client";

import { useEffect, useState } from "react";
import DocenteMenuLayout from "@/components/docente/DocenteMenuLayout";
import {
  fallbackStudents,
  shuffleList,
  useDocenteBaseData,
} from "@/components/docente/useDocenteData";

export default function DocenteAsistenciaPage() {
  const { docentes, students, docenteId, setDocenteId, hasRealStudents } = useDocenteBaseData();
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState("");

  useEffect(() => {
    const sourceStudents = students.length ? students : fallbackStudents;
    const shuffled = shuffleList(sourceStudents);
    const sample = shuffled.slice(0, Math.min(8, shuffled.length));

    setAttendanceList(
      sample.map((student) => ({
        id: student.id,
        name: student.name,
        present: Math.random() > 0.2,
      }))
    );
  }, [students]);

  const toggleAttendance = (studentId) => {
    setAttendanceList((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, present: !student.present } : student
      )
    );
  };

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault();
    if (!docenteId) {
      setAttendanceStatus("Selecciona un docente");
      return;
    }
    if (!attendanceDate) {
      setAttendanceStatus("Selecciona una fecha");
      return;
    }

    if (!hasRealStudents) {
      setAttendanceStatus("Datos ficticios: asistencia simulada");
      return;
    }

    setAttendanceStatus("Registrando asistencia...");
    try {
      await Promise.all(
        attendanceList.map((student) =>
          fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId: student.id,
              recordedById: docenteId,
              status: student.present ? "PRESENT" : "ABSENT",
              date: attendanceDate,
              note: "",
            }),
          })
        )
      );
      setAttendanceStatus(`Asistencia registrada para ${attendanceList.length} alumnos`);
    } catch (error) {
      setAttendanceStatus("Error al registrar asistencia");
    }
  };

  const attendancePresentCount = attendanceList.filter((student) => student.present).length;

  return (
    <DocenteMenuLayout>
      <div className="grid cols-2">
        <section className="card">
        <h2>Registrar asistencia</h2>
        <p className="badge">Lista aleatoria con checks</p>

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
          <h3>Lista de asistencia</h3>
          <form className="grid" onSubmit={handleAttendanceSubmit}>
            <input
              className="input"
              type="date"
              value={attendanceDate}
              onChange={(event) => setAttendanceDate(event.target.value)}
              required
            />
            <div>
              <strong>Lista aleatoria de alumnos</strong>
              <div className="grid" style={{ marginTop: 8 }}>
                {attendanceList.map((student) => (
                  <label key={student.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={student.present}
                      onChange={() => toggleAttendance(student.id)}
                    />
                    <span>{student.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                      {student.present ? "Presente" : "Inasistente"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Marcados presentes: {attendancePresentCount} de {attendanceList.length}
            </div>
            <button className="button" type="submit">Guardar asistencia</button>
            {attendanceStatus ? <span style={{ color: "var(--muted)" }}>{attendanceStatus}</span> : null}
          </form>
        </div>
        </section>
      </div>
    </DocenteMenuLayout>
  );
}
