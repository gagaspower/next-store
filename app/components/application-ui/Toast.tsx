import { toast } from "react-toastify";

const TOAST_TIMING = 3000;
const TOAST_POSITION = "top-right";

export const useToastAlert = () => {
  const toastInfo = (message: string) => {
    return toast.info(message, {
      position: TOAST_POSITION,
      autoClose: TOAST_TIMING,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  const toastSuccess = (message: string) => {
    return toast.success(message, {
      position: TOAST_POSITION,
      autoClose: TOAST_TIMING,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  const toastError = (message: string) => {
    return toast.error(message, {
      position: TOAST_POSITION,
      autoClose: TOAST_TIMING,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  return { toastInfo, toastSuccess, toastError };
};
