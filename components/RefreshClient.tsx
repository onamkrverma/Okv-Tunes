"use client";
import React, { useState } from "react";
import RefreshIcon from "@/public/icons/refresh.svg";
import { useRouter } from "next/navigation";

const RefreshClient = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const hanldeRefresh = () => {
    setIsLoading(true);
    router.refresh();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      onClick={hanldeRefresh}
      className="flex items-center justify-center gap-2 text-xs border bg-neutral-800 hover:bg-secondary rounded-md p-1 px-2"
    >
      <RefreshIcon className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
      Refresh
    </button>
  );
};

export default RefreshClient;
