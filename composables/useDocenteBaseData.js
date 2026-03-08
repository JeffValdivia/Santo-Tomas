export const fallbackStudents = [
  { id: "f-1", name: "Ana Rojas" },
  { id: "f-2", name: "Luis Perez" },
  { id: "f-3", name: "Maria Torres" },
  { id: "f-4", name: "Jorge Nunez" },
  { id: "f-5", name: "Valeria Campos" },
  { id: "f-6", name: "Diego Salazar" },
  { id: "f-7", name: "Lucia Mendez" },
  { id: "f-8", name: "Carlos Rivas" },
  { id: "f-9", name: "Sofia Ramos" },
  { id: "f-10", name: "Mateo Diaz" }
];

export const shuffleList = (list) => [...list].sort(() => 0.5 - Math.random());

export function useDocenteBaseData() {
  const users = useState("doc-users", () => []);
  const students = useState("doc-students", () => []);
  const tasks = useState("doc-tasks", () => []);
  const docenteId = useState("doc-id", () => "");

  const loadUsers = async () => {
    users.value = await $fetch("/api/users");
  };

  const loadStudents = async () => {
    students.value = await $fetch("/api/students");
  };

  const refreshTasks = async (currentDocenteId) => {
    if (!currentDocenteId) return;
    tasks.value = await $fetch(`/api/tasks?docenteId=${currentDocenteId}`);
  };

  const docentes = computed(() => users.value.filter((user) => user.role === "DOCENTE"));

  return {
    users,
    students,
    docentes,
    tasks,
    docenteId,
    loadUsers,
    loadStudents,
    refreshTasks
  };
}

