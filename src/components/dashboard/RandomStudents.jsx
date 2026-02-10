"use client";

import { useEffect, useState } from "react";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const students = [
  "Luis Gómez",
  "Ana Torres",
  "Carlos Ruiz",
  "María Rojas",
  "José Quispe",
  "Valeria Paredes",
  "Daniela Salas",
  "Bruno Mena",
  "Sofía Huamán",
  "Iván Ríos",
  "Lucía Campos",
  "Miguel Soto",
  "Paola Vargas",
  "Renato Salazar",
  "Ariana Cruz",
  "Jorge Lazo",
  "Carmen León",
  "Mateo Castro",
  "Nadia Flores",
  "Sebastián Prado",
];

const courses = ["Matemática", "Comunicación", "C. Sociales", "Ciencia", "Arte"];
const motivos = ["Bajo rendimiento", "Faltas frecuentes", "Tareas incumplidas", "Baja asistencia"];

export default function RandomStudents({ title }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const newRows = Array.from({ length: 20 }).map((_, index) => ({
      id: index,
      alumno: students[index % students.length],
      curso: courses[randomInt(0, courses.length - 1)],
      promedio: randomInt(7, 20),
      asistencia: randomInt(60, 100),
      tardanzas: randomInt(0, 8),
      tareas: randomInt(40, 100),
      motivo: motivos[randomInt(0, motivos.length - 1)],
    }));
    setRows(newRows);
  }, []);

  return (
    <div className="dashboard-shell">
      <section className="card">
        <h2>{title}</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Curso</th>
              <th>Promedio</th>
              <th>Asistencia</th>
              <th>Tardanzas</th>
              <th>Tareas</th>
              <th>Motivo</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
