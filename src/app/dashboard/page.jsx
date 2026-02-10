"use client";

import { useEffect, useState } from "react";
import ThesisLayout from "@/components/dashboard/ThesisLayout";

const randomBetween = (min, max) => Math.round((Math.random() * (max - min) + min) * 10) / 10;
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    promedio: 14.2,
    aprobacion: 78,
    riesgo: 12,
    asistencia: 92,
    tardanzas: 1.8,
    tareas: 85,
  });
  const [rows, setRows] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [logroData, setLogroData] = useState([]);
  const [tardanzas, setTardanzas] = useState([]);
  const [inasistencias, setInasistencias] = useState([]);
  const [riesgo, setRiesgo] = useState([]);

  useEffect(() => {
    const newMetrics = {
      promedio: randomBetween(9, 18),
      aprobacion: Math.round(randomBetween(60, 95)),
      riesgo: Math.round(randomBetween(5, 25)),
      asistencia: Math.round(randomBetween(70, 98)),
      tardanzas: randomBetween(0.5, 3.2),
      tareas: Math.round(randomBetween(50, 95)),
    };
    const students = [
      "Luis Gómez",
      "Ana Torres",
      "Carlos Ruiz",
      "María Rojas",
      "José Quispe",
      "Valeria Paredes",
    ];
    const courses = ["Matemática", "Comunicación", "C. Sociales", "Ciencia", "Arte"];
    const motivos = ["Bajo rendimiento", "Faltas frecuentes", "Tareas incumplidas", "Baja asistencia"];
    const newRows = Array.from({ length: 3 }).map((_, index) => ({
      id: index,
      alumno: students[Math.floor(Math.random() * students.length)],
      curso: courses[Math.floor(Math.random() * courses.length)],
      promedio: randomBetween(7, 11.5),
      asistencia: Math.round(randomBetween(60, 85)),
      tardanzas: Math.round(randomBetween(1, 6)),
      tareas: Math.round(randomBetween(40, 70)),
      motivo: motivos[Math.floor(Math.random() * motivos.length)],
    }));
    setMetrics(newMetrics);
    setRows(newRows);
    setBarData(["AD", "A", "B", "C"].map(() => randomInt(5, 30)));
    setLineData(Array.from({ length: 6 }).map(() => randomInt(40, 100)));
    setLogroData([
      { area: "Comunicación", A: randomInt(30, 60), B: randomInt(5, 20), C: randomInt(0, 5), AD: randomInt(5, 15) },
      { area: "Matemática", A: randomInt(25, 55), B: randomInt(8, 25), C: randomInt(0, 6), AD: randomInt(5, 18) },
      { area: "C. Sociales", A: randomInt(20, 45), B: randomInt(10, 25), C: randomInt(0, 6), AD: randomInt(5, 18) },
      { area: "D. Personal", A: randomInt(20, 45), B: randomInt(12, 28), C: randomInt(0, 6), AD: randomInt(5, 18) },
    ]);
    setTardanzas([
      { label: "0", value: randomInt(40, 60) },
      { label: "1-2", value: randomInt(10, 20) },
      { label: "3-5", value: randomInt(5, 15) },
      { label: "6+", value: randomInt(3, 10) },
    ]);
    setInasistencias([
      { label: "0", value: randomInt(35, 55) },
      { label: "1-2", value: randomInt(15, 25) },
      { label: "3-5", value: randomInt(5, 12) },
      { label: "6+", value: randomInt(2, 8) },
    ]);
    setRiesgo([
      { alumno: "Luis Gómez", motivo: "Bajo rendimiento", area: "Matemática" },
      { alumno: "Ana Torres", motivo: "Faltas frecuentes", area: "C. Sociales" },
      { alumno: "Carlos Ruiz", motivo: "Tareas incumplidas", area: "Comunicación" },
    ]);
  }, []);

  return (
    <ThesisLayout>
      <section className="dashboard-topbar">
        <div className="title">
          <span>📚</span>
          <div>
            <div>Sistema de Monitoreo Académico</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>IE Santo Tomás de Aquino - Circa, Arequipa</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 12, opacity: 0.8 }}>2025</span>
          <span>🔔</span>
          <span>👤</span>
        </div>
      </section>

      <section className="dashboard-filters">
        <select className="select">
          <option>Año: 2025</option>
        </select>
        <select className="select">
          <option>Grado: 1°</option>
        </select>
        <select className="select">
          <option>Sección: A</option>
        </select>
        <select className="select">
          <option>Curso: Todos</option>
        </select>
        <select className="select">
          <option>Bimestre: II</option>
        </select>
        <input className="input" placeholder="Buscar estudiante..." />
      </section>

      <section className="dashboard-cards" id="indicadores">
        <div className="stat-card">
          <div>Promedio General</div>
          <div className="value">{metrics.promedio}</div>
        </div>
        <div className="stat-card">
          <div>Tasa de Aprobación</div>
          <div className="value">{metrics.aprobacion}%</div>
        </div>
        <div className="stat-card warning">
          <div>En Riesgo Académico</div>
          <div className="value">{metrics.riesgo}%</div>
        </div>
        <div className="stat-card">
          <div>Asistencia Promedio</div>
          <div className="value">{metrics.asistencia}%</div>
        </div>
        <div className="stat-card">
          <div>Tardanzas Promedio</div>
          <div className="value">{metrics.tardanzas}</div>
        </div>
        <div className="stat-card">
          <div>Cumplimiento de Tareas</div>
          <div className="value">{metrics.tareas}%</div>
        </div>
      </section>

      <section className="chart-grid">
        <div className="chart-card" id="logro">
          <h3>Niveles de Logro por Área</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Área</th>
                <th>AD</th>
                <th>A</th>
                <th>B</th>
                <th>C</th>
              </tr>
            </thead>
            <tbody>
              {logroData.map((row) => (
                <tr key={row.area}>
                  <td>{row.area}</td>
                  <td>{row.AD}</td>
                  <td>{row.A}</td>
                  <td>{row.B}</td>
                  <td>{row.C}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="chart-card" id="tardanzas">
          <h3>Tardanzas e Inasistencias</h3>
          <div className="grid cols-2">
            <div>
              <strong>Tardanzas</strong>
              <ul className="metric-list">
                {tardanzas.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Inasistencias</strong>
              <ul className="metric-list">
                {inasistencias.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="risk-table" id="riesgo">
        <table>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Curso</th>
              <th>Promedio</th>
              <th>Asistencia</th>
              <th>Tardanzas</th>
              <th>Tareas</th>
              <th>Motivo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.alumno}</td>
                <td>{row.curso}</td>
                <td>{row.promedio}</td>
                <td>{row.asistencia}%</td>
                <td>{row.tardanzas}</td>
                <td>{row.tareas}%</td>
                <td>{row.motivo}</td>
                <td><button className="button secondary">Ver Ficha</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="risk-table" id="seguimiento">
        <table>
          <thead>
            <tr>
              <th>Alerta</th>
              <th>Motivo</th>
              <th>Área</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {riesgo.map((row, index) => (
              <tr key={index}>
                <td>{row.alumno}</td>
                <td>{row.motivo}</td>
                <td>{row.area}</td>
                <td><button className="button secondary">Ver ficha</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </ThesisLayout>
  );
}
