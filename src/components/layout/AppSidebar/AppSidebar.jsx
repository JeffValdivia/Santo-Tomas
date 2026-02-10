"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Bell,
  Library,
  ClipboardList,
  UserCheck,
  Award,
  Clock,
  Building,
  Calculator,
  MessageSquare,
  BarChartIcon as ChartBar,
  User,
  LogOut,
  ChevronDown,
  MoreHorizontal,
  School,
} from "lucide-react"

// 📋 CONFIGURACIÓN DE MENÚ - Estructura de datos para todas las secciones
const menuSections = [
  {
    id: "students",
    title: "Estudiantes",
    icon: GraduationCap,
    subItems: [
      {
        title: "Registro de Estudiantes",
        icon: Users,
        path: "/students/register",
      },
      {
        title: "Lista de Estudiantes",
        icon: UserCheck,
        path: "/students/list",
      },

    ],
  },
  {
    id: "teachers",
    title: "Profesores",
    icon: Users,
    subItems: [
      {
        title: "Registro de Docentes",
        icon: Users,
        path: "/teachers/management",
      },
      {
        title: "Lista de Docentes",
        icon: UserCheck,
        path: "/teachers/schedules",
      },

    ],
  },
  {
    id: "courses",
    title: "Cursos",
    icon: BookOpen,
    subItems: [
      {
        title: "Registrar Curso",
        icon: BookOpen,
        path: "/courses/curriculum",
      },
      {
        title: "Lista de Cursos",
        icon: Building,
        path: "/courses/classrooms",
      },

    ],
  },
  {
    id: "admin",
    title: "Administración",
    icon: Calculator,
    subItems: [
      {
        title: "Pagos y Deudas",
        icon: DollarSign,
        path: "/admin/finances",
      },
      {
        title: "Reportes",
        icon: ChartBar,
        path: "/admin/reports",
      },
    ],
  },
]

const docenteMenuSections = [
  {
    id: "docente",
    title: "Docente",
    icon: ClipboardList,
    subItems: [
      {
        title: "Registro de notas",
        icon: FileText,
        path: "/docente/notas",
      },
      {
        title: "Registrar asistencia",
        icon: UserCheck,
        path: "/docente/asistencia",
      },
      {
        title: "Consolidado de asistencias",
        icon: Calendar,
        path: "/docente/consolidado",
      },
      {
        title: "Reporte de tareas",
        icon: ChartBar,
        path: "/docente/reporte",
      },
    ],
  },
]

function SidebarContentBody({ onItemClick }) {
  const router = useRouter()

  const [user, setUser] = useState(null)

  const role = user?.role || user?.user_metadata?.role || user?.app_metadata?.role
  const resolvedMenuSections = role === "DOCENTE" ? docenteMenuSections : menuSections

  // 🎯 ESTADO PARA CONTROL DE ACORDEÓN - Solo una sección abierta a la vez
  // Inicializa con "students" o "docente" según el rol
  const [openSection, setOpenSection] = useState(role === "DOCENTE" ? "docente" : "students")

  useEffect(() => {
    if (role === "DOCENTE") setOpenSection("docente")
  }, [role])

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        setUser(data?.user || null)
      } catch (error) {
        setUser(null)
      }
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    onItemClick?.()
  }

  // FUNCIÓN PARA MANEJAR EL COMPORTAMIENTO DE ACORDEÓN
  // Si la sección ya está abierta, la cierra. Si no, abre la nueva y cierra las demás
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section)
  }

  // FUNCIÓN PARA RENDERIZAR CADA SECCIÓN DEL MENÚ
  const renderMenuSection = (section) => {
    const IconComponent = section.icon

    return (
      <Collapsible
        key={section.id}
        open={openSection === section.id}
        onOpenChange={() => toggleSection(section.id)}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <IconComponent className="size-4" />
              <span>{section.title}</span>
              {/* Chevron que rota según el estado abierto/cerrado */}
              <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all duration-300">
            <SidebarMenuSub>
              {/* renderizar subitems dinámicamente */}
              {section.subItems.map((subItem, index) => {
                const SubIconComponent = subItem.icon
                return (
                  <SidebarMenuSubItem key={index}>
                    <SidebarMenuSubButton asChild>
                      <Link
                        href={subItem.path}
                        onClick={onItemClick}
                        className="text-white/90 hover:text-white hover:bg-white/10 hover:translate-x-2 transition-all duration-300"
                      >
                        <SubIconComponent className="size-4" />
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    // CONTENEDOR PRINCIPAL CON DEGRADADO VERDE Y LAYOUT FLEX
    // flex-col para distribución vertical, h-full para ocupar toda la altura
    <div className="bg-gradient-to-b from-green-600 via-green-700 to-green-800 h-full flex flex-col">
      {/* 📱 HEADER DEL SIDEBAR - Branding del colegio */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-white/20 data-[state=open]:text-white hover:bg-white/10 transition-all duration-300 text-white"
                >
                  {/* 🏫 Icono del colegio con fondo translúcido */}
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm">
                    <School className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">I.E. Santo Tomás de Aquino</span>
                    <span className="text-xs opacity-80">Sistema Académico</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENIDO PRINCIPAL DEL SIDEBAR - flex-1 para ocupar espacio disponible */}
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 font-medium">Gestión Académica</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 🔄 RENDERIZAR TODAS LAS SECCIONES DINÁMICAMENTE */}
              {resolvedMenuSections.map(renderMenuSection)}
              <SidebarMenuItem className="mt-2">
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-red-100 hover:text-white hover:bg-red-500/20 transition-all duration-300"
                >
                  <LogOut className="size-4" />
                  <span>Cerrar sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER CON INFORMACIÓN DEL USUARIO - Siempre visible en la parte inferior */}
      {/* mt-auto empuja el footer al bottom, border-t crea separación visual */}
      <SidebarFooter className="mt-auto border-t border-white/10 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Botón del usuario con diseño mejorado y animaciones */}
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-white/20 data-[state=open]:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 text-white p-3"
                >
                  {/* Avatar más grande con borde translúcido */}
                  <Avatar className="h-10 w-10 rounded-lg border-2 border-white/20">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Usuario" />
                    <AvatarFallback className="rounded-lg bg-white/20 text-white text-lg">
                      {/* Inicial del nombre del usuario o 'U' por defecto */}
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    {/* Nombre del usuario desde Redux store */}
                    <span className="truncate font-semibold text-base">{user?.name || "Usuario"}</span>
                    {/* Email real del usuario logueado */}
                    <span className="truncate text-sm opacity-80">{user?.email || "admin@colegio.edu"}</span>
                  </div>
                  <MoreHorizontal className="ml-auto size-5" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              {/* 📋 Dropdown que se abre hacia arriba (side="top") */}
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top" // 🔝 Se abre hacia arriba porque está en el footer
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    onClick={onItemClick}
                    className="hover:bg-green-50 transition-colors duration-200"
                  >
                    <User className="size-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  )
}

export function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="border-r sticky top-0 h-screen">
        <SidebarContentBody />
      </Sidebar>
    </SidebarProvider>
  )
}
