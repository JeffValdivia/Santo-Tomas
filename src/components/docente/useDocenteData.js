"use client";

import { useEffect, useMemo, useState } from "react";

export const fallbackStudents = [
  { id: "f-1", name: "Ana Rojas" },
  { id: "f-2", name: "Luis Pérez" },
  { id: "f-3", name: "María Torres" },
  { id: "f-4", name: "Jorge Núñez" },
  { id: "f-5", name: "Valeria Campos" },
  { id: "f-6", name: "Diego Salazar" },
  { id: "f-7", name: "Lucía Méndez" },
  { id: "f-8", name: "Carlos Rivas" },
  { id: "f-9", name: "Sofía Ramos" },
  { id: "f-10", name: "Mateo Díaz" },
];

export const shuffleList = (list) => [...list].sort(() => 0.5 - Math.random());

export function useDocenteBaseData() {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [docenteId, setDocenteId] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    };

    const loadStudents = async () => {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
    };

    loadUsers();
    loadStudents();
  }, []);

  const refreshTasks = async (currentDocenteId) => {
    if (!currentDocenteId) return;
    const res = await fetch(`/api/tasks?docenteId=${currentDocenteId}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    refreshTasks(docenteId);
  }, [docenteId]);

  const docentes = useMemo(() => users.filter((user) => user.role === "DOCENTE"), [users]);

  return {
    users,
    students,
    docentes,
    tasks,
    setTasks,
    docenteId,
    setDocenteId,
    refreshTasks,
    hasRealStudents: students.length > 0,
  };
}
