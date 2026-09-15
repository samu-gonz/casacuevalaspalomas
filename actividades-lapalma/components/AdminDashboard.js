"use client";

import { useEffect, useMemo, useState } from "react";
import { DIFFICULTIES, ZONES } from "@/lib/constants";
import { formatEurosFromCents } from "@/lib/format";

/** Evita renderizar objetos crudos ([object Object]) en la UI. */
function asText(value, fallback = "") {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value?.message === "string") return value.message;
  if (typeof value?.url === "string") return value.url;
  if (typeof value?.magicLink === "string") return value.magicLink;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback || "Error desconocido";
  }
}

const emptyPlace = {
  slug: "",
  title: "",
  summary: "",
  hasPremium: false,
  zone: ZONES[0],
  difficulty: DIFFICULTIES[0],
  durationMinutes: 180,
  distanceKm: 8,
  coverImageUrl: "",
  gpsLat: 28.68,
  gpsLng: -17.85,
  content: "",
  premiumContent: "",
  pdfUrl: "",
};

export default function AdminDashboard({ initialAuthed }) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("places");
  const [places, setPlaces] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPlace);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [newCode, setNewCode] = useState({ code: "", percentOff: 20 });
  const [grantEmail, setGrantEmail] = useState("samuelgonz2006@gmail.com");
  const [grantLink, setGrantLink] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);

  async function login(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(asText(data.error, "Error de acceso"));
      return;
    }
    setAuthed(true);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  async function loadAll() {
    const [p, pu, d] = await Promise.all([
      fetch("/api/admin/places").then((r) => r.json()),
      fetch("/api/admin/purchases").then((r) => r.json()),
      fetch("/api/admin/discounts").then((r) => r.json()),
    ]);
    if (Array.isArray(p)) setPlaces(p);
    if (Array.isArray(pu)) setPurchases(pu);
    if (Array.isArray(d)) setDiscounts(d);
  }

  useEffect(() => {
    if (authed) loadAll();
  }, [authed]);

  function startCreate() {
    setEditing("new");
    setForm(emptyPlace);
    setMsg("");
  }

  function startEdit(place) {
    setEditing(place.id);
    setForm({
      ...place,
      premiumContent: place.premiumContent || "",
      pdfUrl: place.pdfUrl || "",
    });
    setMsg("");
  }

  async function savePlace(e) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      durationMinutes: Number(form.durationMinutes),
      distanceKm: Number(form.distanceKm),
      gpsLat: Number(form.gpsLat),
      gpsLng: Number(form.gpsLng),
      premiumContent: form.hasPremium ? form.premiumContent : null,
      pdfUrl: form.pdfUrl || null,
    };

    const url =
      editing === "new" ? "/api/admin/places" : `/api/admin/places/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(asText(data.error, "No se pudo guardar"));
      return;
    }
    setMsg("Ruta guardada");
    setEditing(null);
    await loadAll();
  }

  async function removePlace(id) {
    if (!confirm("¿Eliminar esta ruta?")) return;
    await fetch(`/api/admin/places/${id}`, { method: "DELETE" });
    await loadAll();
  }

  async function uploadPdf(placeId, file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/admin/places/${placeId}/upload`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) {
      setError(asText(data.error, "Error al subir PDF"));
      return;
    }
    setMsg("PDF subido");
    if (editing === placeId) {
      setForm((f) => ({ ...f, pdfUrl: data.url }));
    }
    await loadAll();
  }

  async function createDiscount(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCode),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(asText(data.error, "No se pudo crear el cupón"));
      return;
    }
    setNewCode({ code: "", percentOff: 20 });
    await loadAll();
  }

  async function toggleDiscount(id, active) {
    await fetch(`/api/admin/discounts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    await loadAll();
  }

  async function grantAccess(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    setGrantLink("");
    setGrantLoading(true);
    try {
      const res = await fetch("/api/admin/grant-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: grantEmail, sendEmail: false }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(asText(data.error, "No se pudo generar acceso"));
      }
      const link = asText(data.magicLink || data.url, "");
      if (!link.startsWith("http")) {
        throw new Error(
          "La API no devolvió un enlace válido. Revisa NEXT_PUBLIC_APP_URL / logs."
        );
      }
      setGrantLink(link);
      setMsg(
        asText(
          data.message,
          "Acceso generado. Abre el magic link para activar la cookie de 1 año."
        )
      );
    } catch (err) {
      setError(asText(err?.message || err, "Error al generar acceso"));
      setGrantLink("");
    } finally {
      setGrantLoading(false);
    }
  }

  const title = useMemo(
    () => (editing ? (editing === "new" ? "Nueva ruta" : "Editar ruta") : null),
    [editing]
  );

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <h1 className="font-display text-3xl text-forest">Admin</h1>
        <p className="mt-2 text-sm text-ink/60">Acceso protegido</p>
        <form onSubmit={login} className="mt-6 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ADMIN_PASSWORD"
            className="w-full rounded-lg border border-ink/15 px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-ink px-3 py-2.5 text-sm font-semibold text-sand"
          >
            Entrar
          </button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-forest">Admin ActividadesLaPalma</h1>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-ink/60 underline-offset-2 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["places", "Rutas"],
          ["purchases", "Compras"],
          ["discounts", "Cupones"],
          ["access", "Acceso demo"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setEditing(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              tab === id ? "bg-ocean text-white" : "border border-ink/15"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {msg ? <p className="mt-4 text-sm text-forest">{asText(msg)}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{asText(error)}</p> : null}

      {tab === "places" ? (
        <section className="mt-6 space-y-4">
          <button
            type="button"
            onClick={startCreate}
            className="rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-foam"
          >
            Nueva ruta
          </button>

          {editing ? (
            <form
              onSubmit={savePlace}
              className="grid gap-3 rounded-xl border border-ink/10 bg-white p-4 sm:grid-cols-2"
            >
              <h2 className="sm:col-span-2 font-display text-xl">{title}</h2>
              {[
                ["title", "Título"],
                ["slug", "Slug"],
                ["summary", "Resumen"],
                ["coverImageUrl", "URL portada"],
                ["durationMinutes", "Duración (min)"],
                ["distanceKm", "Distancia (km)"],
                ["gpsLat", "Lat"],
                ["gpsLng", "Lng"],
              ].map(([key, label]) => (
                <label key={key} className="text-sm">
                  <span className="mb-1 block text-xs text-ink/50">{label}</span>
                  <input
                    className="w-full rounded-lg border border-ink/15 px-2 py-2"
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    required={["title", "slug"].includes(key)}
                  />
                </label>
              ))}
              <label className="text-sm">
                <span className="mb-1 block text-xs text-ink/50">Zona</span>
                <select
                  className="w-full rounded-lg border border-ink/15 px-2 py-2"
                  value={form.zone}
                  onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
                >
                  {ZONES.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs text-ink/50">Dificultad</span>
                <select
                  className="w-full rounded-lg border border-ink/15 px-2 py-2"
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, difficulty: e.target.value }))
                  }
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.hasPremium}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, hasPremium: e.target.checked }))
                  }
                />
                Tiene capa premium
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block text-xs text-ink/50">
                  Contenido gratis (markdown)
                </span>
                <textarea
                  rows={6}
                  className="w-full rounded-lg border border-ink/15 px-2 py-2 font-mono text-xs"
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                />
              </label>
              {form.hasPremium ? (
                <label className="text-sm sm:col-span-2">
                  <span className="mb-1 block text-xs text-ink/50">
                    Contenido premium (markdown)
                  </span>
                  <textarea
                    rows={6}
                    className="w-full rounded-lg border border-ink/15 px-2 py-2 font-mono text-xs"
                    value={form.premiumContent}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        premiumContent: e.target.value,
                      }))
                    }
                  />
                </label>
              ) : null}
              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block text-xs text-ink/50">PDF URL</span>
                <input
                  className="w-full rounded-lg border border-ink/15 px-2 py-2"
                  value={form.pdfUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pdfUrl: e.target.value }))
                  }
                />
              </label>
              {editing !== "new" ? (
                <label className="text-sm sm:col-span-2">
                  <span className="mb-1 block text-xs text-ink/50">
                    Subir PDF (Vercel Blob)
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadPdf(editing, file);
                    }}
                  />
                </label>
              ) : null}
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-white"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-ink/15 px-4 py-2 text-sm"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : null}

          <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
            {places.map((place) => (
              <li
                key={place.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{place.title}</p>
                  <p className="text-xs text-ink/50">
                    /{place.slug} · {place.hasPremium ? "premium" : "gratis"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-sm text-ocean"
                    onClick={() => startEdit(place)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-700"
                    onClick={() => removePlace(place.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "purchases" ? (
        <section className="mt-6 overflow-x-auto rounded-xl border border-ink/10 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-xs text-ink/50">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Importe</th>
                <th className="px-3 py-2">Cupón</th>
                <th className="px-3 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b border-ink/5">
                  <td className="px-3 py-2">{p.email}</td>
                  <td className="px-3 py-2">{formatEurosFromCents(p.amountPaid)}</td>
                  <td className="px-3 py-2">
                    {p.discountApplied ? p.discountCode || "sí" : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(p.createdAt).toLocaleString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {purchases.length === 0 ? (
            <p className="p-4 text-sm text-ink/50">Sin compras todavía.</p>
          ) : null}
        </section>
      ) : null}

      {tab === "discounts" ? (
        <section className="mt-6 space-y-4">
          <form
            onSubmit={createDiscount}
            className="flex flex-wrap items-end gap-2 rounded-xl border border-ink/10 bg-white p-4"
          >
            <label className="text-sm">
              <span className="mb-1 block text-xs text-ink/50">Código</span>
              <input
                className="rounded-lg border border-ink/15 px-2 py-2"
                value={newCode.code}
                onChange={(e) =>
                  setNewCode((c) => ({ ...c, code: e.target.value }))
                }
                required
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-ink/50">% dto.</span>
              <input
                type="number"
                min={1}
                max={100}
                className="w-24 rounded-lg border border-ink/15 px-2 py-2"
                value={newCode.percentOff}
                onChange={(e) =>
                  setNewCode((c) => ({
                    ...c,
                    percentOff: Number(e.target.value),
                  }))
                }
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-ocean px-3 py-2 text-sm font-semibold text-white"
            >
              Crear
            </button>
          </form>
          <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
            {discounts.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="font-medium">
                    {d.code} · {d.percentOff}%
                  </p>
                  <p className="text-xs text-ink/50">
                    usos: {d.usedCount} · {d.active ? "activo" : "inactivo"}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm text-ocean"
                  onClick={() => toggleDiscount(d.id, !d.active)}
                >
                  {d.active ? "Desactivar" : "Activar"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "access" ? (
        <section className="mt-6 space-y-4">
          <div className="rounded-xl border border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl text-forest">
              Acceso premium sin pagar (Samuel)
            </h2>
            <p className="mt-2 text-sm text-ink/65">
              Genera un magic link con cookie de 1 año (igual que un comprador).
              También, si inicias sesión aquí, las rutas premium se muestran
              desbloqueadas con banner «Vista admin».
            </p>
            <form onSubmit={grantAccess} className="mt-4 flex flex-wrap items-end gap-2">
              <label className="text-sm">
                <span className="mb-1 block text-xs text-ink/50">Email</span>
                <input
                  type="email"
                  required
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  className="min-w-[16rem] rounded-lg border border-ink/15 px-3 py-2"
                />
              </label>
              <button
                type="submit"
                disabled={grantLoading}
                className="rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {grantLoading ? "Generando…" : "Generar magic link"}
              </button>
            </form>
            {grantLink ? (
              <div className="mt-4 space-y-2 rounded-lg bg-ink/5 p-3 text-xs">
                <p className="font-medium text-ink/70">Magic link (ábrelo o cópialo):</p>
                <a
                  href={grantLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block break-all text-ocean underline"
                >
                  {grantLink}
                </a>
                <button
                  type="button"
                  className="rounded-md border border-ink/15 px-2 py-1 text-[11px] font-medium text-ink/70 hover:bg-ink/5"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(grantLink);
                      setMsg("Enlace copiado al portapapeles.");
                    } catch {
                      setMsg("No se pudo copiar; selecciónalo manualmente.");
                    }
                  }}
                >
                  Copiar enlace
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
