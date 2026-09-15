import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Diagnóstico de deploy: no expone secretos. */
export async function GET() {
  const hasDb = Boolean(process.env.DATABASE_URL);
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY);
  const hasAdmin = Boolean(process.env.ADMIN_PASSWORD);
  let placeCount = null;
  let sample = [];
  let dbError = null;
  try {
    placeCount = await prisma.place.count();
    sample = await prisma.place.findMany({
      take: 3,
      select: { slug: true, title: true },
      orderBy: { title: "asc" },
    });
  } catch (err) {
    dbError = err.message || String(err);
  }
  return NextResponse.json({
    ok: !dbError,
    hasDb,
    hasStripe,
    hasAdmin,
    placeCount,
    sample,
    dbError,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || null,
  });
}
