const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Fotos reales de La Palma (espejo local en public/images).
 * Atribución y licencias en IMAGES.md — no usar stocks genéricos ni IA.
 */
const IMG = {
  caldera: "/images/places/barranco-angustias.jpg",
  sanAntonio: "/images/places/volcan-san-antonio.jpg",
  roque: "/images/places/roque-muchachos.jpg",
  tilos: "/images/places/los-tilos.jpg",
  nogales: "/images/places/playa-nogales.jpg",
  volcanes: "/images/places/ruta-volcanes.jpg",
  hero: "/images/hero-caldera.jpg",
};

const SAMUEL_EMAIL = "samuelgonz2006@gmail.com";

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
    coverImageUrl: IMG.sanAntonio,
    gpsLat: 28.4885,
    gpsLng: -17.8412,
    content: `## Por qué ir
Paseo corto entre malpaís y viñedos de Fuencaliente. Perfecto al atardecer, con el Atlántico al fondo.

## Cómo llegar
Parking junto al centro de interpretación en Los Canarios. Señalización clara hasta el borde del cráter.

## Tips gratis
- Lleva agua: poca sombra en el malpaís.
- El alisio aprieta en el borde; sujeta el sombrero.
- Combínalo con Teneguía si te queda luz.`,
    premiumContent: null,
    pdfUrl: null,
  },
  {
    slug: "barranco-las-angustias",
    title: "Barranco de las Angustias",
    summary:
      "Entrada clásica a la Caldera: paredes verticales, agua y la sensación de entrar en otro planeta. Exige piernas y planificación.",
    hasPremium: true,
    zone: "Caldera",
    difficulty: "Exigente",
    durationMinutes: 420,
    distanceKm: 16.5,
    coverImageUrl: IMG.caldera,
    gpsLat: 28.716,
    gpsLng: -17.905,
    content: `## Ambiente
El barranco abre la puerta a la Caldera de Taburiente. Sol, sombra y paredes de basalto en contraste brutal.

## Acceso (capa gratis)
Salida habitual desde el aparcamiento inferior hacia el cauce. Revisa caudales tras lluvias.

## Qué esperar sin pagar
- Piedras sueltas y cruces de cauce.
- Microclima muy distinto dentro/fuera.
- Merece madrugar: menos gente y mejor luz.

## Para quién
Senderistas con buena forma que ya hayan hecho alguna ruta larga en la isla.`,
    premiumContent: `## Qué incluye esta guía técnica

### Track GPS y puntos de paso
| Punto | Ref. aprox. | Nota |
| --- | --- | --- |
| Parking / control | 28.7160, -17.9050 | Anota hora de retorno |
| Primer estrecho | +3,2 km | Bastones útiles; piedras rodadas |
| Fuente estacional | +5,1 km | Comprobar caudal en verano |
| Ensanche / comida | +7,4 km | Sombra parcial a la izquierda |

### Desnivel y ritmo
- Acumulado orientativo: **~850 m** de desnivel positivo en ida completa.
- Ritmo seguro: 2,5–3 km/h en el lecho; no fuerces tras el km 5.

### Agua y sombra
1. Fuente señalizada tras el tramo estrecho (estacional).
2. Nunca bebas del cauce sin tratar.
3. Sombra real solo en paredes N–NE a media mañana.

### Variantes
- **Corta (~4 h ida/vuelta):** giro en el primer gran ensanche.
- **Completa:** continúa al interior según forma y hora (frontal obligatorio).
- **Escape:** no hay atajos laterales fiables; el retorno es por el mismo barranco.

### Terreno y calzado
Cantos rodados, losas húmedas y arena volcánica. Suela con taco agresivo. Tobilleras si tienes antecedentes.

### Seguridad
- No entrar con aviso de lluvia fuerte o avenida.
- Teléfono con batería; cobertura irregular a partir del km 4.
- Grupo mínimo recomendado: 2 personas.

### PDF de campo
Ficha imprimible con croquis de parking, tiempos parciales y checklist (disponible al desbloquear el pack; sube el PDF en admin si lo tienes).`,
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
    coverImageUrl: IMG.roque,
    gpsLat: 28.7543,
    gpsLng: -17.8946,
    content: `## Por qué sube la gente
Estás sobre la Caldera, a menudo por encima de las nubes. Los telescopios marcan el paisaje.

## Acceso
Carretera hasta aparcamientos cercanos al Roque. Niebla densa habitual: conduce con calma.

## Tips gratis
- Abrigo aunque abajo haga calor.
- Si hay nubes, espera 20 minutos: a veces se abre un claro.
- Respeta zonas restringidas de observatorios.`,
    premiumContent: `## Guía técnica — Roque de los Muchachos

### Track recomendado (circular suave)
1. **Inicio:** parking oeste de miradores (28.754, -17.897).
2. **Mirador Caldera:** 20–25 min; fotos con barandilla.
3. **Roque / crestas:** +35 min; viento lateral frecuente.
4. **Retorno:** senda paralela permitida a la carretera (evitar arcén).

### Waypoints clave
- Aparcamiento A: 28.7543, -17.8965
- Cruce senda norte: 28.7551, -17.8938
- Punto más expuesto: 28.7560, -17.8920 (no acercarse al borde con niebla)

### Condiciones y capa
| Señal | Qué hacer |
| --- | --- |
| Niebla < 50 m | No dejar asfalto/senda marcada |
| Viento > 60 km/h | Cancelar extensión a Punta de los Roques |
| Hielo fino (invierno) | Microspikes opcionales |

### Variantes
- Solo mirador principal: **45–60 min**.
- Extensión Punta de los Roques: +1,5 h si visibilidad > 5 km.

### Qué lleva el PDF
Croquis de parkings, rosa de vientos habitual y zonas vetadas ORM.`,
    pdfUrl: null,
  },
  {
    slug: "los-tilos-cubo-galga",
    title: "Los Tilos — Cubo de la Galga",
    summary:
      "Laurisilva húmeda, túneles de vegetación y el sonido del agua. La La Palma verde que enamora en media jornada.",
    hasPremium: true,
    zone: "Este",
    difficulty: "Moderada",
    durationMinutes: 210,
    distanceKm: 7.4,
    coverImageUrl: IMG.tilos,
    gpsLat: 28.789,
    gpsLng: -17.776,
    content: `## Ambiente
Musgo, helechos y luz filtrada. Muy distinta al sur volcánico.

## Acceso
Centro de visitantes / parking en Los Tilos. Tramos con escalones y raíces.

## Tips gratis
- Suelo resbaladizo tras llovizna.
- Ideal en días calurosos: microclima fresco.
- Capa fina impermeable aunque no “llueva” en la costa.`,
    premiumContent: `## Guía técnica — Los Tilos / Cubo de la Galga

### Track
- **Subida:** barranco principal hasta mirador del Cubo (~3,6 km).
- **Retorno:** senda alternativa este para no deshacer todo el desnivel en el mismo lecho.
- Desnivel +: **~520 m**. Tiempo neto: 3–3,5 h sin paradas largas.

### Puntos de agua
1. Fuente señalizada a ~1,8 km (comprobar en agosto).
2. No uses charcas del lecho sin filtro.

### Terreno
Raíces expuestas, peldaños de piedra húmeda, pasarelas. Tobillera estable recomendable. Bastón corto ayuda en la bajada.

### Variante familiar
Solo hasta el primer puente y vuelta (**~1 h**). Ideal con niños acostumbrados a caminar.

### Fauna / normas
No salgas de la senda: laurisilva frágil. Evita altavoces.

### PDF
Mapa del circuito, tiempos parciales y foto-referencia del desvío de retorno.`,
    pdfUrl: null,
  },
  {
    slug: "mirador-nogales",
    title: "Mirador y bajada a Nogales",
    summary:
      "La postal del este: acantilado verde y playa de callaos. La bajada es corta pero firme; el mar manda.",
    hasPremium: false,
    zone: "Este",
    difficulty: "Moderada",
    durationMinutes: 100,
    distanceKm: 2.1,
    coverImageUrl: IMG.nogales,
    gpsLat: 28.759,
    gpsLng: -17.743,
    content: `## Por qué ir
Una de las imágenes más reconocibles de La Palma. El contraste acantilado–océano es inmediato.

## Acceso
Parking del mirador. La senda baja en zig-zag; no es larga pero pide rodilla estable.

## Tips gratis
- No te fíes del “mar en calma”: corrientes en callaos.
- Sube con tiempo de luz: la subida cansa más de lo que parece.
- Calzado cerrado; la piedra quema y desliza.`,
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
    coverImageUrl: IMG.volcanes,
    gpsLat: 28.596,
    gpsLng: -17.841,
    content: `## Ambiente
Caminas sobre historia geológica reciente. Paisaje lunar con el Atlántico a ambos lados en los claros.

## Logística (gratis)
- Dos coches o taxi muy recomendable.
- Empieza temprano; no hay sombra real.
- Agua: mínimo 2–3 L por persona.

## Para quién
Quienes ya han hecho una exigente en la isla y quieren la “dorsal”.`,
    premiumContent: `## Guía técnica — Ruta de los Volcanes (tramo central)

### Track y tiempos parciales (orientativos)
| Tramo | Dist. | Tiempo | Notas |
| --- | --- | --- | --- |
| Refugio / inicio sector | 0 km | 0:00 | Control de viento |
| Montaña Quemada | 4,5 km | 1:40 | Arena profunda |
| Cruce mirador dorsal | 9 km | 3:30 | Escape carretera S |
| Fin tramo central | 18 km | 6:30–7:30 | Taxi / segundo coche |

### Terreno
- Arena volcánica profunda → gasto energético alto (+20–30 %).
- Crestas ventosas; gafas de sol y braga.
- Bajadas de piedra suelta: pies cortos, no correr.

### Escapes a carretera
1. Km ~6,2 — pista secundaria señalizada (solo si emergencia).
2. Km ~11 — enlace GR hacia LP-2 (confirmado en ficha PDF).

### Checklist premium
- [ ] Frontal + batería
- [ ] Cortavientos
- [ ] 3 L agua / persona
- [ ] Plan de recogida escrito (hora + teléfono)
- [ ] Offline map / track GPX (en PDF del pack)

### Variantes
- Solo tramo norte del sector: acorta ~40 %.
- Pernocta planificada: fuera de este pack de día.

### PDF
Track GPX resumido, tabla de escapes y croquis de parkings norte/sur.`,
    pdfUrl: null,
  },
];

