"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";

const InfinitScroll = ({}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentLimit = parseInt(searchParams.get("limit") ?? "20");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 500) {
        if (currentLimit < 50) {
          setIsLoading(true);
          const current = new URLSearchParams(
            Array.from(searchParams.entries())
          );
          const limitIncrease = currentLimit + 10;
          current.set("limit", limitIncrease.toString());
          const search = current.toString();
          const query = search ? `?${search}` : "";
          router.replace(`${pathname}${query}`, { scroll: false });
        }
      }
      if (currentLimit >= 50) {
        setIsLoading(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentLimit]);

  return isLoading ? <Loading /> : null;
};

export default InfinitScroll;
