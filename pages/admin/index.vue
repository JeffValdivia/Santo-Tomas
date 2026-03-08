<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="profile">
        <div class="avatar">A</div>
        <strong>Admin</strong>
        <span style="font-size: 12px; opacity: 0.8;">Rango: Administrador</span>
      </div>
      <div class="menu">
        <div class="menu-group">
          <button class="menu-title" type="button" @click="toggleMenu('docente')">
            <span>Docente</span>
            <span>{{ openMenu === 'docente' ? '?' : '?' }}</span>
          </button>
          <div v-if="openMenu === 'docente'" class="menu-links">
            <button type="button" @click="activeView = 'docente-lista'">Lista Docentes (Edit, Delete)</button>
            <button type="button" @click="activeView = 'docente-registro'">Agregar Docente (Asignatura, permisos)</button>
          </div>
        </div>
        <div class="menu-group">
          <button class="menu-title" type="button" @click="toggleMenu('estudiante')">
            <span>Estudiante</span>
            <span>{{ openMenu === 'estudiante' ? '?' : '?' }}</span>
          </button>
          <div v-if="openMenu === 'estudiante'" class="menu-links">
            <button type="button" @click="activeView = 'estudiante-lista'">Lista Estudiantes (Edit, Delete)</button>
            <button type="button" @click="activeView = 'estudiante-registro'">Agregar Estudiante (Asignaturas, permisos)</button>
          </div>
        </div>
        <div class="menu-group">
          <button class="menu-title" type="button" @click="toggleMenu('curso')">
            <span>Curso</span>
            <span>{{ openMenu === 'curso' ? '?' : '?' }}</span>
          </button>
          <div v-if="openMenu === 'curso'" class="menu-links">
            <button type="button" @click="activeView = 'curso-lista'">Lista Cursos (Edit, Delete)</button>
            <button type="button" @click="activeView = 'curso-registro'">Agregar Curso (Asignaturas, permisos)</button>
          </div>
        </div>
      </div>
    </aside>

    <div class="admin-main">
      <div class="admin-topbar">INSTITUCION EDUCATIVA SANTO TOMAS DE AQUINO - CIRCA AREQUIPA</div>
      <div class="admin-content">
        <div class="admin-grid">
          <section v-if="activeView === 'docente-registro'" class="admin-card" id="registro">
            <h2 class="admin-section-title">Registro de Docente</h2>
            <form class="admin-form" @submit.prevent="handleSubmit">
              <label>Nombres<input v-model="form.name" class="input" required /></label>
              <label>Apellidos<input v-model="extraForm.lastName" class="input" /></label>
              <label>Fecha de Nacimiento<input v-model="extraForm.birthDate" class="input" type="date" /></label>
              <label>
                Sexo
                <select v-model="extraForm.gender" class="select">
                  <option value="">Seleccione sexo</option>
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                </select>
              </label>
              <label>Asignaturas<input v-model="extraForm.subjects" class="input" placeholder="Ingrese asignaturas separadas por coma" /></label>
              <label>Email<input v-model="form.email" class="input" type="email" required /></label>
              <label>Contraseña<input v-model="form.password" class="input" type="password" required /></label>
              <label>
                Rol
                <select v-model="form.role" class="select">
                  <option value="DOCENTE">Docente</option>
                  <option value="ADMIN">Admin</option>
                  <option value="ALUMNO">Alumno</option>
                </select>
              </label>
              <label>Teléfono WhatsApp (con prefijo país)<input v-model="form.phone" class="input" placeholder="+51999999999" /></label>
              <button class="button" type="submit">Registrar</button>
              <span v-if="status" style="color: var(--muted);">{{ status }}</span>
            </form>
          </section>

          <section v-if="activeView === 'docente-lista' || activeView === 'estudiante-lista'" class="card" id="usuarios">
            <h2>Usuarios registrados</h2>
            <p class="badge">Docentes y estudiantes</p>
            <div class="grid" style="margin-top: 16px;">
              <div v-for="user in users" :key="user.id" class="card" style="padding: 14px;">
                <strong>{{ user.name }}</strong>
                <div style="color: var(--muted);">{{ user.email }}</div>
                <div style="font-size: 12px;">{{ user.role }}</div>
                <div style="font-size: 12px;">{{ user.phone || "Sin Teléfono" }}</div>
              </div>
            </div>
          </section>

          <section v-if="activeView === 'estudiante-registro'" class="admin-card" id="registro-estudiante">
            <h2 class="admin-section-title">Registro de Estudiante</h2>
            <form class="admin-form" @submit.prevent="handleSubmit">
              <label>Nombres<input v-model="form.name" class="input" required /></label>
              <label>Apellidos<input v-model="extraForm.lastName" class="input" /></label>
              <label>Fecha de Nacimiento<input v-model="extraForm.birthDate" class="input" type="date" /></label>
              <label>
                Sexo
                <select v-model="extraForm.gender" class="select">
                  <option value="">Seleccione sexo</option>
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                </select>
              </label>
              <label>Asignaturas<input v-model="extraForm.subjects" class="input" placeholder="Ingrese asignaturas separadas por coma" /></label>
              <label>Email<input v-model="form.email" class="input" type="email" required /></label>
              <label>Contraseña<input v-model="form.password" class="input" type="password" required /></label>
              <label>
                Rol
                <select v-model="form.role" class="select">
                  <option value="ALUMNO">Alumno</option>
                  <option value="DOCENTE">Docente</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              <label>Teléfono WhatsApp (con prefijo país)<input v-model="form.phone" class="input" placeholder="+51999999999" /></label>
              <button class="button" type="submit">Registrar</button>
              <span v-if="status" style="color: var(--muted);">{{ status }}</span>
            </form>
          </section>

          <section v-if="activeView === 'curso-lista' || activeView === 'curso-registro'" class="card" id="reportes">
            <h2>Reportes institucionales</h2>
            <p class="badge">Indicadores Académicos</p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px;">
              <label style="min-width: 200px;">Desde<input v-model="dateFrom" class="input" type="date" /></label>
              <label style="min-width: 200px;">Hasta<input v-model="dateTo" class="input" type="date" /></label>
              <div style="display: flex; align-items: flex-end; gap: 8px;">
                <button class="button" type="button" @click="loadReport({ dateFrom, dateTo })">Aplicar filtro</button>
                <button class="button secondary" type="button" @click="resetFilter">Limpiar</button>
              </div>
            </div>

            <div v-if="report" class="grid cols-3" style="margin-top: 12px;">
              <div class="card" style="padding: 14px;"><strong>Promedio general</strong><div style="font-size: 22px;">{{ report.overallAverage ?? '-' }}</div><div class="muted">Escala 0 - 20</div></div>
              <div class="card" style="padding: 14px;"><strong>Tasa de aprobados</strong><div style="font-size: 22px;">{{ report.passRate !== null ? Math.round(report.passRate * 100) + '%' : '-' }}</div><div class="muted">Promedio >= 11</div></div>
              <div class="card" style="padding: 14px;"><strong>Asistencia promedio</strong><div style="font-size: 22px;">{{ report.attendanceRate !== null ? Math.round(report.attendanceRate * 100) + '%' : '-' }}</div><div class="muted">Presente + Tarde</div></div>
            </div>
            <p v-else class="muted" style="margin-top: 12px;">{{ reportStatus }}</p>

            <div v-if="report" style="margin-top: 20px;">
              <div class="grid cols-3">
                <div class="card" style="padding: 14px;"><strong>Presente</strong><div style="font-size: 22px;">{{ report.attendanceSummary.present }}</div></div>
                <div class="card" style="padding: 14px;"><strong>Tarde</strong><div style="font-size: 22px;">{{ report.attendanceSummary.late }}</div></div>
                <div class="card" style="padding: 14px;"><strong>Inasistente</strong><div style="font-size: 22px;">{{ report.attendanceSummary.absent }}</div></div>
              </div>
              <h3>Detalle por estudiante</h3>
              <table class="table">
                <thead><tr><th>Estudiante</th><th>Promedio</th><th>Asistencia</th><th>TÁreas</th><th>Riesgo</th></tr></thead>
                <tbody>
                  <tr v-for="student in report.students" :key="student.id">
                    <td>{{ student.name }}</td>
                    <td>{{ student.average ?? '-' }}</td>
                    <td>{{ student.attendanceRate !== null ? Math.round(student.attendanceRate * 100) + '%' : '-' }}</td>
                    <td>{{ student.completionRate !== null ? Math.round(student.completionRate * 100) + '%' : '-' }}</td>
                    <td>{{ student.risk ? 'En riesgo' : 'Normal' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "role" });

