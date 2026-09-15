import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";

export async function PATCH(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await request.json();
  const code = await prisma.discountCode.update({
    where: { id: params.id },
    data: {
      ...(typeof body.active === "boolean" ? { active: body.active } : {}),
      ...(body.percentOff != null ? { percentOff: Number(body.percentOff) } : {}),
      ...(body.code ? { code: String(body.code).trim().toUpperCase() } : {}),
    },
  });
  return NextResponse.json(code);
}

export async function DELETE(_request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await prisma.discountCode.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
