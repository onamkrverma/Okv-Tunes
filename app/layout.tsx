import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";
import { GoogleTagManager } from "@next/third-parties/google";
import { cookies } from "next/headers";

const poppins = Poppins({
  display: "swap",
  weight: ["200", "400", "500", "600"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0d0d0d" }],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Okv Tunes - Listen to Trending Music for Free | Ad-Free Streaming",
  description:
    "Listen to Unlimited Songs for Free on Okv Tunes! Enjoy ad-free streaming of trending Bollywood, Indian Pop, Punjabi, Haryanvi, Tamil, and Telugu hits. Start listening now!",
  keywords: [
    "Free music app",
    "No ads music streaming",
    "Unlimited music streaming",
    "Ad-free songs",
    "Music without ads",
    "Free music player",
    "Online music streaming",
    "High-quality music streaming",
    "Free music downloads",
    "Non-stop music streaming",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_MY_SERVER_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "fXdwObHVbw1lHf43nqKlsB7ZwhohZGTglPx2CY4RAVg",
  },
  icons: [
    { rel: "icon", url: "/android-chrome-192x192.png" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  openGraph: {
    type: "website",
    url: "/",
    title: "Okv Tunes - Listen to Trending Music for Free | Ad-Free Streaming",
    description:
      "Listen to Unlimited Songs for Free on Okv Tunes! Enjoy ad-free streaming of trending Bollywood, Indian Pop, Punjabi, Haryanvi, Tamil, and Telugu hits. Start listening now!",
    siteName: "Okv-Tunes",
    images: [
      {
        url: "/logo-circle.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-5G23KL35" />
      <body className={poppins.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
