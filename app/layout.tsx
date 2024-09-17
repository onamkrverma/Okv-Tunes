import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SideNavbar from "@/components/SideNavbar";
import dynamic from "next/dynamic";
import { GlobalContextProvider } from "./GlobalContex";

const poppins = Poppins({
  display: "swap",
  weight: ["200", "400", "500", "600"],
  subsets: ["latin"],
});
const Plalyer = dynamic(() => import("@/components/Player"), { ssr: false });

export const metadata: Metadata = {
  title: "Okv Tunes",
  description: "Okv Tunes",
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
          </main>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
