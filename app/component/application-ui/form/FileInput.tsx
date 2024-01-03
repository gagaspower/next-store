import React, { FC } from "react";

type TInput = {
  label?: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  inputRef?: React.RefObject<HTMLInputElement>;
  value?: File | null;
  error?: string;
};

const FileInput: FC<TInput> = ({
  label,
  name,
  onChange,
  maxWidth,
  inputRef,
  error,
}) => {
  return (
    <label
      className={`form-control w-full ${maxWidth ? `max-w-${maxWidth}` : ""}`}
    >
      {label && (
        <div className="label">
          <span className="label-text font-poppins text-sm">{label} :</span>
        </div>
      )}

      <input
        type="file"
        name={name}
        className={`file-input file-input-bordered w-full text-sm ${
          maxWidth ? `max-w-${maxWidth}` : ""
        } ${error ? "file-input-error" : ""}`}
        onChange={onChange}
        ref={inputRef}
      />
      {error ? (
        <p className="mt-1 text-pink-600 text-xs italic">*{error}</p>
      ) : null}
    </label>
  );
};

export default FileInput;
