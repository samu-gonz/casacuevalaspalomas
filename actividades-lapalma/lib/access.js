import { cookies } from "next/headers";
import prisma from "./prisma";
import { isAdminAuthenticated } from "./admin";
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
    return false;
  }
}

/**
 * Acceso a contenido premium: compra (cookie) O sesión admin (vista previa).
 */
export async function canViewPremium() {
  if (await isAdminAuthenticated()) {
    return { ok: true, via: "admin" };
  }
  if (await hasPremiumAccess()) {
    return { ok: true, via: "purchase" };
  }
  return { ok: false, via: null };
}
