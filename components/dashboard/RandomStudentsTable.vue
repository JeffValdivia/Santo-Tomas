<template>
  <div class="dashboard-shell">
    <section class="card">
      <h2>{{ title }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Curso</th>
            <th>Promedio</th>
            <th>Asistencia</th>
            <th>Tardanzas</th>
            <th>TÁreas</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.alumno }}</td>
            <td>{{ row.curso }}</td>
            <td>{{ row.promedio }}</td>
            <td>{{ row.asistencia }}%</td>
            <td>{{ row.tardanzas }}</td>
            <td>{{ row.tÁreas }}%</td>
            <td>{{ row.motivo }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true }
});

const rows = ref([]);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const students = [
  "Luis Gomez", "Ana Torres", "Carlos Ruiz", "Maria Rojas", "Jose Quispe", "Valeria Paredes",
  "Daniela Salas", "Bruno Mena", "Sofia Huaman", "Ivan Rios", "Lucia Campos", "Miguel Soto",
  "Paola Vargas", "Renato Salazar", "Ariana Cruz", "Jorge Lazo", "Carmen Leon", "Mateo Castro",
  "Nadia Flores", "Sebastian Prado"
];
const courses = ["Matematica", "Comunicacion", "C. Sociales", "Ciencia", "Arte"];
const motivos = ["Bajo rendimiento", "Faltas frecuentes", "TÁreas incumplidas", "Baja asistencia"];

onMounted(() => {
  rows.value = Array.from({ length: 20 }).map((_, index) => ({
    id: index,
    alumno: students[index % students.length],
    curso: courses[randomInt(0, courses.length - 1)],
    promedio: randomInt(7, 20),
    asistencia: randomInt(60, 100),
    tardanzas: randomInt(0, 8),
    tÁreas: randomInt(40, 100),
    motivo: motivos[randomInt(0, motivos.length - 1)]
  }));
});
</script>


