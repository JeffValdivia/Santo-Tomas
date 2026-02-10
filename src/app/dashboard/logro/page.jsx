"use client";

import RandomStudents from "@/components/dashboard/RandomStudents";
import ThesisLayout from "@/components/dashboard/ThesisLayout";

export default function LogroPage() {
  return (
    <ThesisLayout>
      <RandomStudents title="Niveles de Logro por Área" />
    </ThesisLayout>
  );
}
