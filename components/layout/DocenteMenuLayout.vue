<template>
  <div class="thesis-shell">
    <aside class="thesis-sidebar">
      <h4>Menu Docente</h4>
      <nav class="thesis-menu">
        <NuxtLink to="/docente">Panel Docente</NuxtLink>
        <NuxtLink to="/docente/notas">Registro de notas</NuxtLink>
        <NuxtLink to="/docente/asistencia">Registrar asistencia</NuxtLink>
        <NuxtLink to="/docente/consolidado">Consolidado de asistencias</NuxtLink>
        <NuxtLink to="/docente/reporte">Reporte de tÁreas</NuxtLink>
        <button type="button" class="thesis-menu-button thesis-logout" @click="handleLogout">
          Cerrar sesión
        </button>
      </nav>
    </aside>
    <div class="dashboard-shell">
      <slot />
    </div>
  </div>
</template>

<script setup>
const handleLogout = async () => {
  await $fetch("/api/auth/logout", { method: "POST" });
  await navigateTo("/");
};
</script>


