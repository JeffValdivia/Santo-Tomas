"use client";

import { useEffect, useState } from "react";
import DocenteMenuLayout from "@/components/docente/DocenteMenuLayout";
import {
  fallbackStudents,
  shuffleList,
  useDocenteBaseData,
} from "@/components/docente/useDocenteData";

function DonutChart({ percent = 0, size = 96, strokeWidth = 12, color = "#16a34a", bg = "#e5e7eb" }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={r} fill="none" stroke={bg} strokeWidth={strokeWidth} />
        <circle
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${Math.max(0, c - dash)}`}
          transform="rotate(-90)"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="14"
          fill="var(--muted)"
          style={{ fontWeight: 600 }}
        >
          {percent}%
        </text>
      </g>
    </svg>
  );
}

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
  const onTimeCount = taskReport.filter((item) => item.percent >= 80).length;
  const lateCount = taskReport.filter((item) => item.percent < 80).length;
  const onTimePercent = taskReport.length ? Math.round((onTimeCount / taskReport.length) * 100) : 0;
  const sampleTasks = [
    {
      id: "math-1",
      title: "Matemática Básica - Suma",
      description: "Ejercicios de suma y conceptos básicos.",
      assignments: [
        { studentId: "s1", completedAt: "2026-02-01T10:00:00Z" },
        { studentId: "s2", completedAt: null },
        { studentId: "s3", completedAt: "2026-02-02T12:30:00Z" },
      ],
    },
    {
      id: "math-2",
      title: "Matemática Básica - Resta",
      description: "Problemas de resta y práctica dirigida.",
      assignments: [
        { studentId: "s1", completedAt: null },
        { studentId: "s2", completedAt: null },
        { studentId: "s3", completedAt: "2026-02-03T09:15:00Z" },
      ],
    },
  ];
  const displayTasks = tasks && tasks.length ? tasks : sampleTasks;

  return (
    <DocenteMenuLayout>
      <div className="grid cols-2">
        <section className="card">
        <h2>Reporte de tareas</h2>
        <p className="badge">Entregas y gráficos</p>

        

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
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
              <DonutChart percent={onTimePercent} />
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Entregas a tiempo</div>
                <strong style={{ fontSize: 18 }}>{onTimePercent}%</strong>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                  Tardías: {lateCount} ({100 - onTimePercent}%)
                </div>
              </div>
            </div>

            <div style={{ maxHeight: 320, overflowY: "auto", marginTop: 12 }}>
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
              
            </div>
          </div>
        </div>
      </section>

      <section className="card" id="tareas-creadas">
        <h2>Tareas creadas</h2>
        <div className="grid">
          {displayTasks.map((task) => (
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
        </div>
        </section>
      </div>
    </DocenteMenuLayout>
  );
}
