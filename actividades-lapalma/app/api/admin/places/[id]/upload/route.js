import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";

/**
 * Sube PDF a Vercel Blob y actualiza place.pdfUrl.
 */
export async function POST(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN no configurado" },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Archivo PDF requerido" }, { status: 400 });
  }

  const blob = await put(`places/${params.id}/${file.name}`, file, {
    access: "public",
    contentType: file.type || "application/pdf",
  });

  const place = await prisma.place.update({
    where: { id: params.id },
    data: { pdfUrl: blob.url },
  });

  return NextResponse.json({ url: blob.url, place });
}
