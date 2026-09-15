import Link from "next/link";
import Image from "next/image";
import { PACK_PRICE_LABEL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[100svh] overflow-hidden text-sand">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=80"
          alt="Crestas volcánicas y cielo abierto en La Palma"
          fill
          priority
          className="object-cover object-[center_35%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.35)_0%,rgba(12,10,9,0.25)_35%,rgba(12,10,9,0.78)_78%,rgba(12,10,9,0.95)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(15,118,110,0.28),transparent_45%)]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-28 pt-28 sm:px-6 sm:pb-24 md:pb-20">
          <p className="animate-rise font-display text-[clamp(2.75rem,10vw,5.5rem)] leading-[0.95] tracking-tight text-foam">
            ActividadesLaPalma
          </p>
          <h1 className="animate-rise-delay mt-5 max-w-[22ch] text-[clamp(1.2rem,3.4vw,1.75rem)] font-medium leading-snug text-sand/95">
            Guías de ruta con alma local: lee gratis, y desbloquea el técnico
            completo con un solo pack de {PACK_PRICE_LABEL}.
          </h1>
          <p className="animate-rise-late mt-4 max-w-md text-sm leading-relaxed text-sand/70 sm:text-base">
            Tracks, terreno, variantes y PDFs de todas las rutas premium — pago
            único, acceso de por vida.
          </p>
          <div className="animate-rise-late mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/rutas"
              className="rounded-lg bg-ocean px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,118,110,0.35)] transition hover:bg-teal-600"
            >
              Explorar rutas
            </Link>
            <a
              href="#pack"
              className="rounded-lg border border-sand/25 bg-white/5 px-5 py-3.5 text-sm font-medium text-sand backdrop-blur transition hover:bg-white/10"
            >
              Qué incluye el pack
            </a>
          </div>
        </div>
      </section>

      <section
        id="pack"
        className="relative overflow-hidden border-y border-ink/10 bg-[#171411] text-sand dark:border-sand/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(15,118,110,0.22),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
            Pack técnico
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight text-foam sm:text-4xl">
            {PACK_PRICE_LABEL} una vez. Todo el premium. Para siempre.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sand/65 sm:text-base">
            Cada ruta tiene una capa gratis útil (ambiente, acceso, tips
            esenciales). El pack abre la capa técnica de{" "}
            <em>todas</em> las rutas premium: no es una suscripción ni un
            pago por ruta.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                t: "Track y puntos clave",
                d: "Referencias GPS, desvíos y puntos de agua cuando existen.",
              },
              {
                t: "Terreno y variantes",
                d: "Tipología del suelo, exposición y alternativas según forma.",
              },
              {
                t: "PDF descargable",
                d: "Lleva la ficha técnica al móvil o impresa, sin cobertura.",
              },
            ].map((item) => (
              <li key={item.t} className="border-t border-sand/15 pt-4">
                <h3 className="font-display text-xl text-foam">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand/60">
                  {item.d}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-sand/55">
            Usa el botón de pago fijo para comprar o reenviar tu acceso si ya
            pagaste.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl text-forest dark:text-foam">
          Del sendero al pack
        </h2>
        <p className="mt-3 max-w-xl text-ink/70 dark:text-sand/65">
          Sin dashboards ni ruido: eliges una ruta, lees lo gratis y decides si
          quieres el técnico.
        </p>
        <ol className="mt-12 grid gap-10 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Lee sin pagar",
              d: "Todas las rutas están abiertas: resumen, ambiente y orientación real.",
            },
            {
              n: "02",
              t: "Mira el técnico",
              d: "En premium verás un preview difuminado de esa misma guía — no un muro vacío.",
            },
            {
              n: "03",
              t: `Desbloquea ${PACK_PRICE_LABEL}`,
              d: "Un pago. Magic link al correo. Acceso de por vida a toda la isla.",
            },
          ].map((item) => (
            <li key={item.n}>
              <p className="text-xs font-semibold tracking-[0.18em] text-ocean">
                {item.n}
              </p>
              <h3 className="mt-3 font-display text-2xl text-ink dark:text-sand">
                {item.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65 dark:text-sand/60">
                {item.d}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <Link
            href="/rutas"
            className="inline-flex rounded-lg bg-forest px-5 py-3 text-sm font-semibold text-foam transition hover:opacity-90 dark:text-ink"
          >
            Ir al catálogo de rutas
          </Link>
        </div>
      </section>
    </main>
  );
}
