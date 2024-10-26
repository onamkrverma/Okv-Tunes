"use client";
import React, { useEffect } from "react";
import { GlobalContextProvider } from "./GlobalContex";
import Navbar from "@/components/Navbar";
import SideNavbar from "@/components/SideNavbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import registerSw from "@/public/registerSw";
import AlertNotification from "@/components/AlertNotification";
const Plalyer = dynamic(() => import("@/components/Player"), { ssr: false });

const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  useEffect(() => {
    registerSw();
  }, []);

  const currentPath = usePathname();
  const hideSideNavbarPaths = ["/login", "/signup"];

  return (
    <GlobalContextProvider>
      <main className="container relative">
        <div className="absolute top-0 w-full h-48 -z-10 flex items-center justify-end rounded-full">
          <span className="bg-custom_gradient block w-3/4 h-full blur-3xl" />
        </div>
        {!hideSideNavbarPaths.includes(currentPath) ? <Navbar /> : null}
        {!hideSideNavbarPaths.includes(currentPath) ? <SideNavbar /> : null}
        {children}
        {!hideSideNavbarPaths.includes(currentPath) ? (
          <AlertNotification />
        ) : null}
        {!hideSideNavbarPaths.includes(currentPath) ? <Plalyer /> : null}
        {!hideSideNavbarPaths.includes(currentPath) ? <Footer /> : null}
      </main>
    </GlobalContextProvider>
  );
};

export default ClientLayout;
