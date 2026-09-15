import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { PACK_PRICE_CENTS } from "@/lib/constants";

/**
 * Crea sesión Stripe Checkout (pago único 600 céntimos).
 * discountCode opcional → percentOff en DB → cupón Stripe efímero.
 */
export async function POST(request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        {
          error:
            "STRIPE_SECRET_KEY no configurada. Añádela en .env para probar el checkout.",
        },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = body.email?.trim().toLowerCase() || undefined;
    const rawCode = body.discountCode?.trim().toUpperCase() || "";

    let percentOff = 0;
    let discountCode = null;

    if (rawCode) {
      discountCode = await prisma.discountCode.findUnique({
        where: { code: rawCode },
      });
      if (!discountCode || !discountCode.active) {
        return NextResponse.json(
          { error: "Cupón no válido o inactivo" },
          { status: 400 }
        );
      }
      percentOff = discountCode.percentOff;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const discounts = [];
    if (percentOff > 0) {
      // Cupón de un solo uso en esta sesión (no depende de cupones previos en Stripe).
      const coupon = await stripe.coupons.create({
        percent_off: percentOff,
        duration: "once",
        name: `ALP ${rawCode}`,
      });
      discounts.push({ coupon: coupon.id });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: PACK_PRICE_CENTS,
            product_data: {
              name: "ActividadesLaPalma — Pack técnico",
              description:
                "Acceso de por vida a todas las guías técnicas premium (tracks, terreno, PDFs).",
            },
          },
        },
      ],
      discounts: discounts.length ? discounts : undefined,
      success_url: `${appUrl}/rutas?pago=ok`,
      cancel_url: `${appUrl}/rutas?pago=cancelado`,
      metadata: {
        email: email || "",
        discountCode: rawCode || "",
        discountApplied: percentOff > 0 ? "1" : "0",
        percentOff: String(percentOff || 0),
      },
    });

    if (discountCode && percentOff > 0) {
      await prisma.discountCode.update({
        where: { id: discountCode.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: err.message || "Error al crear Checkout" },
      { status: 500 }
    );
  }
}
