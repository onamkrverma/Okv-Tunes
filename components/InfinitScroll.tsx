"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "./Loading";

const Scroll = () => {
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
          if (currentPage < 4) {
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

  useEffect(() => {
    if (currentPage === 1) return;
    setCurrentPage(0);
  }, [currentQuery]);

  useEffect(() => {
    const handleBackButton = () => {
      const url = new URL(window.location.href);
      if (url.searchParams.has("page")) {
        url.searchParams.set("page", "1");
        window.history.replaceState({}, "", url.toString());
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      // window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return null;
};

const InfinitScroll = () => {
  return (
    <Suspense fallback={<Loading loadingText="Loading" />}>
      <Scroll />
    </Suspense>
  );
};

export default InfinitScroll;
