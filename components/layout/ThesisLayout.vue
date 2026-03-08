<template>
  <div class="thesis-shell">
    <aside class="thesis-sidebar">
      <h4>Menu Tesis</h4>
      <nav class="thesis-menu">
        <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        <NuxtLink to="/dashboard/logro">Niveles de Logro por Área</NuxtLink>
        <NuxtLink to="/dashboard/tardanzas">Tardanzas</NuxtLink>
        <NuxtLink to="/dashboard/inasistencias">Inasistencias</NuxtLink>
        <NuxtLink to="/dashboard/riesgo">Estudiantes en Riesgo</NuxtLink>
        <NuxtLink to="/dashboard/indicadores">Indicadores Académicos</NuxtLink>
        <NuxtLink to="/dashboard/seguimiento">Seguimiento y Alertas</NuxtLink>
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


