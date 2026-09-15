export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticRoutes = ["", "/rutas", "/mapa"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  let placeRoutes = [];
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const places = await prisma.place.findMany({ select: { slug: true, updatedAt: true } });
    placeRoutes = places.map((p) => ({
      url: `${base}/rutas/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // Sin DB en build: solo rutas estáticas.
  }

  return [...staticRoutes, ...placeRoutes];
}
