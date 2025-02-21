"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import CrossIcon from "@/public/icons/cross.svg";

const AlertNotification = () => {
  const { alertMessage, setGlobalState } = useGlobalContext();

  const handleClose = () => {
    setGlobalState((prev) => ({
      ...prev,
      alertMessage: { isAlertVisible: false, message: "" },
    }));
  };

  return (
    <div
      className={`${
        alertMessage?.isAlertVisible ? "flex" : "hidden"
      } items-center justify-between gap-2 fixed left-4 sm:bottom-20 bottom-40 z-20 border bg-neutral-800 rounded-md p-2 px-3`}
    >
      <p className="text-sm">{alertMessage?.message}</p>
      <button
        type="button"
        title="close"
        className="hover:bg-action p-1 rounded-lg"
        onClick={handleClose}
      >
        <CrossIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AlertNotification;
