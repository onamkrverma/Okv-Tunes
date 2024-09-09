import LoadingIcon from "@/public/icons/loading.svg";
const Loading = ({ loadingText }: { loadingText?: string }) => {
  return (
    <div className="w-full h-full flex justify-center">
      <div className="flex flex-col justify-center items-center gap-2">
        <LoadingIcon className="w-10 h-10 text-primary" />
        {loadingText ? (
          <p className="capitalize font-semibold">{loadingText}...</p>
        ) : null}
      </div>
    </div>
  );
};

export default Loading;
