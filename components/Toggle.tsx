import React, { Dispatch, SetStateAction } from "react";
type Props = {
  toggleList: string[];
  activeToggle: string;
  setActiveToggle: Dispatch<SetStateAction<string>>;
};
const Toggle = ({ toggleList, activeToggle, setActiveToggle }: Props) => {
  return (
    <div className="flex gap-4 items-center ">
      {toggleList.map((item, index) => (
        <button
          key={index}
          type="button"
          title={item}
          onClick={() => setActiveToggle(item)}
          className={`bg-secondary p-2 px-3 rounded-lg shadow shadow-neutral-700 hover:bg-neutral-700 ${
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
