# ActividadesLaPalma

Web de rutas en La Palma: capa gratis por ruta + pack técnico **6€** (pago único, acceso de por vida).

Stack: Next.js 14 (App Router, **JavaScript**), Tailwind, Prisma, Stripe, Resend, Vercel Blob.

## Arranque local

```bash
cd actividades-lapalma
npm install
cp .env.example .env
```

Rellena al menos `DATABASE_URL` (Postgres). Luego:

```bash
npx prisma db push
npx prisma generate
npm run db:seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Postgres (Prisma) |
| `STRIPE_SECRET_KEY` | Checkout |
| `STRIPE_WEBHOOK_SECRET` | Firma webhook |
| `RESEND_API_KEY` | Magic link por email |
| `BLOB_READ_WRITE_TOKEN` | Subida PDFs (admin) |
| `ADMIN_PASSWORD` | Login `/admin` |
| `EMAIL_FROM` | Remitente Resend |
| `NEXT_PUBLIC_APP_URL` | URL pública (links y redirects) |

Sin secretos de Stripe/Resend la web y el admin funcionan; el checkout y los emails responderán con error claro o loguearán el magic link en consola.

## Deploy (Vercel)

Root Directory del proyecto: **`actividades-lapalma`**.

1. Crea Postgres (Neon / Vercel Postgres / Prisma Postgres) y copia `DATABASE_URL`.
2. En Vercel → Project → Settings → Environment Variables, pega las vars de `.env.example`.
3. Build Command sugerido: `prisma generate && next build` (ya en `vercel.json`).
4. Tras el primer deploy con DB: en local o CI,
   `DATABASE_URL=... npx prisma db push && npm run db:seed`
5. Webhook Stripe: `https://<tu-dominio>/api/webhooks/stripe`

`binaryTargets` de Prisma incluye `rhel-openssl-3.0.x` para serverless Vercel.

## Probar checkout (modo test)

1. Claves `sk_test_…` en `STRIPE_SECRET_KEY`.
2. Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` → copia el `whsec_…` a `STRIPE_WEBHOOK_SECRET`.
3. `RESEND_API_KEY` + `EMAIL_FROM` (o mira el magic link en logs si no hay Resend).
4. En la web: email + «Pagar 6€» (cupón seed `PALMA10` = 10% si quieres).
5. Tarjeta test `4242…`. Tras el webhook, abre el enlace del correo / log.

## Rutas

- `/` hero y propuesta de valor
- `/rutas` catálogo + filtros
- `/rutas/[slug]` gratis + blur técnico
- `/mapa` Leaflet
- `/admin` CRUD rutas, compras, cupones
- APIs: `/api/checkout`, `/api/webhooks/stripe`, `/api/access/verify`, `/api/access/resend`

## Scripts

- `npm run dev` / `build` / `start` / `lint`
- `npm run db:push` · `db:seed` · `db:studio`
