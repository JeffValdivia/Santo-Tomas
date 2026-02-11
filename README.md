# Santo Tomas
Initial commit.

# Santo Tomas

# Santo Tomas

# Sistema de Monitoreo Académico (Next.js)

MVP con roles `admin`, `docente` y `alumno`, registro de alumnos, asignación de tareas, notas y comentarios, y notificaciones por WhatsApp.

## Requisitos
- Node.js 18+

## Configuración rápida
1. Instala dependencias:
   - `npm install`
2. Define variables en `.env`:
   - `DATABASE_URL="file:./prisma/dev.db"`
   - `AUTH_SECRET="cambia-este-secreto"`
   - `WHATSAPP_TOKEN=`
   - `WHATSAPP_PHONE_NUMBER_ID=`
3. Inicializa base de datos (local):
   - `npx prisma migrate dev --name init`
   - `npx prisma db seed`
4. Ejecuta:
   - `npm run dev`

## Accesos seed
- Admin: `admin@santotomas.edu` / `Admin123`
- Docente: `docente@santotomas.edu` / `Docente123`
- Alumno: `alumno@santotomas.edu` / `Alumno123`

## Notificaciones WhatsApp
Se usa Meta WhatsApp Cloud API. Si no configuras las variables, el sistema simula los envíos.
