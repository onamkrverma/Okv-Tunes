"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LoadingBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    const timeoutId = setTimeout(handleComplete, 800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, searchParams]);

  return (
    isLoading && (
      <div className="w-full h-[2px] fixed top-0 left-0 z-20 ">
        <div className="animate-loadingBar transition-transform delay-300 bg-action w-full h-full"></div>
      </div>
    )
  );
};

export default LoadingBar;
