import {
  DetailedHTMLProps,
  ForwardedRef,
  InputHTMLAttributes,
  ReactNode,
  useId,
} from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  leftAdornment?: ReactNode | ReactNode[];
  inputRef?: ForwardedRef<HTMLInputElement>;
}

const Input = ({
  label,
  leftAdornment,
  className,
  inputRef,
  ...rest
}: Props) => {
  const id = useId();

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-6 text-secondary-300  flex gap-1 mb-1"
        >
          {label}
        </label>
      ) : null}
      <div className="flex rounded-lg">
        {leftAdornment ? (
          <span className="inline-flex items-center rounded-l-lg pr-0 px-3 bg-secondary text-primary sm:text-sm">
            {leftAdornment}
          </span>
        ) : null}
        <input
          id={id}
          className={`text-primary w-full rounded-lg border-0 p-2 px-3 bg-secondary shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset transition-colors sm:text-sm sm:leading-6 focus-visible:outline-none
          ${leftAdornment ? "rounded-l-none" : "rounded-l-lg"} ${className}`}
          placeholder={label}
          ref={inputRef}
          {...rest}
        />
      </div>
    </div>
  );
};

export default Input;
