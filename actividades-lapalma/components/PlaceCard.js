import Link from "next/link";
import Image from "next/image";
import { formatDistance, formatDuration } from "@/lib/format";

export default function PlaceCard({ place }) {
  return (
    <Link
      href={`/rutas/${place.slug}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-white/80 transition hover:border-ocean/35 dark:border-sand/10 dark:bg-ink/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink/5">
        <Image
          src={place.coverImageUrl}
          alt={place.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/50 to-transparent" />
        {place.hasPremium ? (
          <span className="absolute right-3 top-3 rounded-md bg-ink/75 px-2 py-1 text-[11px] font-medium tracking-wide text-sand backdrop-blur-sm">
            Premium
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-md bg-forest/90 px-2 py-1 text-[11px] font-medium tracking-wide text-foam">
            Gratis
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
          {place.zone} · {place.difficulty} · {formatDuration(place.durationMinutes)} ·{" "}
          {formatDistance(place.distanceKm)}
        </p>
      </div>
    </Link>
  );
}
