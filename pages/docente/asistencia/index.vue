<template>
  <DocenteMenuLayout>
    <div class="grid cols-2">
      <section class="card">
        <h2>Registrar asistencia</h2>
        <p class="badge">Lista aleatoria con checks</p>

        <div class="card" style="padding: 16px; margin-top: 16px;">
          <h3>Lista de asistencia</h3>
          <form class="grid" @submit.prevent="handleAttendanceSubmit">
            <input v-model="attendanceDate" class="input" type="date" required />
            <div>
              <strong>Lista aleatoria de alumnos</strong>
              <div class="grid" style="margin-top: 8px;">
                <label v-for="student in attendanceList" :key="student.id" style="display: flex; gap: 8px; align-items: center;">
                  <input type="checkbox" :checked="student.present" @change="toggleAttendance(student.id)" />
                  <span>{{ student.name }}</span>
                  <span style="margin-left: auto; font-size: 12px; color: var(--muted);">{{ student.present ? "Presente" : "Inasistente" }}</span>
                </label>
              </div>
            </div>
            <div style="font-size: 12px; color: var(--muted);">Marcados presentes: {{ attendancePresentCount }} de {{ attendanceList.length }}</div>
            <button class="button" type="submit">Guardar asistencia</button>
            <span v-if="attendanceStatus" style="color: var(--muted);">{{ attendanceStatus }}</span>
          </form>
        </div>
      </section>
    </div>
  </DocenteMenuLayout>
</template>

<script setup>
definePageMeta({ middleware: "role" });
import DocenteMenuLayout from "~/components/layout/DocenteMenuLayout.vue";
import { fallbackStudents, shuffleList } from "~/composables/useDocenteBaseData";

const { students, docenteId, loadUsers, loadStudents } = useDocenteBaseData();
const attendanceDate = ref("");
const attendanceList = ref([]);
const attendanceStatus = ref("");

const fillAttendance = () => {
  const sourceStudents = students.value.length ? students.value : fallbackStudents;
  const shuffled = shuffleList(sourceStudents);
  const sample = shuffled.slice(0, Math.min(8, shuffled.length));

  attendanceList.value = sample.map((student) => ({
    id: student.id,
    name: student.name,
    present: Math.random() > 0.2
  }));
};

const toggleAttendance = (studentId) => {
  attendanceList.value = attendanceList.value.map((student) =>
    student.id === studentId ? { ...student, present: !student.present } : student
  );
};

const handleAttendanceSubmit = async () => {
  if (!docenteId.value) {
    attendanceStatus.value = "Selecciona un docente";
    return;
  }
  if (!attendanceDate.value) {
    attendanceStatus.value = "Selecciona una fecha";
    return;
  }

  attendanceStatus.value = "Registrando asistencia...";
  try {
    await Promise.all(
      attendanceList.value.map((student) =>
        $fetch("/api/attendance", {
          method: "POST",
          body: {
            studentId: student.id,
            recordedById: docenteId.value,
            status: student.present ? "PRESENT" : "ABSENT",
            date: attendanceDate.value,
            note: ""
          }
        })
      )
    );

    attendanceStatus.value = `Asistencia registrada para ${attendanceList.value.length} alumnos`;
  } catch {
    attendanceStatus.value = "Error al registrar asistencia";
  }
};

const attendancePresentCount = computed(() => attendanceList.value.filter((student) => student.present).length);

onMounted(async () => {
  await loadUsers();
  await loadStudents();
  fillAttendance();
});

watch(students, fillAttendance);
</script>


