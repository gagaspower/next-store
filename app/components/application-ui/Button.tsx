import { FC } from "react";
import {
  BsFillPencilFill,
  BsFillTrash3Fill,
  BsPlus,
  BsArrowCounterclockwise,
} from "react-icons/bs";
type TBtnEdit = {
  onClick?: (row: any) => void;
};

type TBtnDelete = {
  onClick?: (row: any) => void;
};

type TBtnAdd = {
  label: string;
  onClick?: (row: any) => void;
};

type TBtnCancel = {
  label: string;
  onClick?: (row: any) => void;
};

type TBtnConf = {
  label: string;
  onClick?: (row?: any) => void;
};

export const BtnEdit: FC<TBtnEdit> = ({ onClick }) => {
  return (
    <button
      type="button"
      className="border border-gray-300 rounded-md p-2 hover:bg-gray-200"
      onClick={onClick}
    >
      <span className="text-gray-500">
        <BsFillPencilFill />
      </span>
    </button>
  );
};

export const BtnDelete: FC<TBtnDelete> = ({ onClick }) => {
  return (
    <button
      type="button"
      className="border border-gray-300 rounded-md p-2 hover:bg-gray-200"
      onClick={onClick}
    >
      <span className="text-gray-500">
        <BsFillTrash3Fill />
      </span>
    </button>
  );
};

export const BtnAdd: FC<TBtnAdd> = ({ onClick, label }) => {
  return (
    <button
      type="button"
      className="bg-gray-200 rounded-md flex p-2 group hover:bg-gray-300"
      onClick={onClick}
    >
      <span className="flex flex-row text-sm text-gray-500 items-center group-hover:text-gray-600">
        <BsPlus size={22} /> {label}
      </span>
    </button>
  );
};

export const BtnSubmit = ({
  type,
  label,
  loading,
  onClick,
}: {
  type?: "button" | "reset" | "submit";
  label: string;
  loading?: boolean;
  onClick?: () => void;
}) => {
  return (
    <>
      <button
        type={type ?? "submit"}
        className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
        onClick={onClick}
      >
        <span>{label}</span>
        {loading ? (
          <span className="relative only:-mx-5">
            <svg
              className="w-5 h-5 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="graphics-symbol"
              aria-labelledby="title-10 desc-10"
            >
              <title id="title-10">Icon title</title>
              <desc id="desc-10">A more detailed description of the icon</desc>
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        ) : null}
      </button>
    </>
  );
};

export const BtnCancel: FC<TBtnCancel> = ({ onClick, label }) => {
  return (
    <button
      type="button"
      className="bg-gray-200 rounded-md inline-flex group hover:bg-gray-300 h-10 px-4 py-2.5"
      onClick={onClick}
    >
      <span className="flex flex-row text-sm text-gray-500 items-center group-hover:text-gray-600">
        {label}
      </span>
    </button>
  );
};

export const BtnConfirm: FC<TBtnConf> = ({ label, onClick }) => {
  return (
    <button
      type="button"
      className="btn flex bg-blue-500 rounded-md hover:bg-blue-400"
      onClick={onClick}
    >
      <span className="text-white text-sm items-center font-normal">
        {label}
      </span>
    </button>
  );
};
