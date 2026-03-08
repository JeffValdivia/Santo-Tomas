<template>
  <div class="grid">
    <section class="card" id="tablero">
      <h2>Tablero directivo</h2>
      <p class="badge">Alertas y comparativos</p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px;">
        <label style="min-width: 200px;">Desde<input v-model="range.dateFrom" class="input" type="date" /></label>
        <label style="min-width: 200px;">Hasta<input v-model="range.dateTo" class="input" type="date" /></label>
        <div style="display: flex; align-items: flex-end; gap: 8px;">
          <button class="button" type="button" @click="loadReport(range)">Aplicar filtro</button>
          <button class="button secondary" type="button" @click="resetRange">Limpiar</button>
        </div>
      </div>
      <div v-if="report" class="grid cols-3" style="margin-top: 16px;">
        <div class="card" style="padding: 14px;"><strong>Promedio general</strong><div style="font-size: 22px;">{{ report.overallAverage ?? '-' }}</div></div>
        <div class="card" style="padding: 14px;"><strong>Tasa de aprobados</strong><div style="font-size: 22px;">{{ report.passRate !== null ? Math.round(report.passRate * 100) + '%' : '-' }}</div></div>
        <div class="card" style="padding: 14px;"><strong>Asistencia promedio</strong><div style="font-size: 22px;">{{ report.attendanceRate !== null ? Math.round(report.attendanceRate * 100) + '%' : '-' }}</div></div>
      </div>
      <p v-else class="muted" style="margin-top: 12px;">{{ status }}</p>
    </section>

    <section class="card" id="alertas">
      <h3>Alertas de riesgo</h3>
      <p class="muted">Estudiantes con promedio &lt; 11, asistencia &lt; 80% o tÁreas &lt; 60%</p>
      <table class="table">
        <thead><tr><th>Estudiante</th><th>Promedio</th><th>Asistencia</th><th>TÁreas</th></tr></thead>
        <tbody>
          <tr v-for="student in riskStudents" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.average ?? '-' }}</td>
            <td>{{ student.attendanceRate !== null ? Math.round(student.attendanceRate * 100) + '%' : '-' }}</td>
            <td>{{ student.completionRate !== null ? Math.round(student.completionRate * 100) + '%' : '-' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!riskStudents.length" class="muted">No hay alertas por ahora.</p>
    </section>

    <section class="card" id="comparativo">
      <h3>Comparativo por periodos</h3>
      <div class="grid cols-2" style="margin-top: 12px;">
        <div class="card" style="padding: 14px;">
          <strong>Periodo base</strong>
          <label>Desde<input v-model="comparison.base.dateFrom" class="input" type="date" /></label>
          <label>Hasta<input v-model="comparison.base.dateTo" class="input" type="date" /></label>
        </div>
        <div class="card" style="padding: 14px;">
          <strong>Periodo actual</strong>
          <label>Desde<input v-model="comparison.current.dateFrom" class="input" type="date" /></label>
          <label>Hasta<input v-model="comparison.current.dateTo" class="input" type="date" /></label>
        </div>
      </div>
      <div style="margin-top: 12px;"><button class="button" type="button" @click="loadComparison">Comparar</button></div>

      <div v-if="compareResult" class="grid cols-3" style="margin-top: 16px;">
        <div class="card" style="padding: 14px;"><strong>Promedio</strong><div>Base: {{ compareResult.base.overallAverage ?? '-' }} / Actual: {{ compareResult.current.overallAverage ?? '-' }}</div></div>
        <div class="card" style="padding: 14px;"><strong>Tasa aprobados</strong><div>Base: {{ compareResult.base.passRate !== null ? Math.round(compareResult.base.passRate * 100) + '%' : '-' }} / Actual: {{ compareResult.current.passRate !== null ? Math.round(compareResult.current.passRate * 100) + '%' : '-' }}</div></div>
        <div class="card" style="padding: 14px;"><strong>Asistencia</strong><div>Base: {{ compareResult.base.attendanceRate !== null ? Math.round(compareResult.base.attendanceRate * 100) + '%' : '-' }} / Actual: {{ compareResult.current.attendanceRate !== null ? Math.round(compareResult.current.attendanceRate * 100) + '%' : '-' }}</div></div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "role" });

const emptyRange = { dateFrom: "", dateTo: "" };
const report = ref(null);
const status = ref("");
const range = ref({ ...emptyRange });
const comparison = ref({ base: { ...emptyRange }, current: { ...emptyRange } });
const compareResult = ref(null);

const loadReport = async (value = {}) => {
  status.value = "Cargando tablero...";
  const params = new URLSearchParams();
  if (value.dateFrom) params.append("dateFrom", value.dateFrom);
  if (value.dateTo) params.append("dateTo", value.dateTo);
  try {
    report.value = await $fetch(`/api/reports${params.toString() ? `?${params.toString()}` : ""}`);
    status.value = "";
  } catch {
    status.value = "No se pudo cargar el reporte";
  }
};

const loadComparison = async () => {
  const paramsA = new URLSearchParams();
  if (comparison.value.base.dateFrom) paramsA.append("dateFrom", comparison.value.base.dateFrom);
  if (comparison.value.base.dateTo) paramsA.append("dateTo", comparison.value.base.dateTo);
  const paramsB = new URLSearchParams();
  if (comparison.value.current.dateFrom) paramsB.append("dateFrom", comparison.value.current.dateFrom);
  if (comparison.value.current.dateTo) paramsB.append("dateTo", comparison.value.current.dateTo);

  try {
    const [base, current] = await Promise.all([
      $fetch(`/api/reports${paramsA.toString() ? `?${paramsA.toString()}` : ""}`),
      $fetch(`/api/reports${paramsB.toString() ? `?${paramsB.toString()}` : ""}`)
    ]);
    compareResult.value = { base, current };
  } catch {
    compareResult.value = null;
  }
};

const resetRange = async () => {
  range.value = { ...emptyRange };
  await loadReport();
};

const riskStudents = computed(() => report.value?.students?.filter((item) => item.risk) || []);
onMounted(() => loadReport());
</script>


