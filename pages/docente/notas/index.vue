<template>
  <DocenteMenuLayout>
    <div class="grid cols-2">
      <section class="card">
        <h2>Registro de notas</h2>
        <p class="badge">Carga de calificaciones</p>

        <div class="card" style="padding: 16px; margin-top: 16px;">
          <h3>Registrar nota</h3>
          <form class="grid" @submit.prevent="handleGradeSubmit">
            <select v-model="gradeForm.studentId" class="select" required>
              <option value="">Alumno</option>
              <option v-for="student in students" :key="student.id" :value="student.id">{{ student.name }}</option>
            </select>
            <input v-model="gradeForm.score" class="input" type="number" min="0" max="20" placeholder="Nota" required />
            <select v-model="gradeForm.taskId" class="select">
              <option value="">Sin tÁrea asociada</option>
              <option v-for="task in tasks" :key="task.id" :value="task.id">{{ task.title }}</option>
            </select>
            <textÁrea v-model="gradeForm.comment" class="textÁrea" placeholder="Comentario" />
            <button class="button" type="submit">Guardar nota</button>
          </form>
          <p v-if="status" style="color: var(--muted); margin-top: 8px;">{{ status }}</p>
        </div>
      </section>
    </div>
  </DocenteMenuLayout>
</template>

<script setup>
definePageMeta({ middleware: "role" });
import DocenteMenuLayout from "~/components/layout/DocenteMenuLayout.vue";

const initialGrade = { studentId: "", score: "", comment: "", taskId: "" };
const gradeForm = ref({ ...initialGrade });
const status = ref("");

const { students, tasks, docenteId, loadUsers, loadStudents, refreshTasks } = useDocenteBaseData();

const handleGradeSubmit = async () => {
  if (!docenteId.value) {
    status.value = "Selecciona un docente";
    return;
  }

  status.value = "Guardando nota...";
  try {
    await $fetch("/api/grades", {
      method: "POST",
      body: {
        ...gradeForm.value,
        createdById: docenteId.value
      }
    });

    gradeForm.value = { ...initialGrade };
    status.value = "Nota registrada";
  } catch {
    status.value = "Error al guardar nota";
  }
};

onMounted(async () => {
  await loadUsers();
  await loadStudents();
  await refreshTasks(docenteId.value);
});
</script>


