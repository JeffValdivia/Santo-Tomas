<template>
  <div class="thesis-shell">
    <aside class="thesis-sidebar">
      <h4>Menu Alumno</h4>
      <nav class="thesis-menu">
        <NuxtLink to="/alumno">Panel Alumno</NuxtLink>
        <NuxtLink to="/alumno#tÁreas">TÁreas asignadas</NuxtLink>
        <NuxtLink to="/alumno#notas">Notas y comentarios</NuxtLink>
        <NuxtLink to="/alumno#asistencia">Asistencia</NuxtLink>
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


