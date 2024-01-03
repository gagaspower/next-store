import React, { FC } from "react";

type TInput = {
  label?: string;
  placeholder?: string;
  type: "text" | "password" | "number" | "email";
  name: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  error?: string;
};

const TextInput: FC<TInput> = ({
  label,
  placeholder,
  type,
  name,
  value,
  onChange,
  maxWidth,
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
        type={type}
        name={name}
        placeholder={placeholder}
        className={`input input-bordered w-full text-sm ${
          maxWidth ? `max-w-${maxWidth}` : ""
        } ${error ? "border-pink-600" : ""}`}
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
      {error ? (
        <p className="mt-1 text-pink-600 text-xs italic">*{error}</p>
      ) : null}
    </label>
  );
};

export default TextInput;
