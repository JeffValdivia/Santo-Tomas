"use client";

import RandomStudents from "@/components/dashboard/RandomStudents";
import ThesisLayout from "@/components/dashboard/ThesisLayout";

export default function InasistenciasPage() {
  return (
    <ThesisLayout>
      <RandomStudents title="Inasistencias" />
    </ThesisLayout>
  );
}