const emptyForm = { name: "", email: "", role: "ALUMNO", phone: "", password: "" };
const users = ref([]);
const form = ref({ ...emptyForm });
const extraForm = ref({ lastName: "", birthDate: "", gender: "", subjects: "" });
const status = ref("");
const report = ref(null);
const reportStatus = ref("");
const dateFrom = ref("");
const dateTo = ref("");
const openMenu = ref("docente");
const activeView = ref("docente-registro");

const toggleMenu = (menu) => {
  openMenu.value = openMenu.value === menu ? "" : menu;
};

const loadUsers = async () => {
  users.value = await $fetch("/api/users");
};

const loadReport = async (range = {}) => {
  reportStatus.value = "Cargando reportes...";
  const params = new URLSearchParams();
  if (range.dateFrom) params.append("dateFrom", range.dateFrom);
  if (range.dateTo) params.append("dateTo", range.dateTo);
  const query = params.toString();

  try {
    report.value = await $fetch(`/api/reports${query ? `?${query}` : ""}`);
    reportStatus.value = "";
  } catch {
    reportStatus.value = "No se pudo cargar reportes";
  }
};

const handleSubmit = async () => {
  status.value = "Guardando...";
  try {
    await $fetch("/api/users", { method: "POST", body: form.value });
    form.value = { ...emptyForm };
    status.value = "Usuario creado";
    await loadUsers();
  } catch {
    status.value = "Error al crear usuario";
  }
};

const resetFilter = async () => {
  dateFrom.value = "";
  dateTo.value = "";
  await loadReport();
};

onMounted(async () => {
  await loadUsers();
  await loadReport();
});
</script>


