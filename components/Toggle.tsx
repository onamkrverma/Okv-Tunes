"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
type Props = {
  toggleList: string[];
  activeToggle: string;
  setActiveToggle: Dispatch<SetStateAction<string>>;
};
const Toggle = ({ toggleList, activeToggle, setActiveToggle }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleActiveToggle = (item: string) => {
    setActiveToggle(item);
    const current = new URLSearchParams(searchParams);
    current.set("type", item);
    router.replace(`${pathname}?${current.toString()}`);
  };

  return (
    <div className="flex gap-4 items-center overflow-x-auto">
      {toggleList.map((item, index) => (
        <button
          key={index}
          type="button"
          title={item}
          onClick={() => handleActiveToggle(item)}
          className={`p-1.5 px-3 rounded-lg capitalize  border bg-secondary hover:bg-neutral-800 ${
            activeToggle === item ? "!bg-neutral-100 !text-neutral-900" : ""
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default Toggle;
