"use client";
import React from "react";
import ArrowLeftIcon from "@/public/icons/arrow-left.svg";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <div className="flex items-center">
      <button
        type="button"
        title="Go Back"
        onClick={() => router.back()}
        className="text-sm"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default BackButton;
