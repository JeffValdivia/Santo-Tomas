<template>
  <div class="login-hero">
    <div class="login-overlay" style="grid-template-columns: minmax(320px,420px); justify-content: center;">
      <div class="login-panel">
        <div>
          <div class="login-title">Iniciar sesión</div>
          <div class="login-subtitle">Accede con tu cuenta institucional</div>
        </div>
        <form class="login-form" @submit.prevent="handleSubmit">
          <input v-model="email" class="input" placeholder="Usuario o email" required />
          <input v-model="password" class="input" type="password" placeholder="Contraseña" required />
          <button class="button" type="submit">Iniciar sesión</button>
        </form>
        <span v-if="status" class="muted">{{ status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: [] });

const email = ref("");
const password = ref("");
const status = ref("");

const handleSubmit = async () => {
  status.value = "Ingresando...";
  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value }
    });

    status.value = "Bienvenido";
    if (res.role === "ADMIN") await navigateTo("/dashboard");
    if (res.role === "DOCENTE") await navigateTo("/docente");
    if (res.role === "ALUMNO") await navigateTo("/alumno");
  } catch {
    status.value = "Credenciales inválidas";
  }
};
</script>


