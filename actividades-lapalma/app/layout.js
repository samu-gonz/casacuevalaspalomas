import { Fraunces, Outfit } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentCTA from "@/components/PaymentCTA";
import ThemeScript from "@/components/ThemeScript";
import { canViewPremium } from "@/lib/access";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "ActividadesLaPalma",
    template: "%s · ActividadesLaPalma",
  },
  description:
    "Rutas y guías técnicas en La Palma. Capa gratis en cada ruta y pack premium de 6€ de por vida.",
  openGraph: {
    title: "ActividadesLaPalma",
    description:
      "Descubre La Palma con rutas guiadas. Pack técnico 6€, acceso de por vida.",
    locale: "es_ES",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  const premium = await canViewPremium();
  const hasAccess = premium.ok;

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} min-h-screen bg-sand font-sans text-ink antialiased dark:bg-ink dark:text-sand`}
      >
        <ThemeScript />
        <div
          className={`flex min-h-screen flex-col ${hasAccess ? "" : "pb-24 md:pb-8"}`}
        >
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <PaymentCTA hasAccess={hasAccess} />
      </body>
    </html>
  );
}
