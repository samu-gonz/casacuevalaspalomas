import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendAccessEmail } from "@/lib/email";
import { ACCESS_TOKEN_TTL_MS } from "@/lib/constants";

/**
 * Si el email tiene Purchase, crea nuevo AccessToken y reenvía magic link.
 * Respuesta genérica para no filtrar si el email existe.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email obligatorio" }, { status: 400 });
    }

    const purchase = await prisma.purchase.findFirst({ where: { email } });

    if (purchase) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_MS);
      await prisma.accessToken.create({
        data: { email, token, expiresAt },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const magicLink = `${appUrl}/api/access/verify?token=${token}`;
      await sendAccessEmail({ to: email, magicLink });
    }

    return NextResponse.json({
      message:
        "Si ese email tiene una compra, te hemos enviado un enlace de acceso.",
    });
  } catch (err) {
    console.error("[access/resend]", err);
    return NextResponse.json(
      { error: err.message || "No se pudo reenviar" },
      { status: 500 }
    );
  }
}
