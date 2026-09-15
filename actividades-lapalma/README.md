# ActividadesLaPalma

App Next.js (App Router, JavaScript) para rutas y actividades en La Palma. Pack premium 6€ (pago único).

## Requisitos

- Node.js 18+
- Postgres (p. ej. Vercel Postgres)

## Instalación

```bash
cd actividades-lapalma
npm install
cp .env.example .env
```

Rellena `.env` (mínimo `DATABASE_URL` para Prisma).

## Base de datos

```bash
npx prisma migrate dev --name init
# o, si aún no hay migraciones:
npx prisma db push
npx prisma generate
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Postgres (Prisma) |
| `STRIPE_SECRET_KEY` | Stripe Checkout |
| `STRIPE_WEBHOOK_SECRET` | Webhook Stripe |
| `RESEND_API_KEY` | Emails (magic link) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (PDFs/imágenes) |
| `ADMIN_PASSWORD` | Acceso `/admin` |
| `EMAIL_FROM` | Remitente Resend |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app |

Ver `.env.example`. No subas secretos.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` / `npm start` — producción
- `npm run lint` — ESLint
- `npx prisma studio` — UI de datos

## Estructura (Fase 1)

```
actividades-lapalma/
  app/           # App Router
  app/admin/     # (Fase posterior)
  app/rutas/     # (Fase posterior)
  app/mapa/      # (Fase posterior)
  app/api/       # (Fase posterior)
  components/
  lib/prisma.js
  prisma/schema.prisma
```
