import Link from "next/link";
import React from "react";
import Logo from "@/public/logo-full.svg";
import HomeIcon from "@/public/icons/home.svg";

const SideNavbar = () => {
  const navLinks = [{ title: "Home", icon: HomeIcon, link: "/" }];

  return (
    <section className="flex flex-col gap-2 pt-4 p-6 w-[var(--side-nav-width)] h-full bg-secondary border border-l fixed top-0 left-0  ">
      <div className="">
        <Link href={"/"} className="flex items-center">
          <Logo />
        </Link>
      </div>
      <nav>
        <ul>
          {navLinks.map((navLink, index) => (
            <li key={index}>
              <Link
                href={navLink.link}
                className="flex items-center gap-2 hover:bg-neutral-800 p-2 px-3 rounded-lg "
              >
                {<navLink.icon className="w-6 h-6" />}
                <p>{navLink.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default SideNavbar;
