"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { PACK_PRICE_LABEL } from "@/lib/constants";

/**
 * CTA de conversión siempre visible (excepto /admin).
 * Desktop: panel sticky. Móvil: barra fija inferior.
 */
export default function PaymentCTA({ hasAccess = false }) {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");

  if (pathname?.startsWith("/admin")) return null;
  if (hasAccess) return null;

  async function startCheckout(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() || undefined,
          discountCode: code.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo iniciar el pago");
      if (data.url) window.location.href = data.url;
      else throw new Error("Stripe no devolvió URL de Checkout");
    } catch (err) {
      setError(err.message || "Error de checkout");
    } finally {
      setLoading(false);
    }
  }

  async function resendAccess(e) {
    e.preventDefault();
    setResendMsg("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/access/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo reenviar");
      setResendMsg(
        data.message || "Te hemos enviado el enlace de acceso. Revisa tu correo."
      );
    } catch (err) {
      setError(err.message || "Error al reenviar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Desktop sticky */}
      <aside className="pointer-events-none fixed bottom-6 right-6 z-50 hidden w-[21rem] md:block">
        <div className="pointer-events-auto overflow-hidden rounded-2xl border border-white/10 bg-[#12100e]/95 text-sand shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <div className="border-b border-white/10 bg-gradient-to-br from-ocean/30 to-transparent px-4 py-3">
            <p className="font-display text-lg leading-tight text-foam">
              Pack técnico {PACK_PRICE_LABEL}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-sand/70">
              Tracks, tipología del terreno, variantes y PDFs de{" "}
              <strong className="font-medium text-sand">todas</strong> las rutas
              premium — de por vida.
            </p>
          </div>
          <div className="px-4 py-3">
            <CheckoutForm
              email={email}
              setEmail={setEmail}
              code={code}
              setCode={setCode}
              loading={loading}
              error={error}
              resendMsg={resendMsg}
              showResend={showResend}
              setShowResend={setShowResend}
              onCheckout={startCheckout}
              onResend={resendAccess}
            />
          </div>
        </div>
      </aside>

      {/* Mobile fixed bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="border-t border-white/10 bg-[#12100e]/95 text-sand backdrop-blur-md">
          {!expanded ? (
            <div className="flex items-center gap-3 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="min-w-0 flex-1">
                <p className="font-display text-base leading-tight text-foam">
                  Pack {PACK_PRICE_LABEL} · acceso de por vida
                </p>
                <p className="truncate text-[11px] text-sand/60">
                  Desbloquea todo el contenido técnico premium
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="shrink-0 rounded-lg bg-ocean px-4 py-2.5 text-sm font-semibold text-white"
              >
                Comprar
              </button>
            </div>
          ) : (
            <div className="px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="font-display text-base text-foam">
                  Pack técnico {PACK_PRICE_LABEL}
                </p>
                <button
                  type="button"
                  className="text-xs text-sand/55"
                  onClick={() => setExpanded(false)}
                >
                  Cerrar
                </button>
              </div>
              <p className="mb-3 text-[11px] leading-relaxed text-sand/65">
                Una compra = tracks, guías técnicas y PDFs de todas las rutas
                premium, para siempre.
              </p>
              <CheckoutForm
                email={email}
                setEmail={setEmail}
                code={code}
                setCode={setCode}
                loading={loading}
                error={error}
                resendMsg={resendMsg}
                showResend={showResend}
                setShowResend={setShowResend}
                onCheckout={startCheckout}
                onResend={resendAccess}
                compact
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CheckoutForm({
  email,
  setEmail,
  code,
  setCode,
  loading,
  error,
  resendMsg,
  showResend,
  setShowResend,
  onCheckout,
  onResend,
  compact = false,
}) {
  return (
    <form onSubmit={showResend ? onResend : onCheckout} className="flex flex-col gap-2">
      <input
        type="email"
        required={showResend}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={showResend ? "Email de la compra" : "Email (para el acceso)"}
        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-sand placeholder:text-sand/40 outline-none ring-ocean/50 focus:ring-2"
      />
      {!showResend ? (
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Cupón (opcional)"
          className={`w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-sand placeholder:text-sand/40 outline-none ring-ocean/50 focus:ring-2 ${
            compact ? "py-2" : ""
          }`}
        />
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-ocean px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
      >
        {loading
          ? "Un momento…"
          : showResend
            ? "Reenviar enlace de acceso"
            : `Pagar ${PACK_PRICE_LABEL} y desbloquear`}
      </button>
      <button
        type="button"
        className="text-left text-[11px] text-sand/55 underline-offset-2 hover:text-sand/80 hover:underline"
        onClick={() => setShowResend((v) => !v)}
      >
        {showResend ? "Volver al pago" : "¿Ya compraste? Reenviar acceso"}
      </button>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
      {resendMsg ? <p className="text-xs text-foam">{resendMsg}</p> : null}
    </form>
  );
}
