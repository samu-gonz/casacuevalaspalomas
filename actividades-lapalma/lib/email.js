import { Resend } from "resend";
import { PACK_PRICE_LABEL } from "./constants";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

/**
 * Envía magic link de acceso premium vía Resend.
 * No lanza si falta API key: loguea y continúa (útil en local sin secretos).
 */
export async function sendAccessEmail({ to, magicLink }) {
  const resend = getResend();
  const from = process.env.EMAIL_FROM || "ActividadesLaPalma <onboarding@resend.dev>";

  if (!resend) {
    console.warn("[email] RESEND_API_KEY ausente. Magic link:", magicLink);
    return { skipped: true, magicLink };
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: `Tu acceso premium ActividadesLaPalma (${PACK_PRICE_LABEL})`,
    html: `
      <p>Hola,</p>
      <p>Ya tienes acceso de por vida a todo el contenido técnico premium de ActividadesLaPalma.</p>
      <p><a href="${magicLink}">Abrir mi acceso</a></p>
      <p>Si el botón no funciona, copia este enlace:<br/>${magicLink}</p>
      <p>— ActividadesLaPalma</p>
    `,
  });

  if (error) {
    console.error("[email] Resend error", error);
    throw new Error(error.message || "No se pudo enviar el email");
  }

  return { id: data?.id, magicLink };
}
