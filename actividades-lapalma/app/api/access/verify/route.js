import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ACCESS_COOKIE, ACCESS_COOKIE_MAX_AGE } from "@/lib/constants";

/**
 * Valida magic link → cookie httpOnly 1 año → redirect a /rutas.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${appUrl}/rutas?acceso=invalido`);
  }

  try {
    const record = await prisma.accessToken.findUnique({ where: { token } });
    if (!record) {
      return NextResponse.redirect(`${appUrl}/rutas?acceso=invalido`);
    }
    if (record.expiresAt.getTime() < Date.now()) {
      return NextResponse.redirect(`${appUrl}/rutas?acceso=caducado`);
    }

    if (!record.usedAt) {
      await prisma.accessToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
    }

    const response = NextResponse.redirect(`${appUrl}/rutas?acceso=ok`);
    response.cookies.set(ACCESS_COOKIE, record.email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });
    return response;
  } catch (err) {
    console.error("[access/verify]", err);
    return NextResponse.redirect(`${appUrl}/rutas?acceso=error`);
  }
}
