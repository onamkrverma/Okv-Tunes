"use client";
import { Session } from "next-auth";
import React from "react";
import LogoutIcon from "@/public/icons/logout.svg";
import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";

const LoginLogout = ({ session }: { session: Session | null }) => {
  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  return (
    <div>
      {session ? (
        <form action={handleLogout}>
          <button
            type="submit"
            title="logout"
            className="flex items-center gap-2 text-xs bg-neutral-800 hover:bg-secondary p-2 px-3 rounded-lg"
          >
            <LogoutIcon className="w-6 h-6" /> Logout
          </button>
        </form>
      ) : (
        <Link
          href={"/login"}
          title="login"
          className="flex items-center gap-2 text-xs bg-neutral-800 hover:bg-secondary p-2 px-3 rounded-lg"
        >
          <LogoutIcon className="w-6 h-6 rotate-180" /> Login
        </Link>
      )}
    </div>
  );
};

export default LoginLogout;
