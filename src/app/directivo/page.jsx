"use client";

import { useEffect, useState } from "react";

const emptyRange = { dateFrom: "", dateTo: "" };

export default function DirectivoPage() {
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("");
  const [range, setRange] = useState(emptyRange);
  const [comparison, setComparison] = useState({ base: emptyRange, current: emptyRange });
  const [compareResult, setCompareResult] = useState(null);

  const loadReport = async (value = {}) => {
    setStatus("Cargando tablero...");
    const params = new URLSearchParams();
    if (value.dateFrom) params.append("dateFrom", value.dateFrom);
    if (value.dateTo) params.append("dateTo", value.dateTo);
    const query = params.toString();
    const res = await fetch(`/api/reports${query ? `?${query}` : ""}`);
    if (!res.ok) {
      setStatus("No se pudo cargar el reporte");
      return;
    }
    const data = await res.json();
    setReport(data);
    setStatus("");
  };

  const loadComparison = async () => {
    const paramsA = new URLSearchParams();
    if (comparison.base.dateFrom) paramsA.append("dateFrom", comparison.base.dateFrom);
    if (comparison.base.dateTo) paramsA.append("dateTo", comparison.base.dateTo);
    const paramsB = new URLSearchParams();
    if (comparison.current.dateFrom) paramsB.append("dateFrom", comparison.current.dateFrom);
    if (comparison.current.dateTo) paramsB.append("dateTo", comparison.current.dateTo);

    const [resA, resB] = await Promise.all([
      fetch(`/api/reports${paramsA.toString() ? `?${paramsA.toString()}` : ""}`),
      fetch(`/api/reports${paramsB.toString() ? `?${paramsB.toString()}` : ""}`),
    ]);

    if (!resA.ok || !resB.ok) {
      setCompareResult(null);
      return;
    }

    const baseData = await resA.json();
    const currentData = await resB.json();
    setCompareResult({ base: baseData, current: currentData });
  };

  useEffect(() => {
    loadReport();
  }, []);

  const riskStudents = report?.students.filter((item) => item.risk) || [];

  return (
    <div className="grid">
      <section className="card" id="tablero">
        <h2>Tablero directivo</h2>
        <p className="badge">Alertas y comparativos</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <label style={{ minWidth: 200 }}>
            Desde
            <input
              className="input"
              type="date"
              value={range.dateFrom}
              onChange={(event) => setRange({ ...range, dateFrom: event.target.value })}
            />
          </label>
          <label style={{ minWidth: 200 }}>
            Hasta
            <input
              className="input"
              type="date"
              value={range.dateTo}
              onChange={(event) => setRange({ ...range, dateTo: event.target.value })}
            />
          </label>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <button className="button" type="button" onClick={() => loadReport(range)}>
              Aplicar filtro
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => {
                setRange(emptyRange);
                loadReport();
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
        {report ? (
          <div className="grid cols-3" style={{ marginTop: 16 }}>
            <div className="card" style={{ padding: 14 }}>
              <strong>Promedio general</strong>
              <div style={{ fontSize: 22 }}>{report.overallAverage ?? "-"}</div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <strong>Tasa de aprobados</strong>
              <div style={{ fontSize: 22 }}>
                {report.passRate !== null ? `${Math.round(report.passRate * 100)}%` : "-"}
              </div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <strong>Asistencia promedio</strong>
              <div style={{ fontSize: 22 }}>
                {report.attendanceRate !== null ? `${Math.round(report.attendanceRate * 100)}%` : "-"}
              </div>
            </div>
          </div>
        ) : (
          <p className="muted" style={{ marginTop: 12 }}>{status}</p>
        )}
      </section>

      <section className="card" id="alertas">
        <h3>Alertas de riesgo</h3>
        <p className="muted">Estudiantes con promedio &lt; 11, asistencia &lt; 80% o tareas &lt; 60%</p>
        <table className="table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Promedio</th>
              <th>Asistencia</th>
              <th>Tareas</th>
            </tr>
          </thead>
          <tbody>
            {riskStudents.map((student) => (
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
              </tr>
            ))}
          </tbody>
        </table>
        {!riskStudents.length ? <p className="muted">No hay alertas por ahora.</p> : null}
      </section>

      <section className="card" id="comparativo">
        <h3>Comparativo por periodos</h3>
        <div className="grid cols-2" style={{ marginTop: 12 }}>
          <div className="card" style={{ padding: 14 }}>
            <strong>Periodo base</strong>
            <label>
              Desde
              <input
                className="input"
                type="date"
                value={comparison.base.dateFrom}
                onChange={(event) =>
                  setComparison({ ...comparison, base: { ...comparison.base, dateFrom: event.target.value } })
                }
              />
            </label>
            <label>
              Hasta
              <input
                className="input"
                type="date"
                value={comparison.base.dateTo}
                onChange={(event) =>
                  setComparison({ ...comparison, base: { ...comparison.base, dateTo: event.target.value } })
                }
              />
            </label>
          </div>
          <div className="card" style={{ padding: 14 }}>
            <strong>Periodo actual</strong>
            <label>
              Desde
              <input
                className="input"
                type="date"
                value={comparison.current.dateFrom}
                onChange={(event) =>
                  setComparison({ ...comparison, current: { ...comparison.current, dateFrom: event.target.value } })
                }
              />
            </label>
            <label>
              Hasta
              <input
                className="input"
                type="date"
                value={comparison.current.dateTo}
                onChange={(event) =>
                  setComparison({ ...comparison, current: { ...comparison.current, dateTo: event.target.value } })
                }
              />
            </label>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="button" type="button" onClick={loadComparison}>
            Comparar
          </button>
        </div>
        {compareResult ? (
          <div className="grid cols-3" style={{ marginTop: 16 }}>
            <div className="card" style={{ padding: 14 }}>
              <strong>Promedio</strong>
              <div>
                Base: {compareResult.base.overallAverage ?? "-"} / Actual: {compareResult.current.overallAverage ?? "-"}
              </div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <strong>Tasa aprobados</strong>
              <div>
                Base: {compareResult.base.passRate !== null ? `${Math.round(compareResult.base.passRate * 100)}%` : "-"}
                {" "} / Actual: {compareResult.current.passRate !== null ? `${Math.round(compareResult.current.passRate * 100)}%` : "-"}
              </div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <strong>Asistencia</strong>
              <div>
                Base: {compareResult.base.attendanceRate !== null ? `${Math.round(compareResult.base.attendanceRate * 100)}%` : "-"}
                {" "} / Actual: {compareResult.current.attendanceRate !== null ? `${Math.round(compareResult.current.attendanceRate * 100)}%` : "-"}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
