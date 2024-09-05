import Image from "next/image";
import React from "react";

type Props = {
  title: string;
  imageSrc: string;
};
const Card = ({ title, imageSrc }: Props) => {
  return (
    <div
      className="flex flex-col gap-2 w-[180px] bg-secondary border rounded-md hover:shadow-primary cursor-pointer"
      title={title.slice(0, 30) + "..."}
    >
      <div className="w-[180px] h-[180px]">
        <Image
          src={imageSrc}
          alt={title + "okv tunes"}
          width={180}
          height={180}
          priority
          className="w-full h-full object-cover rounded-t-md"
        />
      </div>
      <p className="truncate px-2 pb-2 text-center">{title}</p>
    </div>
  );
};

export default Card;
