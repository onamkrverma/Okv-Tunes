import React, {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  useEffect,
  useState,
} from "react";

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
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
    // eslint-disable-next-line
  }, [id]);

  return (
    <img
      {...rest}
      src={imgSrc}
      alt={rest.alt}
      onError={() => {
        setImgSrc(fallbackSrc ?? "/logo-circle.svg");
      }}
    />
  );
};

export default ImageWithFallback;
