# Imágenes — solo fotos reales de La Palma

No usamos Unsplash/stocks genéricos ni imágenes generadas por IA.
Los assets canónicos están en `public/images/` (espejo local de Wikimedia Commons)
para no depender de hotlink frágil.

## Catálogo

| Uso | Archivo local | Commons (File:) | Autor | Licencia |
| --- | --- | --- | --- | --- |
| Hero home | `public/images/hero-caldera.jpg` | [Caldera de Taburiente La Palma.jpg](https://commons.wikimedia.org/wiki/File:Caldera_de_Taburiente_La_Palma.jpg) | Luc Viatour | CC BY-SA 3.0 |
| Barranco Angustias / Caldera | `public/images/places/barranco-angustias.jpg` | [La Palma - Caldera de Taburiente Interior - 4.jpg](https://commons.wikimedia.org/wiki/File:La_Palma_-_Caldera_de_Taburiente_Interior_-_4.jpg) | imehling | CC BY-SA 3.0 |
| Volcán San Antonio | `public/images/places/volcan-san-antonio.jpg` | [San Antonio volcano - Panorama 03.jpg](https://commons.wikimedia.org/wiki/File:San_Antonio_volcano_-_Panorama_03.jpg) | Llez (H. Zell) | CC BY-SA 3.0 |
| Roque de los Muchachos | `public/images/places/roque-muchachos.jpg` | [Roque de los Muchachos - Rocks 01.jpg](https://commons.wikimedia.org/wiki/File:Roque_de_los_Muchachos_-_Rocks_01.jpg) | H. Zell | CC BY-SA 3.0 |
| Los Tilos | `public/images/places/los-tilos.jpg` | [Los Tilos at Island of La Palma, Spain.jpg](https://commons.wikimedia.org/wiki/File:Los_Tilos_at_Island_of_La_Palma,_Spain.jpg) | ThomasLendt | CC BY-SA 4.0 |
| Nogales | `public/images/places/playa-nogales.jpg` | [Playa de Nogales, La Palma, overview.jpg](https://commons.wikimedia.org/wiki/File:Playa_de_Nogales,_La_Palma,_overview.jpg) | Gerda Arendt | CC0 |
| Ruta de los Volcanes | `public/images/places/ruta-volcanes.jpg` | [GR-131 Ruta de los Volcanes La Palma 20080606d.jpg](https://commons.wikimedia.org/wiki/File:GR-131_Ruta_de_los_Volcanes_La_Palma_20080606d.jpg) | Tigerente | CC BY-SA 4.0 |

## Uso en la app

- Hero: `app/page.js` → `/images/hero-caldera.jpg`
- Covers de rutas: `prisma/seed.js` → `/images/places/*.jpg`
- Si una ruta no tiene foto fiable: placeholder tipográfico con la zona (no un paisaje inventado)

## Notas

- `next.config.mjs` ya no permite `images.unsplash.com`.
- Tras cambiar covers, re-ejecutar seed (borra también rutas huérfanas con Unsplash).
