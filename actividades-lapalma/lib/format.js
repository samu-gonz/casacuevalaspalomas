export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function formatDistance(km) {
  return `${Number(km).toFixed(1).replace(/\.0$/, "")} km`;
}

export function formatEurosFromCents(cents) {
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}
