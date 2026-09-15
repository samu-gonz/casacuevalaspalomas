"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

/**
 * Mapa Leaflet client-only: marcadores distintos para gratis vs premium.
 */
export default function MapView({ places }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import("leaflet")).default;
      if (cancelled) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
      }).setView([28.68, -17.85], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);

      const bounds = [];

      places.forEach((place) => {
        const color = place.hasPremium ? "#0f766e" : "#3f6212";
        const marker = L.circleMarker([place.gpsLat, place.gpsLng], {
          radius: place.hasPremium ? 10 : 8,
          color,
          fillColor: color,
          fillOpacity: place.hasPremium ? 0.25 : 0.85,
          weight: place.hasPremium ? 3 : 2,
          dashArray: place.hasPremium ? "4 3" : undefined,
        }).addTo(map);

        marker.bindPopup(
          `<strong>${place.title}</strong><br/>${
            place.hasPremium ? "Premium" : "Gratis"
          }<br/><a href="/rutas/${place.slug}">Ver ruta</a>`
        );
        bounds.push([place.gpsLat, place.gpsLng]);
      });

      if (bounds.length) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }

      mapRef.current = map;
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [places]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="h-[min(70vh,560px)] w-full overflow-hidden rounded-2xl border border-ink/10 dark:border-sand/15"
      />
      <ul className="grid gap-2 sm:grid-cols-2">
        {places.map((place) => (
          <li key={place.id}>
            <Link
              href={`/rutas/${place.slug}`}
              className="flex items-center justify-between rounded-lg border border-ink/10 px-3 py-2 text-sm transition hover:border-ocean/40 dark:border-sand/10"
            >
              <span>{place.title}</span>
              <span className="text-xs text-ink/50 dark:text-sand/45">
                {place.hasPremium ? "Premium" : "Gratis"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
