import Link from "next/link";
import Image from "next/image";
import { formatDistance, formatDuration } from "@/lib/format";
import { PACK_PRICE_LABEL } from "@/lib/constants";

export default function PlaceCard({ place }) {
  const hasPhoto = Boolean(place.coverImageUrl);

  return (
    <Link
      href={`/rutas/${place.slug}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-white/80 transition hover:border-ocean/40 dark:border-sand/10 dark:bg-ink/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink/10">
        {hasPhoto ? (
          <Image
            src={place.coverImageUrl}
            alt={`La Palma — ${place.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-ink via-ink/90 to-ocean/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand/50">
              {place.zone}
            </p>
            <p className="font-display text-2xl leading-tight text-foam">
              {place.title}
            </p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 to-transparent" />
        {place.hasPremium ? (
          <span className="absolute right-3 top-3 rounded-md bg-ink/80 px-2 py-1 text-[11px] font-semibold tracking-wide text-sand backdrop-blur-sm">
            Pack {PACK_PRICE_LABEL}
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-md bg-forest/95 px-2 py-1 text-[11px] font-semibold tracking-wide text-foam">
            100% gratis
          </span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h2 className="font-display text-xl leading-snug text-forest dark:text-foam">
          {place.title}
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink/70 dark:text-sand/65">
          {place.summary}
        </p>
        <p className="text-xs text-ink/50 dark:text-sand/45">
          {place.zone} · {place.difficulty} ·{" "}
          {formatDuration(place.durationMinutes)} ·{" "}
          {formatDistance(place.distanceKm)}
        </p>
        {place.hasPremium ? (
          <p className="text-xs font-medium text-ocean">
            Capa gratis abierta · técnico en el pack
          </p>
        ) : (
          <p className="text-xs font-medium text-forest dark:text-foam/80">
            Guía completa sin pago
          </p>
        )}
      </div>
    </Link>
  );
}
