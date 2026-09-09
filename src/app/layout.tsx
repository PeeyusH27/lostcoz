import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope, Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Cursor from "@/components/motion/Cursor";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import { site } from "@/data/site";

const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });
const garamond = EB_Garamond({ subsets: ["latin"], variable: "--font-garamond", display: "swap", style: ["normal", "italic"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  icons: { icon: "/brand/logo-emblem-512.png" },
  openGraph: { title: site.name, description: site.description, images: ["/brand/logo-full-onblack.png"], type: "website" },
};
export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${manrope.variable} ${cinzel.variable} ${garamond.variable}`}>
      <body className="bg-canvas font-body text-fg">
        <SmoothScroll>
          <Nav />
          {/* isolate: the travelling card (fixed, z-1) lives inside this stacking context, under z-2 content */}
          <div className="relative isolate">
            <main>{children}</main>
            <Footer />
          </div>
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
