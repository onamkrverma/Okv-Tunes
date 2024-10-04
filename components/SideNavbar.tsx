"use client";
import Link from "next/link";
import React from "react";
import Logo from "@/public/logo-full.svg";
import HomeIcon from "@/public/icons/home.svg";
import ArtistsIcon from "@/public/icons/artists.svg";
import ChartIcon from "@/public/icons/chart.svg";
import HeartIcon from "@/public/icons/heart.svg";
import { usePathname } from "next/navigation";
import LogoutIcon from "@/public/icons/logout.svg";
import { logoutAction } from "@/app/actions/auth";

const SideNavbar = () => {
  const navLinks = [
    {
      title: "Home",
      icon: HomeIcon,
      link: "/",
    },
    {
      title: "Chart",
      icon: ChartIcon,
      link: "/chart",
    },
    {
      title: "Artists",
      icon: ArtistsIcon,
      link: "/artists",
    },
    {
      title: "Liked",
      icon: HeartIcon,
      link: "/liked",
    },
  ];
  const currentPath = usePathname();

  const handleLogout = async () => {
    if ("serviceWorker" in navigator) {
      console.log("first");
      const sw = await navigator.serviceWorker.getRegistration("/sw.js");
      await sw?.unregister();
    }
    await logoutAction();
  };

  return (
    <>
      <section className="hidden sm:flex flex-col gap-2 pt-4 p-6 w-[var(--side-nav-width)] h-full bg-secondary border border-l fixed top-0 left-0 z-10 ">
        <Link href={"/"} title="Okv Tunes logo" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex flex-col justify-between h-full">
          <nav className="my-4">
            <ul>
              {navLinks.map((navLink, index) => (
                <li key={index}>
                  <Link
                    href={navLink.link}
                    className={`flex items-center gap-2 my-1 hover:bg-neutral-700 p-2 px-3 rounded-lg ${
                      currentPath === navLink.link ? "bg-neutral-800" : ""
                    }`}
                  >
                    {<navLink.icon className="w-6 h-6" />}
                    <p>{navLink.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-2 my-1 hover:bg-neutral-700 p-2 px-3 rounded-lg"
            >
              <LogoutIcon className="w-6 h-6" /> Logout
            </button>
          </form>
        </div>
      </section>

      {/* for mobile navigation */}
      <nav className="sm:hidden block w-full fixed bottom-0 right-0 z-10">
        <div className="flex items-center justify-evenly gap-2 p-2 bg-primary border-t border-neutral-400 backdrop-blur-md text-primary">
          {navLinks.map((navLink, index) => (
            <Link
              key={index}
              href={navLink.link}
              title={navLink.title}
              className={`flex flex-col items-center rounded-md p-1 px-2 ${
                currentPath === navLink.link ? "bg-neutral-800" : ""
              }`}
            >
              {<navLink.icon className="w-6 h-6" />}
              <small>{navLink.title}</small>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default SideNavbar;
