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
          <div className="absolute top-0 w-full h-48 -z-10 flex items-center justify-end rounded-full">
            <span className="bg-custom_gradient block w-3/4 h-full blur-3xl" />
          </div>
          <Navbar />
          <SideNavbar />
          {children}
        </main>
      </body>
    </html>
  );
}
