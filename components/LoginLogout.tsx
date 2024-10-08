"use client";
import { Session } from "next-auth";
import React from "react";
import LogoutIcon from "@/public/icons/logout.svg";
import LoginIcon from "@/public/icons/login.svg";
import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";
import { defaultState, useGlobalContext } from "@/app/GlobalContex";

const LoginLogout = ({ session }: { session: Session | null }) => {
  const { setGlobalState } = useGlobalContext();

  const clearAllCaches = async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    if ("serviceWorker" in navigator) {
      const sw = await navigator.serviceWorker.getRegistration("/sw.js");
      await sw?.unregister();
    }
    window.localStorage.clear();
  };

  const handleLogout = async () => {
    await clearAllCaches();
    await logoutAction();
    setGlobalState(defaultState);
    window.location.href = "/login";
  };

  return (
    <div>
      {session ? (
        <form action={handleLogout}>
          <button
            type="submit"
            title="logout"
            className="flex items-center gap-2 text-xs bg-neutral-800 hover:bg-secondary p-2 rounded-lg"
          >
            <LogoutIcon className="w-6 h-6" /> Logout
          </button>
        </form>
      ) : (
        <Link
          href={"/login"}
          title="login"
          className="flex items-center gap-2 text-xs bg-neutral-800 hover:bg-secondary p-2 rounded-lg"
        >
          <LoginIcon className="w-6 h-6" /> Login
        </Link>
      )}
    </div>
  );
};

export default LoginLogout;
