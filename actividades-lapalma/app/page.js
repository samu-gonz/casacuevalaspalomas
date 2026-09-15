import Link from "next/link";
import Image from "next/image";
import { PACK_PRICE_LABEL } from "@/lib/constants";

/** Hero: foto real Caldera de Taburiente (espejo local; atribución en IMAGES.md). */
const HERO_IMAGE = "/images/hero-caldera.jpg";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main>
      <section className="relative min-h-[100svh] overflow-hidden text-sand">
        <Image
          src={HERO_IMAGE}
          alt="Caldera de Taburiente, La Palma — foto real"
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.3)_0%,rgba(12,10,9,0.2)_40%,rgba(12,10,9,0.82)_82%,rgba(12,10,9,0.96)_100%)]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-28 pt-28 sm:px-6 sm:pb-24 md:pb-20">
          <p className="animate-rise font-display text-[clamp(2.75rem,10vw,5.25rem)] leading-[0.95] tracking-tight text-foam">
            ActividadesLaPalma
          </p>
          <h1 className="animate-rise-delay mt-5 max-w-[24ch] text-[clamp(1.25rem,3.2vw,1.7rem)] font-medium leading-snug text-sand/95">
            Rutas reales de la isla: lee la guía gratis y, si quieres el
            técnico completo, el pack cuesta {PACK_PRICE_LABEL} una sola vez.
          </h1>
          <p className="animate-rise-late mt-4 max-w-lg text-sm leading-relaxed text-sand/70 sm:text-base">
            Tracks, agua, variantes y PDFs de{" "}
            <strong className="font-medium text-sand">todas</strong> las rutas
            premium — acceso de por vida.
          </p>
          <div className="animate-rise-late mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/rutas"
              className="rounded-lg bg-ocean px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,118,110,0.35)] transition hover:bg-teal-600"
            >
              Ver rutas
            </Link>
            <a
              href="#pack"
              className="rounded-lg border border-sand/25 bg-white/5 px-5 py-3.5 text-sm font-medium text-sand backdrop-blur transition hover:bg-white/10"
            >
              Qué desbloquean {PACK_PRICE_LABEL}
            </a>
          </div>
        </div>
      </section>

      <section
        id="pack"
        className="relative overflow-hidden border-y border-ink/10 bg-[#171411] text-sand dark:border-sand/10"
      >
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
            Pack técnico
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight text-foam sm:text-4xl">
            {PACK_PRICE_LABEL} · un pago · todo el premium
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sand/65 sm:text-base">
            En cada ruta hay una capa gratis útil. El pack abre la capa
            técnica de todas las premium: GPS, terreno, escapes y PDF. No es
            suscripción ni pago por ruta.
          </p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                t: "Track y waypoints",
                d: "Referencias GPS, desvíos y puntos de agua cuando existen.",
              },
              {
                t: "Terreno y variantes",
                d: "Tipo de suelo, exposición y alternativas según forma.",
              },
              {
                t: "PDF de campo",
                d: "Ficha para el móvil o impresa, sin depender de cobertura.",
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
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl text-forest dark:text-foam">
          Cómo funciona
        </h2>
        <ol className="mt-10 grid gap-10 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Lee gratis",
              d: "Catálogo abierto: ambiente, acceso y tips en cada senda.",
            },
            {
              n: "02",
              t: "Mira el técnico",
              d: "En premium verás bullets reales de lo que incluye (no un muro vacío).",
            },
            {
              n: "03",
              t: `Pack ${PACK_PRICE_LABEL}`,
              d: "Un pago. Magic link al correo. Acceso de por vida.",
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
            Ir al catálogo
          </Link>
        </div>
      </section>
    </main>
  );
}
