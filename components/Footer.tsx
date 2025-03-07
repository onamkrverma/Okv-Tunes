"use client";
import { latestHists, topChartPlaylists } from "@/utils/playlists";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

let deferredPrompt: BeforeInstallPromptEvent | null = null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Footer = () => {
  const pathname = usePathname();
  const [installable, setInstallable] = useState(false);

  const footerLinks = [
    { title: "Contact Us", link: "/contact" },
    { title: "Privacy Policy", link: "/privacy" },
    { title: "Terms of Use", link: "/terms" },
    { title: "Sitemap", link: "/sitemap.xml" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const urlSlug = (title: string, id: string) =>
    `/playlist/${encodeURIComponent(
      title.replaceAll(" ", "-").toLowerCase()
    )}-${id}`;

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      e.preventDefault();
      deferredPrompt = event;
      setInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler
      );
    };
  }, []);

  const handleInstallClick = () => {
    setInstallable(false);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
      });
    }
  };

  return (
    <div className="inner-container border-t !pt-10 !pb-28 sm:!pb-10">
      <div className="flex gap-10 flex-wrap">
        <div>
          <p className="text-lg">Latest Songs</p>
          <ul>
            {latestHists.map((item) => (
              <li key={item.id}>
                <Link
                  href={urlSlug(item.title, item.id)}
                  className={`flex items-center gap-2 my-1 text-sm text-neutral-400 hover:text-neutral-200`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-lg">Browse</p>
          <ul>
            {topChartPlaylists.map((item) => (
              <li key={item.id}>
                <Link
                  href={urlSlug(item.title, item.id)}
                  className={`flex items-center gap-2 my-1 text-sm text-neutral-400 hover:text-neutral-200`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-lg">About</p>
          <ul>
            {footerLinks.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.link}
                  className={`flex items-center gap-2 my-1 text-sm text-neutral-400 hover:text-neutral-200`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {installable && (
          <div>
            <p className="text-lg">Download The App</p>
            <button type="button" onClick={handleInstallClick}>
              <img
                src="/install_pwa.svg"
                alt="install-pwa"
                className="w-40 my-2"
              />
            </button>
          </div>
        )}
      </div>
      <small className="border-t w-full flex justify-end my-2 pt-2 text-neutral-400">
        © 2024
        {new Date().getFullYear() > 2024
          ? `-${new Date().getFullYear()}`
          : ""}{" "}
        Okv-Tunes All rights reserved.
      </small>
    </div>
  );
};

export default Footer;
