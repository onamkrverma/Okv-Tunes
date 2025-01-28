"use client";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

interface ImageWithFallbackProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  fallbackSrc?: string;
  id?: string;
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const { src, fallbackSrc, id, ...rest } = props;

  return (
    <img
      {...rest}
      src={src}
      alt={rest.alt}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = fallbackSrc ?? "/logo-circle.svg";
      }}
    />
  );
};

export default ImageWithFallback;
