<template>
  <div>
    <header class="header">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div class="title">Santo Tomas | Monitoreo Académico</div>
      </div>
    </header>
    <main>
      <div class="container">
        <p v-if="user" class="muted" style="margin-top: 0;">
          Sesión activa: {{ user.name }} ({{ user.role }})
        </p>
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup>
const user = useState("auth-user", () => null);
const route = useRoute();

const refreshUser = async () => {
  try {
    const res = await $fetch("/api/auth/me");
    user.value = res.user || null;
  } catch {
    user.value = null;
  }
};

onMounted(refreshUser);
watch(() => route.fullPath, refreshUser);
</script>


