import React, { FC } from "react";

type TInput = {
  label?: string;
  placeholder?: string;
  name: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  error?: string;
};

const AreaInput: FC<TInput> = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  maxWidth,
  error,
}) => {
  return (
    <label
      className={`form-control w-full ${
        maxWidth ? `max-w-${maxWidth}` : "max-w-lg"
      }`}
    >
      {label && (
        <div className="label">
          <span className="label-text font-poppins text-sm">{label} :</span>
        </div>
      )}

      <textarea
        placeholder={placeholder}
        className={`textarea textarea-bordered textarea-lg w-full text-sm ${
          maxWidth ? `max-w-${maxWidth}` : "max-w-lg"
        } ${error ? "border-pink-600" : ""}`}
        onChange={onChange}
        name={name}
        value={value}
      />

      {error ? (
        <p className="mt-1 text-pink-600 text-xs italic">*{error}</p>
      ) : null}
    </label>
  );
};

export default AreaInput;
