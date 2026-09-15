import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";

export async function PUT(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const place = await prisma.place.update({
    where: { id: params.id },
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
  return NextResponse.json(place);
}

export async function DELETE(_request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await prisma.place.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
