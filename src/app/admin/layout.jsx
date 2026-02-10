"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">{children}</main>
    </div>
  );
}
