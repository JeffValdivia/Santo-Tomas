"use client";

import RandomStudents from "@/components/dashboard/RandomStudents";
import ThesisLayout from "@/components/dashboard/ThesisLayout";

export default function RiesgoPage() {
  return (
    <ThesisLayout>
      <RandomStudents title="Estudiantes en Riesgo" />
    </ThesisLayout>
  );
}
