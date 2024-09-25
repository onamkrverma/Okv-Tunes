"use client";
import { latestHists, topChartPlaylists } from "@/utils/playlists";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Footer = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const urlSlug = (title: string, id: string) =>
    `/playlist/${encodeURIComponent(
      title.replaceAll(" ", "-").toLowerCase()
    )}-${id}`;

  return (
    <div className="inner-container border-t !pt-10 !pb-28 sm:!pb-10">
      <div className="flex gap-10 flex-wrap">
        <div>
          <p className="text-lg">Latest Songs</p>
          <ul>
            {latestHists.map((item, index) => (
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
            {topChartPlaylists.map((item, index) => (
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
