"use client";

import RandomStudents from "@/components/dashboard/RandomStudents";
import ThesisLayout from "@/components/dashboard/ThesisLayout";

export default function IndicadoresPage() {
  return (
    <ThesisLayout>
      <RandomStudents title="Indicadores Académicos" />
    </ThesisLayout>
  );
}
