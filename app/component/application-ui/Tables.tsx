"use client";
import { TPaginate } from "@/app/interface/paginate";
import React, { FC } from "react";

type THeader = {
  label: string;
  key: string;
  formatter?: (item: any) => void;
};

type TData = {
  columns?: THeader[];
  data?: any[];
  meta?: TPaginate;
  page?: number;
  limit?: number;
  handleNext?: () => void;
  handlePrev?: () => void;
};

const Tables: FC<TData> = ({
  columns,
  data,
  meta,
  page,
  limit,
  handleNext,
  handlePrev,
}) => {
  return (
    <div className="rounded-lg border border-gray-200">
      <div className="overflow-x-auto rounded-t-lg">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="font-poppins font-bold">
            <tr>
              {columns?.map((column, index) => {
                return (
                  <th className="px-4 py-2 text-left text-gray-900" key={index}>
                    {column.label}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 font-poppins">
            {data?.map((d, index) => {
              return (
                <tr key={index}>
                  {columns?.map((col, index) => {
                    return (
                      <td
                        className="whitespace-nowrap px-4 py-2 text-gray-900"
                        key={col.key}
                      >
                        {col.formatter ? col.formatter(d) : d[col.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {meta ? (
        <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
          <div className="flex justify-end gap-5 text-xs font-medium items-center ">
            <button
              type="button"
              className={`inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-900 rtl:rotate-180 ${
                page === 1
                  ? "btn-disabled cursor-not-allowed"
                  : "hover:bg-gray-300 hover:text-gray-500"
              }`}
              onClick={handlePrev}
            >
              <span className="sr-only">Prev Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <span className="max-w-8">
              {page} / {meta?.total_page}
            </span>

            <button
              type="button"
              className={`inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-900 rtl:rotate-180 ${
                page === meta?.total_page
                  ? "btn-disabled cursor-not-allowed"
                  : "hover:bg-gray-300 hover:text-gray-500"
              }`}
              onClick={handleNext}
            >
              <span className="sr-only">Next Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Tables;
