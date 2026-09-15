import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin";
import { grantPremiumAccess } from "@/lib/grant-access";
import { SAMUEL_DEMO_EMAIL } from "@/lib/constants";

function requestOrigin(request) {
  try {
    const url = new URL(request.url);
    if (url.origin && url.origin !== "null") return url.origin;
  } catch {
    /* ignore */
  }
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  return "";
}

function errorMessage(err) {
  if (!err) return "No se pudo generar el acceso";
  if (typeof err === "string") return err;
  if (typeof err?.message === "string") return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return "No se pudo generar el acceso";
  }
}

/**
 * Admin: genera Purchase demo + magic link (cookie 1 año al abrirlo).
 * Body: { email?, sendEmail? } — por defecto email de Samuel.
 * Respuesta siempre con magicLink como string.
 */
export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || SAMUEL_DEMO_EMAIL)
      .trim()
      .toLowerCase();
    const sendEmail = body.sendEmail !== false;
    const appUrl = requestOrigin(request);

    const result = await grantPremiumAccess({
      email,
      sendEmail,
      source: "admin",
      appUrl,
    });

    const magicLink = String(result.magicLink || "");
    if (!magicLink.startsWith("http")) {
      throw new Error("No se pudo construir el magic link");
    }

    return NextResponse.json({
      ok: true,
      email: result.email,
      magicLink,
      url: magicLink,
      emailSkipped: Boolean(result.emailSkipped),
      message: result.emailSkipped
        ? "Magic link listo (email no enviado: falta RESEND_API_KEY). Copia el enlace."
        : "Magic link creado. Ábrelo para activar el acceso.",
    });
  } catch (err) {
    console.error("[admin/grant-access]", err);
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
