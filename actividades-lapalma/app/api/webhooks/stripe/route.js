import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendAccessEmail } from "@/lib/email";
import { ACCESS_TOKEN_TTL_MS } from "@/lib/constants";

export const runtime = "nodejs";

/**
 * Webhook Stripe: checkout.session.completed → Purchase + AccessToken + email.
 * Verifica firma con STRIPE_WEBHOOK_SECRET. No confiar en el body sin verificar.
 */
export async function POST(request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook no configurado" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma ausente" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] firma inválida", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = (
      session.customer_details?.email ||
      session.customer_email ||
      session.metadata?.email ||
      ""
    )
      .trim()
      .toLowerCase();

    if (!email) {
      console.error("[webhook] sesión sin email", session.id);
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const amountPaid = session.amount_total ?? 0;
    const discountCode = session.metadata?.discountCode || null;
    const discountApplied = session.metadata?.discountApplied === "1";

    try {
      // Idempotencia por stripeSessionId único.
      await prisma.purchase.upsert({
        where: { stripeSessionId: session.id },
        create: {
          email,
          stripeSessionId: session.id,
          amountPaid,
          discountApplied,
          discountCode: discountCode || null,
        },
        update: {
          email,
          amountPaid,
          discountApplied,
          discountCode: discountCode || null,
        },
      });

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_MS);

      await prisma.accessToken.create({
        data: { email, token, expiresAt },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const magicLink = `${appUrl}/api/access/verify?token=${token}`;

      await sendAccessEmail({ to: email, magicLink });
    } catch (err) {
      console.error("[webhook] persistencia/email", err);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
