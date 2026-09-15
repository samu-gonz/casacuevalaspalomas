import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(purchases);
}
