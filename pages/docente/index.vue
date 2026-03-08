<template>
  <DocenteMenuLayout>
    <div class="grid cols-2">
      <section class="card">
        <h2>Dashboard Docente</h2>
        <p class="badge">Curso asignado</p>

        <div class="card" style="padding: 16px; margin-top: 12px;">
          <strong>{{ courseInfo.name }}</strong>
          <div style="color: var(--muted); font-size: 12px; margin-top: 4px;">
            Grado: {{ courseInfo.grade }} | Seccion: {{ courseInfo.section }}
          </div>
          <div class="grid cols-2" style="margin-top: 12px; gap: 12px;">
            <div class="card" style="padding: 12px;"><div style="font-size: 12px; color: var(--muted);">Alumnos</div><strong style="font-size: 20px;">{{ courseInfo.students }}</strong></div>
            <div class="card" style="padding: 12px;"><div style="font-size: 12px; color: var(--muted);">Asistencia</div><strong style="font-size: 20px;">{{ courseInfo.attendance }}%</strong></div>
            <div class="card" style="padding: 12px;"><div style="font-size: 12px; color: var(--muted);">TÁreas pendientes</div><strong style="font-size: 20px;">{{ courseInfo.pendingTasks }}</strong></div>
            <div class="card" style="padding: 12px;"><div style="font-size: 12px; color: var(--muted);">Docente</div><strong style="font-size: 14px;">{{ selectedDocenteName }}</strong></div>
          </div>
        </div>
      </section>
    </div>
  </DocenteMenuLayout>
</template>

<script setup>
definePageMeta({ middleware: "role" });
import DocenteMenuLayout from "~/components/layout/DocenteMenuLayout.vue";

const { docentes, docenteId, loadUsers, loadStudents } = useDocenteBaseData();
const courseCatalog = [
  { name: "Matematica", grade: "1ro", section: "A", students: 28, attendance: 92, pendingTasks: 3 },
  { name: "Comunicacion", grade: "2do", section: "B", students: 26, attendance: 88, pendingTasks: 5 },
  { name: "C. Sociales", grade: "3ro", section: "A", students: 30, attendance: 90, pendingTasks: 2 },
  { name: "Ciencia y Tecnologia", grade: "4to", section: "C", students: 27, attendance: 85, pendingTasks: 4 }
];

const selectedIndex = computed(() => docentes.value.findIndex((docente) => docente.id === docenteId.value));
const courseInfo = computed(() => selectedIndex.value >= 0 ? courseCatalog[selectedIndex.value % courseCatalog.length] : courseCatalog[0]);
const selectedDocenteName = computed(() => (docenteId.value ? docentes.value.find((d) => d.id === docenteId.value)?.name : "Selecciona docente"));

onMounted(async () => {
  await loadUsers();
  await loadStudents();
});
</script>


