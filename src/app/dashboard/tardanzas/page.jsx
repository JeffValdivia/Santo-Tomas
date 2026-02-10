"use client";

import RandomStudents from "@/components/dashboard/RandomStudents";
import ThesisLayout from "@/components/dashboard/ThesisLayout";

export default function TardanzasPage() {
  return (
    <ThesisLayout>
      <RandomStudents title="Tardanzas" />
    </ThesisLayout>
  );
}
