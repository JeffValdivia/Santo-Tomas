import { School, Store } from "lucide-react";
import { Outlet } from "react-router";

export function MainLayout() {

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex flex-row sticky w-full border-b bg-gradient-to-b from-green-600 to-green-800 
                        items-center justify-center pt-0.5 pb-0.5">        
            <School className="h-6 w-6 text-white m-5" />
            <h1 className="text-xl font-bold text-white">
              Institución Educativa Santo Tomas de Aquino - CIRCA</h1>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
