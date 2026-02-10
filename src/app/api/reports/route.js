import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const average = (values) => {
  if (!values.length) return null;
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Math.round((sum / values.length) * 100) / 100;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const inRange = (value) => {
    if (!dateFrom && !dateTo) return true;
    const current = new Date(value);
    if (dateFrom && current < new Date(dateFrom)) return false;
    if (dateTo && current > new Date(dateTo)) return false;
    return true;
  };

  const students = await prisma.user.findMany({
    where: { role: "ALUMNO" },
    orderBy: { name: "asc" },
    include: {
      gradesReceived: true,
      assignments: true,
      attendanceRecords: true,
    },
  });

  const studentReports = students.map((student) => {
    const filteredGrades = student.gradesReceived.filter((grade) => inRange(grade.createdAt));
    const scores = filteredGrades.map((grade) => grade.score);
    const avg = average(scores);
    const filteredAttendance = student.attendanceRecords.filter((item) => inRange(item.date));
    const attendanceTotal = filteredAttendance.length;
    const attendancePresent = filteredAttendance.filter(
      (item) => item.status === "PRESENT" || item.status === "LATE"
    ).length;
    const attendanceRate = attendanceTotal ? attendancePresent / attendanceTotal : null;
    const filteredAssignments = student.assignments.filter((item) => inRange(item.assignedAt));
    const assignmentsTotal = filteredAssignments.length;
    const assignmentsCompleted = filteredAssignments.filter((item) => item.completedAt).length;
    const completionRate = assignmentsTotal ? assignmentsCompleted / assignmentsTotal : null;

    const risk =
      (avg !== null && avg < 11) ||
      (attendanceRate !== null && attendanceRate < 0.8) ||
      (completionRate !== null && completionRate < 0.6);

    return {
      id: student.id,
      name: student.name,
      average: avg,
      attendanceRate,
      completionRate,
      risk,
    };
  });

  const overallAverage = average(studentReports.map((item) => item.average).filter((val) => val !== null));
  const passRate = (() => {
    const withAvg = studentReports.filter((item) => item.average !== null);
    if (!withAvg.length) return null;
    const passed = withAvg.filter((item) => item.average >= 11).length;
    return passed / withAvg.length;
  })();
  const attendanceRate = average(
    studentReports.map((item) => item.attendanceRate).filter((val) => val !== null)
  );
  const completionRate = average(
    studentReports.map((item) => item.completionRate).filter((val) => val !== null)
  );

  const attendanceSummary = students.reduce(
    (acc, student) => {
      const filtered = student.attendanceRecords.filter((item) => inRange(item.date));
      acc.total += filtered.length;
      acc.present += filtered.filter((item) => item.status === "PRESENT").length;
      acc.late += filtered.filter((item) => item.status === "LATE").length;
      acc.absent += filtered.filter((item) => item.status === "ABSENT").length;
      return acc;
    },
    { total: 0, present: 0, late: 0, absent: 0 }
  );

  return NextResponse.json({
    dateFrom,
    dateTo,
    overallAverage,
    passRate,
    attendanceRate,
    completionRate,
    attendanceSummary,
    students: studentReports,
  });
}
