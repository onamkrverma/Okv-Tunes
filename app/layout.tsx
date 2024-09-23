import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SideNavbar from "@/components/SideNavbar";
import dynamic from "next/dynamic";
import { GlobalContextProvider } from "./GlobalContex";
import Footer from "@/components/Footer";

const poppins = Poppins({
  display: "swap",
  weight: ["200", "400", "500", "600"],
  subsets: ["latin"],
});
const Plalyer = dynamic(() => import("@/components/Player"), { ssr: false });

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
        <GlobalContextProvider>
          <main className="container relative">
            <div className="absolute top-0 w-full h-48 -z-10 flex items-center justify-end rounded-full">
              <span className="bg-custom_gradient block w-3/4 h-full blur-3xl" />
            </div>
            <Navbar />
            <SideNavbar />
            {children}
            <Plalyer />
            <Footer />
          </main>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
