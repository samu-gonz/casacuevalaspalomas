import Image from "next/image";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import prisma from "@/lib/prisma";
import { hasPremiumAccess } from "@/lib/access";
import { PACK_PRICE_LABEL } from "@/lib/constants";
import { formatDistance, formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getPlace(slug) {
  try {
    return await prisma.place.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const place = await getPlace(params.slug);
  if (!place) return { title: "Ruta" };
  return {
    title: place.title,
    description: place.summary,
    openGraph: {
      title: place.title,
      description: place.summary,
      images: place.coverImageUrl ? [{ url: place.coverImageUrl }] : [],
    },
  };
}

export default async function RutaDetailPage({ params }) {
  const place = await getPlace(params.slug);
  if (!place) notFound();

  const access = await hasPremiumAccess();
  const showPremium = place.hasPremium && access;

  return (
    <main className="pb-8">
      <div className="relative h-[min(52vh,420px)] min-h-[260px] w-full overflow-hidden">
        <Image
          src={place.coverImageUrl}
          alt={place.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-8 sm:px-6">
          <p className="text-sm text-sand/70">
            {place.zone} · {place.difficulty} ·{" "}
            {formatDuration(place.durationMinutes)} ·{" "}
            {formatDistance(place.distanceKm)}
          </p>
          <h1 className="mt-2 font-display text-[clamp(2rem,6vw,3.25rem)] leading-tight text-foam">
            {place.title}
          </h1>
          {place.hasPremium ? (
            <p className="mt-2 text-sm text-sand/75">
              {access
                ? "Guía técnica desbloqueada"
                : "Incluye guía técnica en el pack premium"}
            </p>
          ) : (
            <p className="mt-2 text-sm text-sand/75">Ruta con capa gratuita completa</p>
          )}
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-lg leading-relaxed text-ink/85 dark:text-sand/80">
          {place.summary}
        </p>

        <section className="mt-12">
          <h2 className="font-display text-3xl text-forest dark:text-foam">
            Guía abierta
          </h2>
          <p className="mt-2 text-sm text-ink/55 dark:text-sand/50">
            Contenido gratuito de esta ruta — útil por sí solo para decidir si
            te encaja el día.
          </p>
          <div className="mt-6">
            <Markdown content={place.content} />
          </div>
        </section>

        {place.hasPremium ? (
          <section className="mt-14">
            <h2 className="font-display text-3xl text-forest dark:text-foam">
              Guía técnica
            </h2>
            <p className="mt-2 text-sm text-ink/55 dark:text-sand/50">
              Track, terreno, variantes y detalles operativos de esta misma
              ruta.
            </p>

            {showPremium ? (
              <div className="mt-6 space-y-6">
                <Markdown content={place.premiumContent || ""} />
                {place.pdfUrl ? (
                  <a
                    href={place.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-lg bg-ocean px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Descargar PDF técnico
                  </a>
                ) : null}
              </div>
            ) : (
              <div className="relative mt-6 overflow-hidden rounded-2xl border border-ink/10 dark:border-sand/15">
                <div
                  className="pointer-events-none select-none px-5 py-6 opacity-70"
                  aria-hidden
                >
                  <div className="blur-[2.5px]">
                    <Markdown
                      content={
                        place.premiumContent ||
                        "### Track y referencia\n\nPuntos de paso, tipología del terreno y variantes según forma física.\n\n- Inicio y parking\n- Tramos expuestos\n- Agua y sombra\n- Alternativa corta"
                      }
                    />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-sand via-sand/85 to-sand/20 p-6 dark:from-ink dark:via-ink/90 dark:to-ink/30">
                  <div className="w-full rounded-xl border border-ink/10 bg-sand/90 p-5 shadow-sm dark:border-sand/15 dark:bg-ink/90">
                    <p className="font-display text-xl text-forest dark:text-foam">
                      Desbloquea esta guía con el pack {PACK_PRICE_LABEL}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-sand/65">
                      No es un pago por ruta: el pack abre el técnico de{" "}
                      <strong className="font-medium">todas</strong> las rutas
                      premium, de por vida. Usa el botón de pago fijo para
                      continuar o reenviar tu acceso.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : null}
      </article>
    </main>
  );
}
