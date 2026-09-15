import PlaceCard from "@/components/PlaceCard";
import prisma from "@/lib/prisma";
import { DIFFICULTIES, ZONES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rutas",
  description:
    "Catálogo de rutas en La Palma. Lee la capa gratis y desbloquea el pack técnico cuando quieras.",
};

async function getPlaces() {
  try {
    return await prisma.place.findMany({ orderBy: { title: "asc" } });
  } catch (err) {
    console.error("[rutas] DB error", err.message);
    return [];
  }
}

export default async function RutasPage({ searchParams }) {
  const places = await getPlaces();
  const zone = searchParams?.zona || "";
  const difficulty = searchParams?.dificultad || "";
  const duration = searchParams?.duracion || "";
  const pago = searchParams?.pago;
  const acceso = searchParams?.acceso;

  const filtered = places.filter((place) => {
    if (zone && place.zone !== zone) return false;
    if (difficulty && place.difficulty !== difficulty) return false;
    if (duration === "corta" && place.durationMinutes > 180) return false;
    if (
      duration === "media" &&
      (place.durationMinutes <= 180 || place.durationMinutes > 360)
    )
      return false;
    if (duration === "larga" && place.durationMinutes <= 360) return false;
    return true;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl text-forest dark:text-foam sm:text-5xl">
          Rutas en La Palma
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink/70 dark:text-sand/65">
          Cada ficha muestra qué es <strong>gratis</strong> y qué entra en el
          pack de 6€ (track, agua, variantes, PDF). En dos segundos lo tienes
          claro.
        </p>
      </header>

      {pago === "ok" ? (
        <p className="mt-6 rounded-xl border border-ocean/30 bg-ocean/10 px-4 py-3 text-sm text-ocean">
          Pago recibido. Revisa tu email para el enlace de acceso (magic link).
        </p>
      ) : null}
      {pago === "cancelado" ? (
        <p className="mt-6 rounded-xl border border-ink/10 px-4 py-3 text-sm text-ink/60 dark:border-sand/15 dark:text-sand/55">
          Checkout cancelado. Puedes reintentarlo cuando quieras.
        </p>
      ) : null}
      {acceso === "ok" ? (
        <p className="mt-6 rounded-xl border border-forest/30 bg-forest/10 px-4 py-3 text-sm text-forest dark:text-foam">
          Acceso premium activado. Ya puedes abrir las guías técnicas.
        </p>
      ) : null}
      {acceso === "invalido" || acceso === "caducado" || acceso === "error" ? (
        <p className="mt-6 rounded-xl border border-lava/30 bg-lava/10 px-4 py-3 text-sm text-lava">
          No pudimos validar ese enlace. Usa «¿Ya compraste?» en el botón de pago
          para pedir uno nuevo.
        </p>
      ) : null}

      <form className="mt-8 grid gap-3 border-y border-ink/10 py-4 sm:grid-cols-4 dark:border-sand/10">
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45 dark:text-sand/40">
            Zona
          </span>
          <select
            name="zona"
            defaultValue={zone}
            className="w-full rounded-lg border border-ink/15 bg-transparent px-2 py-2 dark:border-sand/20"
          >
            <option value="">Todas</option>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45 dark:text-sand/40">
            Dificultad
          </span>
          <select
            name="dificultad"
            defaultValue={difficulty}
            className="w-full rounded-lg border border-ink/15 bg-transparent px-2 py-2 dark:border-sand/20"
          >
            <option value="">Todas</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wide text-ink/45 dark:text-sand/40">
            Duración
          </span>
          <select
            name="duracion"
            defaultValue={duration}
            className="w-full rounded-lg border border-ink/15 bg-transparent px-2 py-2 dark:border-sand/20"
          >
            <option value="">Todas</option>
            <option value="corta">Hasta 3 h</option>
            <option value="media">3–6 h</option>
            <option value="larga">Más de 6 h</option>
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-forest px-3 py-2.5 text-sm font-semibold text-foam dark:text-ink"
          >
            Aplicar filtros
          </button>
        </div>
      </form>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60 dark:text-sand/55">
          No hay rutas con estos filtros
          {places.length === 0
            ? ". Con DATABASE_URL, ejecuta `npm run db:seed`."
            : "."}
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </main>
  );
}
