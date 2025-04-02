"use client";
import Link from "next/link";
import React from "react";
import ImageWithFallback from "./ImageWithFallback";
import { useGlobalContext } from "@/app/GlobalContex";

const GreetUser = () => {
  const { session } = useGlobalContext();

  return (
    <Link href={"/profile"} className="flex items-center gap-2 w-fit">
      {session?.user?.image ? (
        <ImageWithFallback
          id={session.user.id}
          src={session?.user?.image ?? "/logo-circle.svg"}
          alt="user"
          className=" w-10 h-10 rounded-full"
        />
      ) : (
        <p className="uppercase bg-action text-primary rounded-full p-1 h-10 w-10 text-center text-2xl font-bold">
          {session ? session.user?.name?.at(0) : "G"}
        </p>
      )}

      <h1 className="text-2xl font-bold capitalize truncate max-w-60">
        Hi, {session ? session.user?.name : "guest"}
      </h1>
    </Link>
  );
};

export default GreetUser;
