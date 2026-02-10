"use client";

import { useEffect, useState } from "react";
import DocenteMenuLayout from "@/components/docente/DocenteMenuLayout";
import {
  fallbackStudents,
  shuffleList,
  useDocenteBaseData,
} from "@/components/docente/useDocenteData";

const initialTask = { title: "", description: "", dueDate: "", studentIds: [] };

export default function DocenteReportePage() {
  const { docentes, students, tasks, docenteId, setDocenteId, refreshTasks } = useDocenteBaseData();
  const [taskForm, setTaskForm] = useState(initialTask);
  const [status, setStatus] = useState("");
  const [taskReport, setTaskReport] = useState([]);

  useEffect(() => {
    const sourceStudents = students.length ? students : fallbackStudents;
    const shuffled = shuffleList(sourceStudents);
    const sample = shuffled.slice(0, Math.min(10, shuffled.length));
    const totalTasks = 8;

    setTaskReport(
      sample.map((student) => {
        const submitted = Math.floor(Math.random() * (totalTasks + 1));
        const percent = Math.round((submitted / totalTasks) * 100);
        return {
          id: student.id,
          name: student.name,
          submitted,
          total: totalTasks,
          percent,
        };
      })
    );
  }, [students]);

  const toggleStudent = (studentId) => {
    setTaskForm((prev) => {
      const exists = prev.studentIds.includes(studentId);
      return {
        ...prev,
        studentIds: exists
          ? prev.studentIds.filter((id) => id !== studentId)
          : [...prev.studentIds, studentId],
      };
    });
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    if (!docenteId) {
      setStatus("Selecciona un docente");
      return;
    }

    setStatus("Creando tarea...");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...taskForm,
        createdById: docenteId,
      }),
    });

    if (!res.ok) {
      setStatus("Error al crear tarea");
      return;
    }

    setTaskForm(initialTask);
    setStatus("Tarea creada y notificada");
    refreshTasks(docenteId);
  };

  const taskAverage = taskReport.length
    ? Math.round(taskReport.reduce((sum, item) => sum + item.percent, 0) / taskReport.length)
    : 0;
  const taskHigh = taskReport.filter((item) => item.percent >= 80).length;
  const taskLow = taskReport.filter((item) => item.percent < 50).length;

  return (
    <DocenteMenuLayout>
      <div className="grid cols-2">
        <section className="card">
        <h2>Reporte de tareas</h2>
        <p className="badge">Entregas y gráficos</p>

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

        <div className="grid" style={{ marginTop: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <h3>Crear tarea</h3>
            <form className="grid" onSubmit={handleTaskSubmit}>
              <input
                className="input"
                placeholder="Título"
                value={taskForm.title}
                onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                required
              />
              <textarea
                className="textarea"
                placeholder="Descripción"
                value={taskForm.description}
                onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
                required
              />
              <input
                className="input"
                type="date"
                value={taskForm.dueDate}
                onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
              />
              <div>
                <strong>Asignar a alumnos</strong>
                <div className="grid" style={{ marginTop: 8 }}>
                  {students.map((student) => (
                    <label key={student.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={taskForm.studentIds.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                      />
                      {student.name}
                    </label>
                  ))}
                </div>
              </div>
              <button className="button" type="submit">Crear tarea</button>
            </form>
            {status ? <p style={{ color: "var(--muted)", marginTop: 8 }}>{status}</p> : null}
          </div>

          <div className="card" style={{ padding: 16 }}>
            <h3>Listado de entregas</h3>
            <div className="grid" style={{ gap: 8 }}>
              {taskReport.map((item) => (
                <div key={item.id} className="card" style={{ padding: 12 }}>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    Entregas: {item.submitted}/{item.total} ({item.percent}%)
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      marginTop: 6,
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percent}%`,
                        height: "100%",
                        background: item.percent >= 80 ? "#16a34a" : item.percent >= 50 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 12, marginTop: 12 }}>
              <strong>Resumen estadístico</strong>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                Promedio general: {taskAverage}%
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Alumnos con +80%: {taskHigh}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Alumnos con -50%: {taskLow}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {[taskLow, taskReport.length - taskLow - taskHigh, taskHigh].map((value, index) => (
                  <div
                    key={`bar-${index}`}
                    style={{
                      flex: 1,
                      height: 48,
                      borderRadius: 10,
                      background:
                        index === 0
                          ? "#ef4444"
                          : index === 1
                            ? "#f59e0b"
                            : "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                Datos ficticios para el gráfico estadístico.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="card" id="tareas-creadas">
        <h2>Tareas creadas</h2>
        <div className="grid">
          {tasks.map((task) => (
            <div key={task.id} className="card" style={{ padding: 14 }}>
              <strong>{task.title}</strong>
              <div style={{ color: "var(--muted)" }}>{task.description}</div>
              <div style={{ fontSize: 12 }}>
                Alumnos asignados: {task.assignments.length}
              </div>
              <div style={{ fontSize: 12 }}>
                Completadas: {task.assignments.filter((assignment) => assignment.completedAt).length}
              </div>
            </div>
          ))}
          {!tasks.length ? <p>No hay tareas aún.</p> : null}
        </div>
        </section>
      </div>
    </DocenteMenuLayout>
  );
}
