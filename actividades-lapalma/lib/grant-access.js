import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendAccessEmail } from "@/lib/email";
import { ACCESS_TOKEN_TTL_MS } from "@/lib/constants";
// TTL magic link (7 días)
// Purchase + AccessToken: acceso de por vida sin Stripe (demo admin).

/**
 * Crea (o reutiliza) Purchase de demo + AccessToken y opcionalmente envía email.
 * Usado por admin para que Samuel vea premium sin Stripe.
 */
export async function grantPremiumAccess({
  email,
  sendEmail = true,
  source = "admin",
}) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Email inválido");
  }

  const stripeSessionId = `${source}-${normalized}-${crypto
    .randomBytes(4)
    .toString("hex")}`;

  // Una sola purchase “demo” estable por email+source para no llenar la tabla.
  const existing = await prisma.purchase.findFirst({
    where: {
      email: normalized,
      stripeSessionId: { startsWith: `${source}-${normalized}` },
    },
  });

  if (!existing) {
    await prisma.purchase.create({
      data: {
        email: normalized,
        stripeSessionId,
        amountPaid: 0,
        discountApplied: true,
        discountCode: source.toUpperCase(),
      },
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_MS);
  await prisma.accessToken.create({
    data: { email: normalized, token, expiresAt },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const magicLink = `${appUrl}/api/access/verify?token=${token}`;

  let emailResult = { skipped: true, magicLink };
  if (sendEmail) {
    emailResult = await sendAccessEmail({ to: normalized, magicLink });
  }

  return { email: normalized, magicLink, emailResult };
}
