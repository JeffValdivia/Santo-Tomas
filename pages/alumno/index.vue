<template>
  <AlumnoMenuLayout>
    <div class="grid cols-2">
      <section class="card">
        <h2>Panel del Alumno</h2>
        <p class="badge">Mis tÁreas y notas</p>

        <div v-if="usingFallbackData" style="margin-top: 12px;">
          <div style="font-size: 14px; font-weight: 600;">Datos de ejemplo</div>
        </div>

        <div class="grid" style="margin-top: 16px;">
          <div class="card" id="tÁreas" style="padding: 16px;">
            <h3>TÁreas asignadas</h3>
            <div class="grid">
              <div v-for="task in displayTasks" :key="task.id" class="card" style="padding: 12px;">
                <strong>{{ task.title }}</strong>
                <div style="color: var(--muted);">{{ task.description }}</div>
                <div style="font-size: 12px;">Docente: {{ task.createdBy?.name || '-' }}</div>
                <div v-if="task.assignments && task.assignments[0]" style="display: flex; gap: 10px; align-items: center; margin-top: 8px;">
                  <span class="badge">{{ task.assignments[0].completedAt ? "Completada" : "Pendiente" }}</span>
                  <button
                    v-if="task.assignments[0].id"
                    class="button secondary"
                    type="button"
                    @click="updateCompletion(task.assignments[0].id, !task.assignments[0].completedAt)"
                  >
                    {{ task.assignments[0].completedAt ? "Marcar pendiente" : "Marcar completada" }}
                  </button>
                </div>
              </div>
              <p v-if="!displayTasks.length">No hay tÁreas asignadas.</p>
            </div>
          </div>

          <div class="card" id="notas" style="padding: 16px;">
            <h3>Notas y comentarios</h3>
            <div class="grid">
              <div v-for="grade in displayGrades" :key="grade.id" class="card" style="padding: 12px;">
                <strong>Nota: {{ grade.score }}</strong>
                <div style="color: var(--muted);">{{ grade.comment || "Sin comentario" }}</div>
                <div style="font-size: 12px;">Docente: {{ grade.createdBy?.name || '-' }}</div>
                <div style="font-size: 12px;">TÁrea: {{ grade.task?.title || '-' }}</div>
              </div>
              <p v-if="!displayGrades.length">No hay notas aún.</p>
            </div>
          </div>

          <div class="card" id="asistencia" style="padding: 16px;">
            <h3>Asistencia</h3>
            <table class="table">
              <thead><tr><th>Fecha</th><th>Estado</th><th>Docente</th></tr></thead>
              <tbody>
                <tr v-for="item in displayAttendance" :key="item.id">
                  <td>{{ new Date(item.date).toLocaleDateString('es-PE') }}</td>
                  <td>
                    <span v-if="item.status === 'PRESENT'">Presente</span>
                    <span v-if="item.status === 'LATE'">Tarde</span>
                    <span v-if="item.status === 'ABSENT'">Inasistente</span>
                  </td>
                  <td>{{ item.recordedBy?.name || '-' }}</td>
                </tr>
              </tbody>
            </table>
            <p v-if="!displayAttendance.length" class="muted">No hay registros aún.</p>
          </div>
        </div>
      </section>

      <section class="card" id="resumen">
        <h2>Resumen</h2>
        <p>Selecciona tu usuario para ver las tÁreas asignadas y las notas registradas por el docente.</p>
        <p v-if="studentId" class="muted" style="margin-top: 8px;">Alumno detectado: {{ students.find((s) => s.id === studentId)?.name || '-' }}</p>
        <ul>
          <li>Las tÁreas se notifican por WhatsApp cuando el docente las crea.</li>
          <li>Las notas incluyen comentarios y se asocian opcionalmente a una tÁrea.</li>
          <li>Marca tus tÁreas como completadas para reflejar tu cumplimiento.</li>
        </ul>
        <p v-if="attendanceStatus" class="muted">{{ attendanceStatus }}</p>
      </section>
    </div>
  </AlumnoMenuLayout>
</template>

<script setup>
definePageMeta({ middleware: "role" });
import AlumnoMenuLayout from "~/components/layout/AlumnoMenuLayout.vue";

const students = ref([]);
const studentId = ref("");
const tasks = ref([]);
const grades = ref([]);
const attendance = ref([]);
const attendanceStatus = ref("");

const sampleTasks = [
  { id: "s-task-1", title: "Matematica Basica - Suma", description: "Practica operaciones basicas: sumas hasta 100.", createdBy: { name: "Profesor Ruiz" }, assignments: [{ id: null, completedAt: null }] },
  { id: "s-task-2", title: "Matematica Basica - Resta", description: "Ejercicios de resta y problemas cortos.", createdBy: { name: "Profesor Ruiz" }, assignments: [{ id: null, completedAt: "2026-02-02T09:00:00Z" }] }
];
const sampleGrades = [
  { id: "g1", score: 16, comment: "Buen progreso", createdBy: { name: "Profesor Ruiz" }, task: { title: "Suma" } },
  { id: "g2", score: 14, comment: "Repasar resta", createdBy: { name: "Profesor Ruiz" }, task: { title: "Resta" } }
];
const sampleAttendance = [
  { id: "a1", date: "2026-01-28", status: "PRESENT", recordedBy: { name: "Profesor Ruiz" } },
  { id: "a2", date: "2026-01-29", status: "LATE", recordedBy: { name: "Profesor Ruiz" } },
  { id: "a3", date: "2026-02-02", status: "ABSENT", recordedBy: { name: "Profesor Ruiz" } }
];

const displayTasks = computed(() => (tasks.value.length ? tasks.value : sampleTasks));
const displayGrades = computed(() => (grades.value.length ? grades.value : sampleGrades));
const displayAttendance = computed(() => (attendance.value.length ? attendance.value : sampleAttendance));
const usingFallbackData = computed(() => !studentId.value || !tasks.value.length || !grades.value.length || !attendance.value.length);

const loadStudents = async () => {
  try {
    const data = await $fetch("/api/students");
    students.value = data;
    if (data?.length) studentId.value = data[0].id;
  } catch {
    students.value = [];
    studentId.value = "";
  }
};

const loadData = async (currentStudentId) => {
  if (!currentStudentId) return;
  try {
    const [tasksData, gradesData, attendanceData] = await Promise.all([
      $fetch(`/api/tasks?studentId=${currentStudentId}`),
      $fetch(`/api/grades?studentId=${currentStudentId}`),
      $fetch(`/api/attendance?studentId=${currentStudentId}`)
    ]);
    tasks.value = tasksData;
    grades.value = gradesData;
    attendance.value = attendanceData;
  } catch {
    tasks.value = [];
    grades.value = [];
    attendance.value = [];
  }
};

const updateCompletion = async (assignmentId, completed) => {
  if (!assignmentId) return;
  attendanceStatus.value = "Actualizando tÁrea...";
  try {
    await $fetch("/api/assignments", { method: "PATCH", body: { id: assignmentId, completed } });
    attendanceStatus.value = "Actualizado";
    await loadData(studentId.value);
  } catch {
    attendanceStatus.value = "No se pudo actualizar";
  }
};

onMounted(loadStudents);
watch(studentId, (value) => loadData(value));
</script>


