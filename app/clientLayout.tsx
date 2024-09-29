"use client";
import React, { useEffect } from "react";
import { GlobalContextProvider } from "./GlobalContex";
import Navbar from "@/components/Navbar";
import SideNavbar from "@/components/SideNavbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
const Plalyer = dynamic(() => import("@/components/Player"), { ssr: false });

const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    // New update available
                    if (confirm("New content is available; please refresh.")) {
                      window.location.reload();
                    }
                  } else {
                    // Content is cached for offline use
                    console.log("Content is cached for offline use.");
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
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
  );
};

export default ClientLayout;
