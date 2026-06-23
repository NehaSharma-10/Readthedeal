import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1F2D7F",
};

export const metadata: Metadata = {
  title: "Read the Deal - Analyze Contracts & Messages Before You Sign",
  description: "Instantly understand contracts, leases, and agreements. Detect scams and phishing. Spot hidden fees and unfavorable terms in seconds. Free, no signup required.",
  keywords: ["contract analysis", "contract review", "scam detection", "phishing detection", "lease review", "agreement analyzer", "hidden fees", "legal terms explained"],
  authors: [{ name: "Read the Deal" }],
  creator: "Read the Deal",
  publisher: "Read the Deal",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    url: "https://readthedeal.vercel.app",
    title: "Read the Deal - Understand Contracts Before You Sign",
    description: "Free contract and message analyzer. Spot hidden fees, cancellation traps, and scam indicators in seconds.",
    images: [
      {
        url: "https://readthedeal.vercel.app/hero-1.png",
        width: 1200,
        height: 630,
        alt: "Read the Deal - Contract Analysis",
        type: "image/png",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Read the Deal - Understand Contracts Before You Sign",
    description: "Free contract analysis. Spot hidden fees and scam indicators instantly.",
    images: ["https://readthedeal.vercel.app/hero-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://readthedeal.vercel.app",
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/header-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        {/* Preconnect to external services for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/header-logo.png" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-paper text-ink font-sans flex flex-col overflow-x-hidden">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
