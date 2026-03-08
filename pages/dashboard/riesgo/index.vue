<template><ThesisLayout><RandomStudentsTable title="Estudiantes en Riesgo" /></ThesisLayout></template>
<script setup>definePageMeta({ middleware: "role" }); import ThesisLayout from "~/components/layout/ThesisLayout.vue"; import RandomStudentsTable from "~/components/dashboard/RandomStudentsTable.vue";</script>


