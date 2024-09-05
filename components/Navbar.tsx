import React from "react";
import Input from "./Input";
import SearchIcon from "@/public/icons/search.svg";

const Navbar = () => {
  return (
    <header className="page-container !mt-0 !p-4 flex items-center justify-center sticky top-0 left-0 backdrop-blur-lg bg-primary/50 px-10 py-2 border-b">
      <div className="w-80 border rounded-lg">
        <Input
          type="search"
          leftAdornment={<SearchIcon className="w-6 h-6" />}
          placeholder="search songs"
          className="focus:!ring-0"
        />
      </div>
    </header>
  );
};

export default Navbar;
