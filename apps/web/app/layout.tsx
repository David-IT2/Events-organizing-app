import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gathergraze.com"),
  title: {
    default: "Gather & Graze | Private Chef Hire & Bespoke Event Catering",
    template: "%s | Gather & Graze",
  },
  description:
    "Book vetted private chefs for intimate dinner parties, weddings, corporate events and milestone celebrations. Bespoke menus, flawless service, in your own home.",
  openGraph: { type: "website", locale: "en_US", siteName: "Gather & Graze" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Gather & Graze",
  description:
    "Private chef hire and bespoke event catering for dinner parties, weddings, corporate events and milestone celebrations.",
  areaServed: "New York & Hamptons",
  url: "https://www.gathergraze.com",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
