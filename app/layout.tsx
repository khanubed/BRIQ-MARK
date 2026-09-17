import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Anton,
  Archivo,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import StoreProvider from "../store/StoreProvider";
import SmoothScrollProvider from "../components/motion/SmoothScrollProvider";
import GlobalFluidBackground from "../components/fluid-effect/GlobalFluidBackground";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { SmoothCursor } from "../components/ui/smooth-cursor";
import { getOrganizationStructuredData } from "../lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-spacegrotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://navigotech.io",
  ),
  title: {
    default: "NAVIGO | Premium Strategic Growth Partner",
    template: "%s | NAVIGO",
  },
  description:
    "A bespoke digital marketing & growth agency engineering market dominance for luxury, high-growth, and enterprise brands across US, Canada, and UAE.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getOrganizationStructuredData();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${archivo.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#08080a] text-[#ededed] relative">
        <SmoothCursor />
        <StoreProvider>
          <SmoothScrollProvider>
            {/* Global Interactive Fluid Background */}
            {/* <GlobalFluidBackground /> */}

            <div className="relative z-10 flex-1 flex flex-col">
              <Navbar />
              <div className="flex-1 flex flex-col">{children}</div>
              <Footer />
            </div>
          </SmoothScrollProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
