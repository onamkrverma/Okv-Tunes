"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Input from "./Input";
import SearchIcon from "@/public/icons/search.svg";
import CrossIcon from "@/public/icons/cross.svg";
import Link from "next/link";
import Logo from "@/public/logo-full.svg";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isSearchClick, setIsSearchClick] = useState(false);
  const navigate = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formInput = e.target.elements[0] as HTMLInputElement;
    const searchQuery = formInput.value;
    if (searchQuery) {
      navigate.push(`/search?query=${searchQuery}`);
      e.target.reset();
    }
  };

  useEffect(() => {
    if (isSearchClick) {
      inputRef.current?.focus();
    }
  }, [isSearchClick]);

  return (
    <header className="inner-container !my-0 !p-4 flex items-center justify-between sm:justify-center sticky top-0 left-0 backdrop-blur-lg bg-primary/50 px-10 py-2 border-b z-10">
      <Link
        href={"/"}
        title="Okv Tunes logo"
        className="flex items-center sm:hidden"
      >
        <Logo />
      </Link>
      <button
        type="button"
        title="search"
        className="block sm:hidden absolute right-4"
        onClick={() => setIsSearchClick(!isSearchClick)}
      >
        {!isSearchClick ? (
          <SearchIcon className="w-6 h-6" />
        ) : (
          <CrossIcon className="w-6 h-6" />
        )}
      </button>
      <form
        className={`sm:w-96 w-10/12 border rounded-lg sm:static absolute sm:translate-x-0 transition-transform duration-500 ${
          isSearchClick ? "translate-x-0" : "-translate-x-[200%]"
        }`}
        onSubmit={handleSubmit}
      >
        <Input
          type="search"
          name="search"
          inputRef={inputRef}
          leftAdornment={<SearchIcon className="w-6 h-6" />}
          placeholder="Search songs, artists or albums"
          className="focus:!ring-0"
        />
        <button type="submit" className="hidden"></button>
      </form>
    </header>
  );
};

export default Navbar;
