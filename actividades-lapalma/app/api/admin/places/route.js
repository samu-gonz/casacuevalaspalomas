import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";

async function guard() {
  return isAdminAuthenticated();
}

export async function GET() {
  if (!(await guard())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const places = await prisma.place.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(places);
}

export async function POST(request) {
  if (!(await guard())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const place = await prisma.place.create({
    data: {
      slug: String(body.slug).trim(),
      title: String(body.title).trim(),
      summary: String(body.summary || ""),
      hasPremium: Boolean(body.hasPremium),
      zone: String(body.zone || ""),
      difficulty: String(body.difficulty || ""),
      durationMinutes: Number(body.durationMinutes) || 0,
      distanceKm: Number(body.distanceKm) || 0,
      coverImageUrl: String(body.coverImageUrl || ""),
      gpsLat: Number(body.gpsLat) || 0,
      gpsLng: Number(body.gpsLng) || 0,
      content: String(body.content || ""),
      premiumContent: body.premiumContent ? String(body.premiumContent) : null,
      pdfUrl: body.pdfUrl ? String(body.pdfUrl) : null,
    },
  });
  return NextResponse.json(place, { status: 201 });
}
