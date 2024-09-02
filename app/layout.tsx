import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SideNavbar from "@/components/SideNavbar";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

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
        <main className="container relative">
          <Navbar />
          <SideNavbar />
          {children}
        </main>
      </body>
    </html>
  );
}
