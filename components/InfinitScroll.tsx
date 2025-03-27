"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const InfinitScroll = () => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const [currentPage, setCurrentPage] = useState(page);
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const currentQuery = current.get("query");

  let timeoutId: NodeJS.Timeout;

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        if (scrollTop + clientHeight >= scrollHeight - 500) {
          if (currentPage < 5) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("page", nextPage.toString());
            window.history.replaceState({}, "", currentUrl.toString());
          }
        }
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [currentPage, currentQuery]);

  return null;
};

export default InfinitScroll;
