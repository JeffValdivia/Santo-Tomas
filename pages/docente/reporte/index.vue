<template>
  <DocenteMenuLayout>
    <div class="grid cols-2">
      <section class="card">
        <h2>Reporte de tÁreas</h2>
        <p class="badge">Entregas y gráficos</p>

        <div class="grid" style="margin-top: 16px;">
          <div class="card" style="padding: 16px;">
            <h3>Crear tÁrea</h3>
            <form class="grid" @submit.prevent="handleTaskSubmit">
              <input v-model="taskForm.title" class="input" placeholder="Titulo" required />
              <textÁrea v-model="taskForm.description" class="textÁrea" placeholder="Descripcion" required />
              <input v-model="taskForm.dueDate" class="input" type="date" />
              <div>
                <strong>Asignar a alumnos</strong>
                <div class="grid" style="margin-top: 8px;">
                  <label v-for="student in students" :key="student.id" style="display: flex; gap: 8px; align-items: center;">
                    <input type="checkbox" :checked="taskForm.studentIds.includes(student.id)" @change="toggleStudent(student.id)" />
                    {{ student.name }}
                  </label>
                </div>
              </div>
              <button class="button" type="submit">Crear tÁrea</button>
            </form>
            <p v-if="status" style="color: var(--muted); margin-top: 8px;">{{ status }}</p>
          </div>

          <div class="card" style="padding: 16px;">
            <h3>Listado de entregas</h3>
            <div style="display: flex; gap: 12px; align-items: center; margin-top: 8px;">
              <svg :width="96" :height="96" viewBox="0 0 96 96" aria-hidden>
                <g transform="translate(48,48)">
                  <circle :r="42" fill="none" stroke="#e5e7eb" stroke-width="12" />
                  <circle
                    :r="42"
                    fill="none"
                    stroke="#16a34a"
                    stroke-width="12"
                    stroke-linecap="round"
                    :stroke-dasharray="`${(onTimePercent / 100) * (2 * Math.PI * 42)} ${Math.max(0, (2 * Math.PI * 42) - (onTimePercent / 100) * (2 * Math.PI * 42))}`"
                    transform="rotate(-90)"
                  />
                  <text x="0" y="4" text-anchor="middle" font-size="14" fill="var(--muted)" style="font-weight: 600;">{{ onTimePercent }}%</text>
                </g>
              </svg>
              <div>
                <div style="font-size: 12px; color: var(--muted);">Entregas a tiempo</div>
                <strong style="font-size: 18px;">{{ onTimePercent }}%</strong>
                <div style="font-size: 12px; color: var(--muted); margin-top: 8px;">Tardías: {{ lateCount }} ({{ 100 - onTimePercent }}%)</div>
              </div>
            </div>

            <div style="max-height: 320px; overflow-y: auto; margin-top: 12px;">
              <div class="grid" style="gap: 8px;">
                <div v-for="item in taskReport" :key="item.id" class="card" style="padding: 12px;">
                  <strong>{{ item.name }}</strong>
                  <div style="font-size: 12px; color: var(--muted);">Entregas: {{ item.submitted }}/{{ item.total }} ({{ item.percent }}%)</div>
                  <div style="height: 8px; border-radius: 999px; background: rgba(0,0,0,0.08); overflow: hidden; margin-top: 6px;">
                    <div :style="{ width: `${item.percent}%`, height: '100%', background: item.percent >= 80 ? '#16a34a' : item.percent >= 50 ? '#f59e0b' : '#ef4444' }" />
                  </div>
                </div>
              </div>
            </div>

            <div class="card" style="padding: 12px; margin-top: 12px;">
              <strong>Resumen estadistico</strong>
              <div style="font-size: 12px; color: var(--muted); margin-top: 6px;">Promedio general: {{ taskAverage }}%</div>
              <div style="font-size: 12px; color: var(--muted);">Alumnos con +80%: {{ taskHigh }}</div>
              <div style="font-size: 12px; color: var(--muted);">Alumnos con -50%: {{ taskLow }}</div>
              <div style="display: flex; gap: 6px; margin-top: 8px;">
                <div v-for="(value, index) in [taskLow, taskReport.length - taskLow - taskHigh, taskHigh]" :key="`bar-${index}`" :style="{ flex: 1, height: '48px', borderRadius: '10px', background: index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }">{{ value }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="card" id="tÁreas-creadas">
        <h2>TÁreas creadas</h2>
        <div class="grid">
          <div v-for="task in displayTasks" :key="task.id" class="card" style="padding: 14px;">
            <strong>{{ task.title }}</strong>
            <div style="color: var(--muted);">{{ task.description }}</div>
            <div style="font-size: 12px;">Alumnos asignados: {{ task.assignments.length }}</div>
            <div style="font-size: 12px;">Completadas: {{ task.assignments.filter((a) => a.completedAt).length }}</div>
          </div>
        </div>
      </section>
    </div>
  </DocenteMenuLayout>
</template>

<script setup>
definePageMeta({ middleware: "role" });
import DocenteMenuLayout from "~/components/layout/DocenteMenuLayout.vue";
import { fallbackStudents, shuffleList } from "~/composables/useDocenteBaseData";

const { students, tasks, docenteId, loadUsers, loadStudents, refreshTasks } = useDocenteBaseData();

const initialTask = { title: "", description: "", dueDate: "", studentIds: [] };
const taskForm = ref({ ...initialTask });
const status = ref("");
const taskReport = ref([]);

const buildTaskReport = () => {
  const sourceStudents = students.value.length ? students.value : fallbackStudents;
  const shuffled = shuffleList(sourceStudents);
  const sample = shuffled.slice(0, Math.min(10, shuffled.length));
  const totalTasks = 8;

  taskReport.value = sample.map((student) => {
    const submitted = Math.floor(Math.random() * (totalTasks + 1));
    const percent = Math.round((submitted / totalTasks) * 100);
    return { id: student.id, name: student.name, submitted, total: totalTasks, percent };
  });
};

const toggleStudent = (studentId) => {
  const exists = taskForm.value.studentIds.includes(studentId);
  taskForm.value.studentIds = exists
    ? taskForm.value.studentIds.filter((id) => id !== studentId)
    : [...taskForm.value.studentIds, studentId];
};

const handleTaskSubmit = async () => {
  if (!docenteId.value) {
    status.value = "Selecciona un docente";
    return;
  }

  status.value = "Creando tÁrea...";
  try {
    await $fetch("/api/tasks", {
      method: "POST",
      body: { ...taskForm.value, createdById: docenteId.value }
    });
    taskForm.value = { ...initialTask };
    status.value = "TÁrea creada y notificada";
    await refreshTasks(docenteId.value);
  } catch {
    status.value = "Error al crear tÁrea";
  }
};

const taskAverage = computed(() => taskReport.value.length ? Math.round(taskReport.value.reduce((sum, item) => sum + item.percent, 0) / taskReport.value.length) : 0);
const taskHigh = computed(() => taskReport.value.filter((item) => item.percent >= 80).length);
const taskLow = computed(() => taskReport.value.filter((item) => item.percent < 50).length);
const lateCount = computed(() => taskReport.value.filter((item) => item.percent < 80).length);
const onTimePercent = computed(() => taskReport.value.length ? Math.round((taskReport.value.filter((item) => item.percent >= 80).length / taskReport.value.length) * 100) : 0);

const sampleTasks = [
  { id: "math-1", title: "Matematica Basica - Suma", description: "Ejercicios de suma y conceptos basicos.", assignments: [{ studentId: "s1", completedAt: "2026-02-01T10:00:00Z" }, { studentId: "s2", completedAt: null }, { studentId: "s3", completedAt: "2026-02-02T12:30:00Z" }] },
  { id: "math-2", title: "Matematica Basica - Resta", description: "Problemas de resta y practica dirigida.", assignments: [{ studentId: "s1", completedAt: null }, { studentId: "s2", completedAt: null }, { studentId: "s3", completedAt: "2026-02-03T09:15:00Z" }] }
];
const displayTasks = computed(() => (tasks.value && tasks.value.length ? tasks.value : sampleTasks));

onMounted(async () => {
  await loadUsers();
  await loadStudents();
  await refreshTasks(docenteId.value);
  buildTaskReport();
});

watch(students, buildTaskReport);
</script>


