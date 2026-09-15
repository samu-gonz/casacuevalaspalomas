import { cookies } from "next/headers";
import prisma from "./prisma";
import { ACCESS_COOKIE } from "./constants";

/**
 * Lee la cookie de sesión premium (email) y comprueba que exista una Purchase.
 * Una compra desbloquea TODO el premium de por vida.
 */
export async function getAccessEmail() {
  const jar = await cookies();
  const email = jar.get(ACCESS_COOKIE)?.value?.trim().toLowerCase();
  if (!email) return null;
  return email;
}

export async function hasPremiumAccess() {
  const email = await getAccessEmail();
  if (!email) return false;

  try {
    const purchase = await prisma.purchase.findFirst({
      where: { email },
      select: { id: true },
    });
    return Boolean(purchase);
  } catch {
    // Sin DATABASE_URL / DB caída: tratar como sin acceso.
    return false;
  }
}
