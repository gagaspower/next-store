import React, { FC } from "react";

type TSelectProps = {
  label?: string;
  value: string;
  name: string;
  onChangeInput: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  error?: any;
};

const SelectInput: FC<TSelectProps> = ({
  label,
  value,
  name,
  onChangeInput,
  children,
  error,
}) => {
  return (
    <label className="form-control w-full max-w-lg">
      {label && (
        <div className="label">
          <span className="label-text font-poppins text-sm">{label} :</span>
        </div>
      )}
      <select
        className={`select select-bordered ${error ? "border-pink-600" : ""}`}
        onChange={onChangeInput}
        name={name}
        value={value}
      >
        <option value="0">pilih</option>
        {children}
      </select>
      {error ? (
        <p className="mt-1 text-pink-600 text-xs italic">*{error}</p>
      ) : null}
    </label>
  );
};

export default SelectInput;
