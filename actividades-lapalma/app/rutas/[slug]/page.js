import Image from "next/image";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import prisma from "@/lib/prisma";
import { canViewPremium } from "@/lib/access";
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

/** Extrae bullets concretos del markdown premium para el teaser. */
function premiumTeaserBullets(markdown) {
  if (!markdown) {
    return [
      "Track GPS con puntos de paso",
      "Agua, escapes y variantes",
      "Checklist y ficha PDF de campo",
    ];
  }
  const lines = markdown
    .split("\n")
    .map((l) => l.replace(/^\s*[-*]\s+/, "").replace(/^\s*\d+\.\s+/, "").trim())
    .filter(
      (l) =>
        l.length > 12 &&
        l.length < 110 &&
        !l.startsWith("#") &&
        !l.startsWith("|") &&
        !l.startsWith("---")
    );
  const picked = lines.slice(0, 4);
  return picked.length
    ? picked
    : [
        "Track GPS y waypoints",
        "Terreno, agua y seguridad",
        "Variantes cortas / largas",
        "PDF imprimible de campo",
      ];
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

  const premium = await canViewPremium();
  const showPremium = place.hasPremium && premium.ok;
  const teaser = premiumTeaserBullets(place.premiumContent);

  return (
    <main className="pb-10">
      <div className="relative h-[min(48vh,400px)] min-h-[240px] w-full overflow-hidden bg-ink">
        {place.coverImageUrl ? (
          <Image
            src={place.coverImageUrl}
            alt={`La Palma — ${place.title}`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full items-end bg-gradient-to-br from-ink via-ink to-ocean/50 p-8">
            <p className="font-display text-4xl text-foam">{place.zone}</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-8 sm:px-6">
          <p className="text-sm text-sand/70">
            {place.zone} · {place.difficulty} ·{" "}
            {formatDuration(place.durationMinutes)} ·{" "}
            {formatDistance(place.distanceKm)}
          </p>
          <h1 className="mt-2 font-display text-[clamp(2rem,6vw,3.25rem)] leading-tight text-foam">
            {place.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-forest/90 px-2.5 py-1 text-xs font-semibold text-foam">
              Capa gratis abierta
            </span>
            {place.hasPremium ? (
              <span className="rounded-md bg-ink/70 px-2.5 py-1 text-xs font-semibold text-sand ring-1 ring-sand/20">
                {showPremium
                  ? premium.via === "admin"
                    ? "Premium (vista admin)"
                    : "Premium desbloqueado"
                  : `Técnico · pack ${PACK_PRICE_LABEL}`}
              </span>
            ) : (
              <span className="rounded-md bg-sand/15 px-2.5 py-1 text-xs font-semibold text-sand">
                Sin capa de pago
              </span>
            )}
          </div>
        </div>
      </div>

      {premium.via === "admin" ? (
        <div className="border-b border-ocean/30 bg-ocean/10 px-4 py-2.5 text-center text-sm text-ocean">
          Vista admin: estás viendo el premium desbloqueado sin pagar.
        </div>
      ) : null}

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-lg leading-relaxed text-ink/85 dark:text-sand/80">
          {place.summary}
        </p>

        <section className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
            Incluido sin pagar
          </p>
          <h2 className="mt-2 font-display text-3xl text-forest dark:text-foam">
            Guía abierta
          </h2>
          <p className="mt-2 text-sm text-ink/55 dark:text-sand/50">
            Ambiente, acceso y tips reales — suficiente para decidir si te
            encaja el día.
          </p>
          <div className="mt-6">
            <Markdown content={place.content} />
          </div>
        </section>

        {place.hasPremium ? (
          <section className="mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lava">
              Pack {PACK_PRICE_LABEL} · acceso de por vida
            </p>
            <h2 className="mt-2 font-display text-3xl text-forest dark:text-foam">
              Guía técnica
            </h2>
            <p className="mt-2 text-sm text-ink/55 dark:text-sand/50">
              Track, terreno, agua, variantes y ficha de campo de{" "}
              <em>esta</em> ruta — y de todas las premium.
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
                <div className="space-y-3 px-5 pt-5">
                  <p className="text-sm font-medium text-ink dark:text-sand">
                    Dentro del pack verás, entre otras cosas:
                  </p>
                  <ul className="space-y-2 text-sm text-ink/80 dark:text-sand/75">
                    {teaser.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ocean" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="pointer-events-none mt-4 max-h-40 select-none overflow-hidden px-5 opacity-50"
                  aria-hidden
                >
                  <div className="blur-[3px]">
                    <Markdown content={place.premiumContent || ""} />
                  </div>
                </div>
                <div className="bg-gradient-to-t from-sand via-sand/95 to-transparent px-5 pb-5 pt-8 dark:from-ink dark:via-ink/95">
                  <div className="rounded-xl border border-ink/10 bg-sand/95 p-5 dark:border-sand/15 dark:bg-ink/95">
                    <p className="font-display text-xl text-forest dark:text-foam">
                      Desbloquea el técnico con {PACK_PRICE_LABEL}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-sand/65">
                      Un solo pago abre <strong>todas</strong> las guías
                      premium de la isla, de por vida. Usa el botón de pago
                      fijo (o pide reenvío si ya compraste).
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
