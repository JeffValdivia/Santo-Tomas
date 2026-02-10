"use client";

import { useEffect, useState } from "react";
import AlumnoMenuLayout from "@/components/alumno/AlumnoMenuLayout";

export default function AlumnoPage() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState("");

  const loadStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  };

  const loadData = async (currentStudentId) => {
    if (!currentStudentId) return;
    const [tasksRes, gradesRes] = await Promise.all([
      fetch(`/api/tasks?studentId=${currentStudentId}`),
      fetch(`/api/grades?studentId=${currentStudentId}`),
    ]);
    const tasksData = await tasksRes.json();
    const gradesData = await gradesRes.json();
    setTasks(tasksData);
    setGrades(gradesData);
    const attendanceRes = await fetch(`/api/attendance?studentId=${currentStudentId}`);
    const attendanceData = await attendanceRes.json();
    setAttendance(attendanceData);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadData(studentId);
  }, [studentId]);

  const updateCompletion = async (assignmentId, completed) => {
    setAttendanceStatus("Actualizando tarea...");
    const res = await fetch("/api/assignments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: assignmentId, completed }),
    });
    if (!res.ok) {
      setAttendanceStatus("No se pudo actualizar");
      return;
    }
    setAttendanceStatus("Actualizado");
    loadData(studentId);
  };

  return (
    <AlumnoMenuLayout>
      <div className="grid cols-2">
        <section className="card">
        <h2>Panel del Alumno</h2>
        <p className="badge">Mis tareas y notas</p>
        <label style={{ display: "block", marginTop: 12 }}>
          Alumno activo
          <select
            className="select"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
          >
            <option value="">Selecciona alumno</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid" style={{ marginTop: 16 }}>
          <div className="card" id="tareas" style={{ padding: 16 }}>
            <h3>Tareas asignadas</h3>
            <div className="grid">
              {tasks.map((task) => (
                <div key={task.id} className="card" style={{ padding: 12 }}>
                  <strong>{task.title}</strong>
                  <div style={{ color: "var(--muted)" }}>{task.description}</div>
                  <div style={{ fontSize: 12 }}>
                    Docente: {task.createdBy?.name || "-"}
                  </div>
                  {task.assignments[0] ? (
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                      <span className="badge">
                        {task.assignments[0].completedAt ? "Completada" : "Pendiente"}
                      </span>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() =>
                          updateCompletion(
                            task.assignments[0].id,
                            !task.assignments[0].completedAt
                          )
                        }
                      >
                        {task.assignments[0].completedAt ? "Marcar pendiente" : "Marcar completada"}
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
              {!tasks.length ? <p>No hay tareas asignadas.</p> : null}
            </div>
          </div>

          <div className="card" id="notas" style={{ padding: 16 }}>
            <h3>Notas y comentarios</h3>
            <div className="grid">
              {grades.map((grade) => (
                <div key={grade.id} className="card" style={{ padding: 12 }}>
                  <strong>Nota: {grade.score}</strong>
                  <div style={{ color: "var(--muted)" }}>
                    {grade.comment || "Sin comentario"}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    Docente: {grade.createdBy?.name || "-"}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    Tarea: {grade.task?.title || "-"}
                  </div>
                </div>
              ))}
              {!grades.length ? <p>No hay notas aún.</p> : null}
            </div>
          </div>

          <div className="card" id="asistencia" style={{ padding: 16 }}>
            <h3>Asistencia</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Docente</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.date).toLocaleDateString("es-PE")}</td>
                    <td>
                      {item.status === "PRESENT" ? "Presente" : null}
                      {item.status === "LATE" ? "Tarde" : null}
                      {item.status === "ABSENT" ? "Inasistente" : null}
                    </td>
                    <td>{item.recordedBy?.name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!attendance.length ? <p className="muted">No hay registros aún.</p> : null}
          </div>
        </div>
      </section>

      <section className="card" id="resumen">
        <h2>Resumen</h2>
        <p>
          Selecciona tu usuario para ver las tareas asignadas y las notas registradas por el docente.
        </p>
        <ul>
          <li>Las tareas se envían por WhatsApp cuando el docente las crea.</li>
          <li>Las notas incluyen comentarios y se asocian opcionalmente a una tarea.</li>
          <li>Marca tus tareas como completadas para reflejar tu cumplimiento.</li>
        </ul>
        {attendanceStatus ? <p className="muted">{attendanceStatus}</p> : null}
        </section>
      </div>
    </AlumnoMenuLayout>
  );
}
