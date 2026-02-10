"use client";

import { useEffect, useState } from "react";

const emptyForm = { name: "", email: "", role: "ALUMNO", phone: "", password: "" };

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [extraForm, setExtraForm] = useState({
    lastName: "",
    birthDate: "",
    gender: "",
    subjects: "",
  });
  const [status, setStatus] = useState("");
  const [report, setReport] = useState(null);
  const [reportStatus, setReportStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [openMenu, setOpenMenu] = useState("docente");
  const [activeView, setActiveView] = useState("docente-registro");

  const loadUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const loadReport = async (range = {}) => {
    setReportStatus("Cargando reportes...");
    const params = new URLSearchParams();
    if (range.dateFrom) params.append("dateFrom", range.dateFrom);
    if (range.dateTo) params.append("dateTo", range.dateTo);
    const query = params.toString();
    const res = await fetch(`/api/reports${query ? `?${query}` : ""}`);
    if (!res.ok) {
      setReportStatus("No se pudo cargar reportes");
      return;
    }
    const data = await res.json();
    setReport(data);
    setReportStatus("");
  };

  useEffect(() => {
    loadUsers();
    loadReport();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Guardando...");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setStatus("Error al crear usuario");
      return;
    }

    setForm(emptyForm);
    setStatus("Usuario creado");
    loadUsers();
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="profile">
          <div className="avatar">A</div>
          <strong>Admin</strong>
          <span style={{ fontSize: 12, opacity: 0.8 }}>Rango: Administrador</span>
        </div>
        <div className="menu">
          <div className="menu-group">
            <button
              className="menu-title"
              type="button"
              onClick={() => setOpenMenu(openMenu === "docente" ? "" : "docente")}
            >
              <span>Docente</span>
              <span>{openMenu === "docente" ? "▴" : "▾"}</span>
            </button>
            {openMenu === "docente" ? (
              <div className="menu-links">
                <button type="button" onClick={() => setActiveView("docente-lista")}>
                  Lista Docentes (Edit, Delete)
                </button>
                <button type="button" onClick={() => setActiveView("docente-registro")}>
                  Agregar Docente (Asignatura, permisos)
                </button>
              </div>
            ) : null}
          </div>
          <div className="menu-group">
            <button
              className="menu-title"
              type="button"
              onClick={() => setOpenMenu(openMenu === "estudiante" ? "" : "estudiante")}
            >
              <span>Estudiante</span>
              <span>{openMenu === "estudiante" ? "▴" : "▾"}</span>
            </button>
            {openMenu === "estudiante" ? (
              <div className="menu-links">
                <button type="button" onClick={() => setActiveView("estudiante-lista")}>
                  Lista Estudiantes (Edit, Delete)
                </button>
                <button type="button" onClick={() => setActiveView("estudiante-registro")}>
                  Agregar Estudiante (Asignaturas, permisos)
                </button>
              </div>
            ) : null}
          </div>
          <div className="menu-group">
            <button
              className="menu-title"
              type="button"
              onClick={() => setOpenMenu(openMenu === "curso" ? "" : "curso")}
            >
              <span>Curso</span>
              <span>{openMenu === "curso" ? "▴" : "▾"}</span>
            </button>
            {openMenu === "curso" ? (
              <div className="menu-links">
                <button type="button" onClick={() => setActiveView("curso-lista")}>
                  Lista Cursos (Edit, Delete)
                </button>
                <button type="button" onClick={() => setActiveView("curso-registro")}>
                  Agregar Curso (Asignaturas, permisos)
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          INSTITUCION EDUCATIVA SANTO TOMAS DE AQUINO - CIRCA AREQUIPA
        </div>
        <div className="admin-content">
          <div className="admin-grid">
            {activeView === "docente-registro" ? (
              <section className="admin-card" id="registro">
                <h2 className="admin-section-title">Registro de Docente</h2>
                <form className="admin-form" onSubmit={handleSubmit}>
                  <label>
                    Nombres
                    <input
                      className="input"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Apellidos
                    <input
                      className="input"
                      value={extraForm.lastName}
                      onChange={(event) => setExtraForm({ ...extraForm, lastName: event.target.value })}
                    />
                  </label>
                  <label>
                    Fecha de Nacimiento
                    <input
                      className="input"
                      type="date"
                      value={extraForm.birthDate}
                      onChange={(event) => setExtraForm({ ...extraForm, birthDate: event.target.value })}
                    />
                  </label>
                  <label>
                    Sexo
                    <select
                      className="select"
                      value={extraForm.gender}
                      onChange={(event) => setExtraForm({ ...extraForm, gender: event.target.value })}
                    >
                      <option value="">Seleccione sexo</option>
                      <option value="F">Femenino</option>
                      <option value="M">Masculino</option>
                    </select>
                  </label>
                  <label>
                    Asignaturas
                    <input
                      className="input"
                      placeholder="Ingrese asignaturas separadas por coma"
                      value={extraForm.subjects}
                      onChange={(event) => setExtraForm({ ...extraForm, subjects: event.target.value })}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      className="input"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Contraseña
                    <input
                      className="input"
                      type="password"
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Rol
                    <select
                      className="select"
                      value={form.role}
                      onChange={(event) => setForm({ ...form, role: event.target.value })}
                    >
                      <option value="DOCENTE">Docente</option>
                      <option value="ADMIN">Admin</option>
                      <option value="ALUMNO">Alumno</option>
                    </select>
                  </label>
                  <label>
                    Teléfono WhatsApp (con prefijo país)
                    <input
                      className="input"
                      placeholder="+51999999999"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    />
                  </label>
                  <button className="button" type="submit">Registrar</button>
                  {status ? <span style={{ color: "var(--muted)" }}>{status}</span> : null}
                </form>
              </section>
            ) : null}

            {activeView === "docente-lista" || activeView === "estudiante-lista" ? (
              <section className="card" id="usuarios">
                <h2>Usuarios registrados</h2>
                <p className="badge">Docentes y estudiantes</p>
                <div className="grid" style={{ marginTop: 16 }}>
                  {users.map((user) => (
                    <div key={user.id} className="card" style={{ padding: 14 }}>
                      <strong>{user.name}</strong>
                      <div style={{ color: "var(--muted)" }}>{user.email}</div>
                      <div style={{ fontSize: 12 }}>{user.role}</div>
                      <div style={{ fontSize: 12 }}>{user.phone || "Sin teléfono"}</div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {activeView === "estudiante-registro" ? (
              <section className="admin-card" id="registro-estudiante">
                <h2 className="admin-section-title">Registro de Estudiante</h2>
                <form className="admin-form" onSubmit={handleSubmit}>
                  <label>
                    Nombres
                    <input
                      className="input"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Apellidos
                    <input
                      className="input"
                      value={extraForm.lastName}
                      onChange={(event) => setExtraForm({ ...extraForm, lastName: event.target.value })}
                    />
                  </label>
                  <label>
                    Fecha de Nacimiento
                    <input
                      className="input"
                      type="date"
                      value={extraForm.birthDate}
                      onChange={(event) => setExtraForm({ ...extraForm, birthDate: event.target.value })}
                    />
                  </label>
                  <label>
                    Sexo
                    <select
                      className="select"
                      value={extraForm.gender}
                      onChange={(event) => setExtraForm({ ...extraForm, gender: event.target.value })}
                    >
                      <option value="">Seleccione sexo</option>
                      <option value="F">Femenino</option>
                      <option value="M">Masculino</option>
                    </select>
                  </label>
                  <label>
                    Asignaturas
                    <input
                      className="input"
                      placeholder="Ingrese asignaturas separadas por coma"
                      value={extraForm.subjects}
                      onChange={(event) => setExtraForm({ ...extraForm, subjects: event.target.value })}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      className="input"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Contraseña
                    <input
                      className="input"
                      type="password"
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Rol
                    <select
                      className="select"
                      value={form.role}
                      onChange={(event) => setForm({ ...form, role: event.target.value })}
                    >
                      <option value="ALUMNO">Alumno</option>
                      <option value="DOCENTE">Docente</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </label>
                  <label>
                    Teléfono WhatsApp (con prefijo país)
                    <input
                      className="input"
                      placeholder="+51999999999"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    />
                  </label>
                  <button className="button" type="submit">Registrar</button>
                  {status ? <span style={{ color: "var(--muted)" }}>{status}</span> : null}
                </form>
              </section>
            ) : null}

            {activeView === "curso-lista" || activeView === "curso-registro" ? (
              <section className="card" id="reportes">
                <h2>Reportes institucionales</h2>
                <p className="badge">Indicadores académicos</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                  <label style={{ minWidth: 200 }}>
                    Desde
                    <input
                      className="input"
                      type="date"
                      value={dateFrom}
                      onChange={(event) => setDateFrom(event.target.value)}
                    />
                  </label>
                  <label style={{ minWidth: 200 }}>
                    Hasta
                    <input
                      className="input"
                      type="date"
                      value={dateTo}
                      onChange={(event) => setDateTo(event.target.value)}
                    />
                  </label>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <button
                      className="button"
                      type="button"
                      onClick={() => loadReport({ dateFrom, dateTo })}
                    >
                      Aplicar filtro
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                        loadReport();
                      }}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
                {report ? (
                  <div className="grid cols-3" style={{ marginTop: 12 }}>
                    <div className="card" style={{ padding: 14 }}>
                      <strong>Promedio general</strong>
                      <div style={{ fontSize: 22 }}>{report.overallAverage ?? "-"}</div>
                      <div className="muted">Escala 0 - 20</div>
                    </div>
                    <div className="card" style={{ padding: 14 }}>
                      <strong>Tasa de aprobados</strong>
                      <div style={{ fontSize: 22 }}>
                        {report.passRate !== null ? `${Math.round(report.passRate * 100)}%` : "-"}
                      </div>
                      <div className="muted">Promedio ≥ 11</div>
                    </div>
                    <div className="card" style={{ padding: 14 }}>
                      <strong>Asistencia promedio</strong>
                      <div style={{ fontSize: 22 }}>
                        {report.attendanceRate !== null ? `${Math.round(report.attendanceRate * 100)}%` : "-"}
                      </div>
                      <div className="muted">Presente + Tarde</div>
                    </div>
                  </div>
                ) : (
                  <p className="muted" style={{ marginTop: 12 }}>{reportStatus}</p>
                )}

                {report ? (
                  <div style={{ marginTop: 20 }}>
                    <div className="grid cols-3">
                      <div className="card" style={{ padding: 14 }}>
                        <strong>Presente</strong>
                        <div style={{ fontSize: 22 }}>{report.attendanceSummary.present}</div>
                      </div>
                      <div className="card" style={{ padding: 14 }}>
                        <strong>Tarde</strong>
                        <div style={{ fontSize: 22 }}>{report.attendanceSummary.late}</div>
                      </div>
                      <div className="card" style={{ padding: 14 }}>
                        <strong>Inasistente</strong>
                        <div style={{ fontSize: 22 }}>{report.attendanceSummary.absent}</div>
                      </div>
                    </div>
                    <h3>Detalle por estudiante</h3>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Estudiante</th>
                          <th>Promedio</th>
                          <th>Asistencia</th>
                          <th>Tareas</th>
                          <th>Riesgo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.students.map((student) => (
                          <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.average ?? "-"}</td>
                            <td>
                              {student.attendanceRate !== null
                                ? `${Math.round(student.attendanceRate * 100)}%`
                                : "-"}
                            </td>
                            <td>
                              {student.completionRate !== null
                                ? `${Math.round(student.completionRate * 100)}%`
                                : "-"}
                            </td>
                            <td>{student.risk ? "En riesgo" : "Normal"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
