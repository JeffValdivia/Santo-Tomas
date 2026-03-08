<template>
  <DocenteMenuLayout>
    <div class="grid cols-2">
      <section class="card" style="grid-column: 1 / -1;">
        <h2>Consolidado de asistencias</h2>
        <p class="badge">Inasistencias y métricas</p>

        <div class="card" style="padding: 16px; margin-top: 16px;">
          <h3>Resumen por alumno</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; margin-top: 8px;">
            <div v-for="item in consolidatedAttendance" :key="item.id" class="card" style="padding: 12px;">
              <strong>{{ item.name }}</strong>
              <div style="font-size: 12px; color: var(--muted);">Inasistencias: {{ item.absences }} | Tardanzas: {{ item.lates }} | Presentes: {{ item.presents }}</div>
              <div style="margin-top: 6px;">
                <div style="font-size: 12px;">Asistencia: {{ item.attendancePercent }}%</div>
                <div style="height: 8px; border-radius: 999px; background: rgba(0,0,0,0.08); overflow: hidden; margin-top: 4px;">
                  <div :style="{ width: `${item.attendancePercent}%`, height: '100%', background: '#16a34a' }" />
                </div>
              </div>
            </div>
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

const { students, loadUsers, loadStudents } = useDocenteBaseData();
const consolidatedAttendance = ref([]);

const buildConsolidated = () => {
  const sourceStudents = students.value.length ? students.value : fallbackStudents;
  const shuffled = shuffleList(sourceStudents);
  const sample = shuffled.slice(0, Math.min(10, shuffled.length));

  consolidatedAttendance.value = sample.map((student) => {
    const absences = Math.floor(Math.random() * 6);
    const lates = Math.floor(Math.random() * 4);
    const presents = 18 + Math.floor(Math.random() * 8);
    const total = absences + lates + presents;
    const attendancePercent = total ? Math.round((presents / total) * 100) : 0;
    return { id: student.id, name: student.name, absences, lates, presents, attendancePercent };
  });
};

onMounted(async () => {
  await loadUsers();
  await loadStudents();
  buildConsolidated();
});

watch(students, buildConsolidated);
</script>


