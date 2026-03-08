# Sistema de Monitoreo Académico - Santo Tomas (Nuxt 3)

Proyecto migrado de Next.js a Nuxt 3, manteniendo la logica funcional:

- Autenticacion con JWT en cookie
- Control por roles (`ADMIN`, `DOCENTE`, `ALUMNO`)
- CRUD basico de usuarios, Áreas, notas y asistencia
- Reportes Académicos con Prisma + SQLite
- Notificaciones WhatsApp (simulado)

## Stack

- Nuxt 3 (Vue 3)
- Nitro Server API
- Prisma ORM
- SQLite

## Requisitos

- Node.js 18+

## Configuracion local

1. Instalar dependencias:
   - `npm install`
2. Crear `.env` desde `.env.example`
3. Generar cliente Prisma:
   - `npm run prisma:generate`
4. Crear base de datos:
   - `npm run prisma:migrate -- --name init`
5. Cargar seed:
   - `npm run prisma:seed`
6. Ejecutar:
   - `npm run dev`

## Credenciales de prueba

- Admin: `admin@santotomas.edu` / `Admin123`
- Docente: `docente@santotomas.edu` / `Docente123`
- Alumno: `alumno@santotomas.edu` / `Alumno123`


