"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Offline = () => {
  const router = useRouter();

  const handleRefresh = () => {
    if (window.navigator.onLine) {
      const historyLength = window.history.length;
      if (historyLength > 0) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      handleRefresh();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className="inner-container flex flex-col items-center">
      <div className="flex flex-col gap-2 items-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 36 36"
          className="w-14 h-14"
        >
          <circle
            cx="18"
            cy="29.54"
            r="3"
            fill="currentColor"
            className="clr-i-solid clr-i-solid-path-1"
          />
          <path
            fill="currentColor"
            d="m29.18 17.71l.11-.17a1.51 1.51 0 0 0-.47-2.1A20.57 20.57 0 0 0 18 12.37c-.56 0-1.11 0-1.65.07l3.21 3.21a17.4 17.4 0 0 1 7.6 2.52a1.49 1.49 0 0 0 2.02-.46"
            className="clr-i-solid clr-i-solid-path-2"
          />
          <path
            fill="currentColor"
            d="M32.76 9.38a27.9 27.9 0 0 0-22.58-3.11l2.63 2.63a24.68 24.68 0 0 1 18.29 3.22a1.49 1.49 0 0 0 2-.46l.11-.17a1.51 1.51 0 0 0-.45-2.11"
            className="clr-i-solid clr-i-solid-path-3"
          />
          <path
            fill="currentColor"
            d="m3 4.75l3.1 3.1a27 27 0 0 0-2.92 1.57a1.51 1.51 0 0 0-.48 2.11l.11.17a1.49 1.49 0 0 0 2 .46a24.7 24.7 0 0 1 3.67-1.9l3.14 3.14a20.6 20.6 0 0 0-4.53 2.09a1.51 1.51 0 0 0-.46 2.1l.11.17a1.49 1.49 0 0 0 2 .46A17.5 17.5 0 0 1 14.25 16l3.6 3.6a13.4 13.4 0 0 0-6.79 1.93a1.5 1.5 0 0 0-.46 2.09l.1.16a1.52 1.52 0 0 0 2.06.44a10.2 10.2 0 0 1 9-.7L29 30.75l1.41-1.41l-26-26Z"
            className="clr-i-solid clr-i-solid-path-4"
          />
          <path fill="none" d="M0 0h36v36H0z" />
        </svg>
        <h1>No Internet</h1>
        <p>Opps... You are currently offline</p>
        <ul className="list-disc pl-5 space-y-2 text-start">
          <li className="text-xs ">Check Internet Connection</li>
          <li className="text-xs">Ensure Wi-Fi or mobile data is on</li>
          <li className="text-xs ">Wait a few minutes and try again later</li>
        </ul>

        <button
          type="button"
          title="refresh"
          onClick={handleRefresh}
          className="bg-neutral-800 p-2 rounded-md"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Offline;
