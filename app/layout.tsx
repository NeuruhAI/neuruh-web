import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SiteHeader } from "@/components/atlas/SiteHeader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ATLAS } from "@/lib/content/index";
import "./globals.css";

/* UNCERTAIN reconstruction: no turbopack module body. Inferred from cached HTML 042 (fonts, skip link, SiteHeader, body classes). */

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://neuruh.com"),
  title: ATLAS.title,
  description: ATLAS.description,
  applicationName: ATLAS.name,
  authors: [{ name: ATLAS.name }],
  robots: { index: true, follow: true },
  openGraph: {
    title: ATLAS.title,
    description: ATLAS.description,
    url: "https://neuruh.com",
    siteName: ATLAS.name,
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: ATLAS.title,
    description: ATLAS.description
  }
};

export const viewport: Viewport = {
  themeColor: "#f4f6f8"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink text-bone">
        <TooltipProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-bone focus:px-3 focus:py-2 focus:text-paper"
          >
            Skip to content
          </a>
          <SiteHeader />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
