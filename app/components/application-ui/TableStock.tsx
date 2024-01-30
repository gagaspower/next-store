"use client";
import React, { FC } from "react";

type THeader = {
  label: string;
  key: string;
  formatter?: (item?: any, index?: any) => void;
};

type TData = {
  columns?: THeader[];
  data?: any[];
};

const TableStock: FC<TData> = ({ columns, data }) => {
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
                        {col.formatter ? col.formatter(d, d.index) : d[col.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableStock;
