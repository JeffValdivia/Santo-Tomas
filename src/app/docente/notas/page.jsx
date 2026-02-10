"use client";

import { useState } from "react";
import DocenteMenuLayout from "@/components/docente/DocenteMenuLayout";
import { useDocenteBaseData } from "@/components/docente/useDocenteData";

const initialGrade = { studentId: "", score: "", comment: "", taskId: "" };

export default function DocenteNotasPage() {
  const { docentes, students, tasks, docenteId, setDocenteId } = useDocenteBaseData();
  const [gradeForm, setGradeForm] = useState(initialGrade);
  const [status, setStatus] = useState("");

  const handleGradeSubmit = async (event) => {
    event.preventDefault();
    if (!docenteId) {
      setStatus("Selecciona un docente");
      return;
    }

    setStatus("Guardando nota...");
    const res = await fetch("/api/grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...gradeForm,
        createdById: docenteId,
      }),
    });

    if (!res.ok) {
      setStatus("Error al guardar nota");
      return;
    }

    setGradeForm(initialGrade);
    setStatus("Nota registrada");
  };

  return (
    <DocenteMenuLayout>
      <div className="grid cols-2">
        <section className="card">
        <h2>Registro de notas</h2>
        <p className="badge">Carga de calificaciones</p>

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
          <h3>Registrar nota</h3>
          <form className="grid" onSubmit={handleGradeSubmit}>
            <select
              className="select"
              value={gradeForm.studentId}
              onChange={(event) => setGradeForm({ ...gradeForm, studentId: event.target.value })}
              required
            >
              <option value="">Alumno</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="number"
              min="0"
              max="20"
              placeholder="Nota"
              value={gradeForm.score}
              onChange={(event) => setGradeForm({ ...gradeForm, score: event.target.value })}
              required
            />
            <select
              className="select"
              value={gradeForm.taskId}
              onChange={(event) => setGradeForm({ ...gradeForm, taskId: event.target.value })}
            >
              <option value="">Sin tarea asociada</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
            <textarea
              className="textarea"
              placeholder="Comentario"
              value={gradeForm.comment}
              onChange={(event) => setGradeForm({ ...gradeForm, comment: event.target.value })}
            />
            <button className="button" type="submit">Guardar nota</button>
          </form>
          {status ? <p style={{ color: "var(--muted)", marginTop: 8 }}>{status}</p> : null}
        </div>
        </section>
      </div>
    </DocenteMenuLayout>
  );
}
