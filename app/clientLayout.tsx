"use client";
import React, { useEffect, useState } from "react";
import { GlobalContextProvider } from "./GlobalContex";
import Navbar from "@/components/Navbar";
import SideNavbar from "@/components/SideNavbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
// import registerSw from "@/public/registerSw";
import { usePathname } from "next/navigation";
import AlertNotification from "@/components/AlertNotification";
import LoadingBar from "@/components/LoadingBar";
const Plalyer = dynamic(() => import("@/components/Player"), { ssr: false });

const ClientLayout = ({
  children,
  authToken,
}: Readonly<{
  children: React.ReactNode;
  authToken?: string;
}>) => {
  // useEffect(() => {
  //   registerSw();
  // }, []);

  const currentPath = usePathname();
  const hideSideNavbarPaths = ["/login", "/signup"];
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!window.navigator.onLine);
    window.addEventListener("offline", () => {
      setIsOffline(true);
    });
    window.addEventListener("online", () => {
      setIsOffline(false);
    });
  }, []);

  return (
    <GlobalContextProvider authToken={authToken}>
      <main className="container relative">
        <LoadingBar />
        <div className="absolute top-0 w-full h-48 -z-10 flex items-center justify-end rounded-full">
          <span className="bg-custom_gradient block w-3/4 h-full blur-3xl" />
        </div>
        <div
          className="!hidden"
          style={{
            textAlign: "center",
            margin: "5px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "18px",
          }}
        >
          <p style={{ color: "red" }}>⚠️There is a problem</p>
          <p style={{ margin: "0" }}>Unable to fetch existing caches data</p>
          <p>Please clear site data or caches data manualy!</p>
        </div>
        {isOffline ? (
          <div
            className={`${
              !hideSideNavbarPaths.includes(currentPath)
                ? "inner-container"
                : ""
            } !my-0 bg-[#b22222] text-center`}
          >
            <p className="text-white text-sm py-0.5">
              ⚠️No Internet Connection !
            </p>
          </div>
        ) : null}
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
