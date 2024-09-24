import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";

const poppins = Poppins({
  display: "swap",
  weight: ["200", "400", "500", "600"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0d0d0d" }],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Listen to Trending Music for Free | Ad-Free Streaming on Okv-Tunes",
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

  // verification: {
  //   google: "",
  // },
  icons: [
    { rel: "icon", url: "/android-chrome-192x192.png" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  openGraph: {
    type: "website",
    url: "/",
    title: "Listen to Trending Music for Free | Ad-Free Streaming on Okv-Tunes",
    description:
      "Listen to Unlimited Songs for Free on Okv Tunes! Enjoy ad-free streaming of trending Bollywood, Indian Pop, Punjabi, Haryanvi, Tamil, and Telugu hits. Start listening now!",
    siteName: "Okv-Tunes",
    images: [
      {
        url: "/logo-full.svg",
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
      <body className={poppins.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
