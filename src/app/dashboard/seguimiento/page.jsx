"use client";

import RandomStudents from "@/components/dashboard/RandomStudents";
import ThesisLayout from "@/components/dashboard/ThesisLayout";

export default function SeguimientoPage() {
  return (
    <ThesisLayout>
      <RandomStudents title="Seguimiento y Alertas" />
    </ThesisLayout>
  );
}
