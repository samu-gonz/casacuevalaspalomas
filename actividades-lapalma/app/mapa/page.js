import nextDynamic from "next/dynamic";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mapa",
  description: "Mapa de rutas ActividadesLaPalma en la isla de La Palma.",
};

const MapView = nextDynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(70vh,560px)] items-center justify-center rounded-2xl border border-ink/10 text-sm text-ink/50 dark:border-sand/15">
      Cargando mapa…
    </div>
  ),
});

async function getPlaces() {
  try {
    return await prisma.place.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        hasPremium: true,
        gpsLat: true,
        gpsLng: true,
      },
    });
  } catch (err) {
    console.error("[mapa] DB error", err.message);
    return [];
  }
}

export default async function MapaPage() {
  const places = await getPlaces();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl text-forest dark:text-foam sm:text-5xl">
        Mapa de la isla
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70 dark:text-sand/65">
        Todos los puntos del catálogo. Relleno sólido = capa gratis; anillo =
        incluye técnico premium.
      </p>
      <div className="mt-8">
        {places.length === 0 ? (
          <p className="text-sm text-ink/60">
            Sin datos. Ejecuta el seed cuando tengas DATABASE_URL.
          </p>
        ) : (
          <MapView places={places} />
        )}
      </div>
    </main>
  );
}
