const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const places = [
  {
    slug: "volcan-san-antonio",
    title: "Volcán de San Antonio",
    summary:
      "Miradores sobre cráteres recientes del sur: lava negra, viñas y vistas al mar. Ideal para calentar motores el primer día.",
    hasPremium: false,
    zone: "Sur",
    difficulty: "Fácil",
    durationMinutes: 90,
    distanceKm: 3.2,
    coverImageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    gpsLat: 28.4885,
    gpsLng: -17.8412,
    content: `## Por qué ir
Un paseo corto entre malpaís y viñedos del sur. Perfecto al atardecer.

## Cómo llegar
Parking junto al centro de interpretación en Los Canarios / Fuencaliente. Señalización clara.

## Tips gratis
- Lleva agua: poca sombra.
- El viento del alisio aprieta en el borde del cráter.
- Combínalo con la visita a Teneguía si te queda luz.`,
    premiumContent: null,
    pdfUrl: null,
  },
  {
    slug: "caldera-taburiente-barranco",
    title: "Barranco de las Angustias",
    summary:
      "Entrada clásica a la Caldera: paredes verticales, agua y la sensación de entrar en otro planeta. Exige piernas y planificación.",
    hasPremium: true,
    zone: "Caldera",
    difficulty: "Exigente",
    durationMinutes: 420,
    distanceKm: 16.5,
    coverImageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    gpsLat: 28.716,
    gpsLng: -17.905,
    content: `## Ambiente
El barranco abre la puerta a la Caldera de Taburiente. El contraste entre sol, sombra y paredes de basalto es brutal.

## Acceso
Salida habitual desde el aparcamiento inferior hacia el cauce. Revisa el estado del agua tras lluvias.

## Qué esperar (capa gratis)
- Tramos de piedras sueltas y cruce de cauces.
- Temperatura muy distinta dentro/fuera.
- Merece madrugar: menos gente y mejor luz.

## Para quién
Senderistas con buena forma que ya hayan hecho alguna ruta larga en isla.`,
    premiumContent: `## Track y puntos clave
- Km 0: parking / control. Anota la hora de retorno.
- Km 3–5: zona de piedras rodadas; bastones útiles.
- Punto de agua fiable tras el tramo estrecho (estacional).
- Mirador natural antes del ensanche: buen sitio para comer.

## Terreno
Mix de cantos rodados, losas húmedas y tramos de arena volcánica. Suela con buen taco.

## Variantes
- **Corta:** giro en el primer gran ensanche (~4 h ida/vuelta).
- **Completa:** continúa hacia el interior según forma y hora (lleva frontal).

## Seguridad
No entres con aviso de lluvia fuerte. El barranco concentra avenida.`,
    pdfUrl: null,
  },
  {
    slug: "roque-de-los-muchachos",
    title: "Roque de los Muchachos",
    summary:
      "La cresta alta de la isla: observatorios, niebla mágica y vistas sobre la Caldera. Corto en distancia, intenso en ambiente.",
    hasPremium: true,
    zone: "Norte",
    difficulty: "Moderada",
    durationMinutes: 150,
    distanceKm: 5.8,
    coverImageUrl:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80",
    gpsLat: 28.7543,
    gpsLng: -17.8946,
    content: `## Por qué sube la gente
Estás sobre la Caldera, a menudo por encima de las nubes. Los telescopios marcan el paisaje.

## Acceso
Carretera hasta la zona de aparcamientos cercanos al Roque. Puede haber niebla densa: conduce con calma.

## Tips gratis
- Abrigo aunque abajo haga calor.
- Si hay nubes, espera 20 minutos: a veces se abre un “agujero” de luz.
- Respeto a zonas restringidas de observatorios.`,
    premiumContent: `## Track recomendado
Circular suave enlazando miradores oeste → Roque → retorno por senda paralela a la carretera en tramos permitidos.

## Terreno
Piedra suelta fina y algo de hielo en invierno temprano. Guantes finos ayudan con el viento.

## Variantes
- Solo ida al mirador principal (45–60 min).
- Extensión hacia Punta de los Roques si hay visibilidad >5 km.

## PDF
La ficha técnica incluye croquis de aparcamientos y zonas de viento habitual.`,
    pdfUrl: null,
  },
  {
    slug: "bosque-los-tilos",
    title: "Los Tilos — Cubo de la Galga",
    summary:
      "Laurisilva húmeda, túneles de vegetación y el sonido del agua. La La Palma verde que enamora en media jornada.",
    hasPremium: true,
    zone: "Este",
    difficulty: "Moderada",
    durationMinutes: 210,
    distanceKm: 7.4,
    coverImageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
    gpsLat: 28.789,
    gpsLng: -17.776,
    content: `## Ambiente
Musgo, helechos y luz filtrada. Muy distinta al sur volcánico.

## Acceso
Centro de visitantes / parking en Los Tilos. Hay tramos con escalones y raíces.

## Tips gratis
- Suelo resbaladizo tras llovizna.
- Ideal en días calurosos: microclima fresco.
- Lleva capa fina impermeable aunque no “llueva” en la costa.`,
    premiumContent: `## Track
Subida por el barranco principal hasta el mirador del Cubo, retorno por senda alternativa para evitar deshacer todo el desnivel en el mismo lecho.

## Puntos de agua
Fuente señalizada a mitad de subida (comprobar caudal en verano).

## Terreno
Raíces expuestas + peldaños de piedra. Tobillera estable recomendable.

## Variante familiar
Solo hasta el primer puente y vuelta (~1 h).`,
    pdfUrl: null,
  },
  {
    slug: "playa-nogales",
    title: "Mirador y bajada a Nogales",
    summary:
      "La postal del este: acantilado verde y playa de callaos. La bajada es corta pero firme; el mar manda.",
    hasPremium: false,
    zone: "Este",
    difficulty: "Moderada",
    durationMinutes: 100,
    distanceKm: 2.1,
    coverImageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    gpsLat: 28.759,
    gpsLng: -17.743,
    content: `## Por qué ir
Una de las imágenes más reconocibles de La Palma. El contraste acantilado–océano es inmediato.

## Acceso
Parking del mirador. La senda baja en zig-zag; no es larga pero pide rodilla estable.

## Tips gratis
- No te fíes del “mar en calma”: corrientes en callaos.
- Sube con tiempo de luz: la subida cansa más de lo que parece.
- Calzado cerrado; la arena y piedra queman/deslizan.`,
    premiumContent: null,
    pdfUrl: null,
  },
  {
    slug: "ruta-de-los-volcanes",
    title: "Ruta de los Volcanes (tramo central)",
    summary:
      "Cresta de cráteres y arenas negras: el alma volcánica de la dorsal. Un día largo que se queda en la memoria.",
    hasPremium: true,
    zone: "Centro",
    difficulty: "Exigente",
    durationMinutes: 480,
    distanceKm: 18,
    coverImageUrl:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    gpsLat: 28.596,
    gpsLng: -17.841,
    content: `## Ambiente
Caminas sobre historia geológica reciente. Paisaje lunar con el Atlántico a ambos lados en los claros.

## Logística (gratis)
- Logística de dos coches o taxi muy recomendable.
- Empieza temprano; no hay sombra real.
- Agua: mínimo 2–3 L por persona.

## Para quién
Quienes ya han hecho una exigente en la isla y quieren la “dorsal”.`,
    premiumContent: `## Track (tramo central)
Puntos de paso entre refugios/miradores clave, con tiempos parciales orientativos y escape hacia carretera en dos puntos.

## Terreno
Arena volcánica profunda (gasto energético alto), crestas ventosas y tramos de piedra suelta en bajadas.

## Variantes
- Solo tramo norte del sector (acorta ~40%).
- Combinación con pernocta planificada (fuera de este pack de día).

## Checklist
Frontal, cortavientos, más agua de la que crees, y plan de recogida escrito.`,
    pdfUrl: null,
  },
];

async function main() {
  for (const place of places) {
    await prisma.place.upsert({
      where: { slug: place.slug },
      create: place,
      update: place,
    });
  }

  await prisma.discountCode.upsert({
    where: { code: "PALMA10" },
    create: { code: "PALMA10", percentOff: 10, active: true },
    update: { percentOff: 10, active: true },
  });

  console.log(`Seed OK: ${places.length} rutas + cupón PALMA10`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
