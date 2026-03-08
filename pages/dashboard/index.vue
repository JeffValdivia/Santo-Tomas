<template>
  <ThesisLayout>
    <section class="dashboard-topbar">
      <div class="title">
        <span>Panel</span>
        <div>
          <div>Sistema de Monitoreo Académico</div>
          <div style="font-size: 12px; opacity: 0.8;">IE Santo Tomas de Aquino - Circa, Arequipa</div>
        </div>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <span style="font-size: 12px; opacity: 0.8;">2025</span>
      </div>
    </section>

    <section class="dashboard-filters">
      <select class="select"><option>Anio: 2025</option></select>
      <select class="select"><option>Grado: 1ro</option></select>
      <select class="select"><option>Seccion: A</option></select>
      <select class="select"><option>Curso: Todos</option></select>
      <select class="select"><option>Bimestre: II</option></select>
      <input class="input" placeholder="Buscar estudiante..." />
    </section>

    <section class="dashboard-cards" id="indicadores">
      <div class="stat-card"><div>Promedio General</div><div class="value">{{ metrics.promedio }}</div></div>
      <div class="stat-card"><div>Tasa de Aprobacion</div><div class="value">{{ metrics.aprobacion }}%</div></div>
      <div class="stat-card warning"><div>En Riesgo Académico</div><div class="value">{{ metrics.riesgo }}%</div></div>
      <div class="stat-card"><div>Asistencia Promedio</div><div class="value">{{ metrics.asistencia }}%</div></div>
      <div class="stat-card"><div>Tardanzas Promedio</div><div class="value">{{ metrics.tardanzas }}</div></div>
      <div class="stat-card"><div>Cumplimiento de TÁreas</div><div class="value">{{ metrics.tÁreas }}%</div></div>
    </section>

    <section class="chart-grid">
      <div class="chart-card" id="logro">
        <h3>Niveles de Logro por Área</h3>
        <table class="table">
          <thead><tr><th>Área</th><th>AD</th><th>A</th><th>B</th><th>C</th></tr></thead>
          <tbody>
            <tr v-for="row in logroData" :key="row.Área">
              <td>{{ row.Área }}</td>
              <td>{{ row.AD }}</td>
              <td>{{ row.A }}</td>
              <td>{{ row.B }}</td>
              <td>{{ row.C }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="chart-card" id="tardanzas">
        <h3>Tardanzas e Inasistencias</h3>
        <div class="grid cols-2">
          <div>
            <strong>Tardanzas</strong>
            <ul class="metric-list">
              <li v-for="item in tardanzas" :key="item.label"><span>{{ item.label }}</span><span>{{ item.value }}%</span></li>
            </ul>
          </div>
          <div>
            <strong>Inasistencias</strong>
            <ul class="metric-list">
              <li v-for="item in inasistencias" :key="item.label"><span>{{ item.label }}</span><span>{{ item.value }}%</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="risk-table" id="riesgo">
      <table>
        <thead><tr><th>Alumno</th><th>Curso</th><th>Promedio</th><th>Asistencia</th><th>Tardanzas</th><th>TÁreas</th><th>Motivo</th><th>Accion</th></tr></thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.alumno }}</td><td>{{ row.curso }}</td><td>{{ row.promedio }}</td><td>{{ row.asistencia }}%</td><td>{{ row.tardanzas }}</td><td>{{ row.tÁreas }}%</td><td>{{ row.motivo }}</td><td><button class="button secondary">Ver Ficha</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="risk-table" id="seguimiento">
      <table>
        <thead><tr><th>Alerta</th><th>Motivo</th><th>Área</th><th>Accion</th></tr></thead>
        <tbody>
          <tr v-for="(row, index) in riesgo" :key="index">
            <td>{{ row.alumno }}</td><td>{{ row.motivo }}</td><td>{{ row.Área }}</td><td><button class="button secondary">Ver ficha</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  </ThesisLayout>
</template>

<script setup>
definePageMeta({ middleware: "role" });
import ThesisLayout from "~/components/layout/ThesisLayout.vue";

const randomBetween = (min, max) => Math.round((Math.random() * (max - min) + min) * 10) / 10;
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const metrics = ref({ promedio: 14.2, aprobacion: 78, riesgo: 12, asistencia: 92, tardanzas: 1.8, tÁreas: 85 });
const rows = ref([]);
const logroData = ref([]);
const tardanzas = ref([]);
const inasistencias = ref([]);
const riesgo = ref([]);

onMounted(() => {
  metrics.value = {
    promedio: randomBetween(9, 18),
    aprobacion: Math.round(randomBetween(60, 95)),
    riesgo: Math.round(randomBetween(5, 25)),
    asistencia: Math.round(randomBetween(70, 98)),
    tardanzas: randomBetween(0.5, 3.2),
    tÁreas: Math.round(randomBetween(50, 95))
  };

  const students = ["Luis Gomez", "Ana Torres", "Carlos Ruiz", "Maria Rojas", "Jose Quispe", "Valeria Paredes"];
  const courses = ["Matematica", "Comunicacion", "C. Sociales", "Ciencia", "Arte"];
  const motivos = ["Bajo rendimiento", "Faltas frecuentes", "TÁreas incumplidas", "Baja asistencia"];

  rows.value = Array.from({ length: 3 }).map((_, index) => ({
    id: index,
    alumno: students[Math.floor(Math.random() * students.length)],
    curso: courses[Math.floor(Math.random() * courses.length)],
    promedio: randomBetween(7, 11.5),
    asistencia: Math.round(randomBetween(60, 85)),
    tardanzas: Math.round(randomBetween(1, 6)),
    tÁreas: Math.round(randomBetween(40, 70)),
    motivo: motivos[Math.floor(Math.random() * motivos.length)]
  }));

  logroData.value = [
    { Área: "Comunicacion", A: randomInt(30, 60), B: randomInt(5, 20), C: randomInt(0, 5), AD: randomInt(5, 15) },
    { Área: "Matematica", A: randomInt(25, 55), B: randomInt(8, 25), C: randomInt(0, 6), AD: randomInt(5, 18) },
    { Área: "C. Sociales", A: randomInt(20, 45), B: randomInt(10, 25), C: randomInt(0, 6), AD: randomInt(5, 18) },
    { Área: "D. Personal", A: randomInt(20, 45), B: randomInt(12, 28), C: randomInt(0, 6), AD: randomInt(5, 18) }
  ];

  tardanzas.value = [
    { label: "0", value: randomInt(40, 60) },
    { label: "1-2", value: randomInt(10, 20) },
    { label: "3-5", value: randomInt(5, 15) },
    { label: "6+", value: randomInt(3, 10) }
  ];

  inasistencias.value = [
    { label: "0", value: randomInt(35, 55) },
    { label: "1-2", value: randomInt(15, 25) },
    { label: "3-5", value: randomInt(5, 12) },
    { label: "6+", value: randomInt(2, 8) }
  ];

  riesgo.value = [
    { alumno: "Luis Gomez", motivo: "Bajo rendimiento", Área: "Matematica" },
    { alumno: "Ana Torres", motivo: "Faltas frecuentes", Área: "C. Sociales" },
    { alumno: "Carlos Ruiz", motivo: "TÁreas incumplidas", Área: "Comunicacion" }
  ];
});
</script>


