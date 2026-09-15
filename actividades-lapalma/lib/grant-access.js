import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendAccessEmail } from "@/lib/email";
import { ACCESS_TOKEN_TTL_MS } from "@/lib/constants";

function resolveAppUrl(explicitUrl) {
  const raw =
    explicitUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  const url = typeof raw === "string" ? raw.trim() : "";
  if (!url || url === "[object Object]") {
    return "http://localhost:3000";
  }
  return url.replace(/\/$/, "");
}

/**
 * Crea (o reutiliza) Purchase demo + AccessToken y opcionalmente envía email.
 * Usado por admin para que Samuel vea premium sin Stripe.
 *
 * @param {{ email: string, sendEmail?: boolean, source?: string, appUrl?: string }} opts
 */
export async function grantPremiumAccess({
  email,
  sendEmail = true,
  source = "admin",
  appUrl: appUrlOption,
} = {}) {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Email inválido");
  }

  const stripeSessionId = `${source}-${normalized}-${crypto
    .randomBytes(4)
    .toString("hex")}`;

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
        discountCode: String(source).toUpperCase(),
      },
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_MS);
  await prisma.accessToken.create({
    data: { email: normalized, token, expiresAt },
  });

  const appUrl = resolveAppUrl(appUrlOption);
  const magicLink = `${appUrl}/api/access/verify?token=${token}`;

  let emailResult = { skipped: true };
  if (sendEmail) {
    emailResult = await sendAccessEmail({ to: normalized, magicLink });
  }

  return {
    email: normalized,
    magicLink: String(magicLink),
    emailSkipped: Boolean(emailResult?.skipped),
  };
}
