import { NextResponse } from "next/server";
import {
  createAdminCookieValue,
  isValidAdminPassword,
} from "@/lib/admin";
import { ADMIN_COOKIE } from "@/lib/constants";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!isValidAdminPassword(body.password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = createAdminCookieValue();
  if (!token) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD no configurada en el servidor" },
      { status: 503 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
