import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin";
import { grantPremiumAccess } from "@/lib/grant-access";
import { SAMUEL_DEMO_EMAIL } from "@/lib/constants";

/**
 * Admin: genera Purchase demo + magic link (cookie 1 año al abrirlo).
 * Body: { email?, sendEmail? } — por defecto email de Samuel.
 */
export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || SAMUEL_DEMO_EMAIL).trim().toLowerCase();
    const sendEmail = body.sendEmail !== false;

    const result = await grantPremiumAccess({
      email,
      sendEmail,
      source: "admin",
    });

    return NextResponse.json({
      ok: true,
      email: result.email,
      magicLink: result.magicLink,
      emailSkipped: Boolean(result.emailResult?.skipped),
      message: result.emailResult?.skipped
        ? "Magic link listo (email no enviado: falta RESEND_API_KEY). Copia el enlace."
        : "Magic link creado y email enviado si Resend está configurado.",
    });
  } catch (err) {
    console.error("[admin/grant-access]", err);
    return NextResponse.json(
      { error: err.message || "No se pudo generar el acceso" },
      { status: 500 }
    );
  }
}