async function main() {
  const keepSlugs = places.map((p) => p.slug);

  for (const place of places) {
    await prisma.place.upsert({
      where: { slug: place.slug },
      create: place,
      update: place,
    });
  }

  // Quita rutas huérfanas (p.ej. covers Unsplash de seeds antiguos).
  const removed = await prisma.place.deleteMany({
    where: { slug: { notIn: keepSlugs } },
  });

  await prisma.discountCode.upsert({
    where: { code: "PALMA10" },
    create: { code: "PALMA10", percentOff: 10, active: true },
    update: { percentOff: 10, active: true },
  });

  // Compra demo para Samuel (sin Stripe): permite magic link / reenvío.
  await prisma.purchase.upsert({
    where: { stripeSessionId: "seed-demo-samuel" },
    create: {
      email: SAMUEL_EMAIL,
      stripeSessionId: "seed-demo-samuel",
      amountPaid: 0,
      discountApplied: true,
      discountCode: "DEMO-SAMUEL",
    },
    update: {
      email: SAMUEL_EMAIL,
      discountApplied: true,
      discountCode: "DEMO-SAMUEL",
    },
  });

  console.log(
    `Seed OK: ${places.length} rutas + PALMA10 + purchase demo ${SAMUEL_EMAIL} (eliminadas huérfanas: ${removed.count})`
  );
  console.log(
    "Samuel: entra en /admin → «Generar acceso» o usa ¿Ya compraste? con su email."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
