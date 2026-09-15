import Link from "next/link";
import { CASA_CUEVA_URL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-sand/60 dark:border-sand/10 dark:bg-ink/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-sand/60">
        <p>© {new Date().getFullYear()} ActividadesLaPalma</p>
        <p>
          Alojamientos:{" "}
          <Link
            href={CASA_CUEVA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ocean underline-offset-2 hover:underline"
          >
            Casa Cueva Las Palomas
          </Link>
        </p>
      </div>
    </footer>
  );
}
