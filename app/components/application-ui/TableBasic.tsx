"use client";
import React, { FC } from "react";

type TBasicHeader = {
  label: string;
  key: string;
  formatter?: (row: any) => void;
};

type TData = {
  data: any[];
  columns: TBasicHeader[];
};

const TableBasic: FC<TData> = ({ data, columns }) => {
  return (
    <>
      {/*<!-- Component: Responsive Table --> */}
      <table
        className="w-full text-left border border-separate rounded border-slate-200"
        cellSpacing="0"
      >
        <tbody>
          <tr>
            {columns?.map((column, index) => {
              return (
                <th
                  scope="col"
                  className="hidden h-12 px-6 text-sm font-medium border-l sm:table-cell first:border-l-0 stroke-slate-700 text-slate-700 bg-slate-100"
                  key={index}
                >
                  {column.label}
                </th>
              );
            })}
          </tr>
          {data?.map((d, index) => {
            return (
              <tr
                key={index}
                className="block border-b sm:table-row last:border-b-0 border-slate-200 sm:border-none"
              >
                {columns?.map((col, index) => {
                  return (
                    <td
                      data-th={col.label}
                      className="before:w-24 before:inline-block before:font-medium before:text-slate-700 before:content-[attr(data-th)':'] sm:before:content-none flex items-center sm:table-cell h-12 px-6 text-sm transition duration-300 sm:border-t sm:border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500 "
                      key={index}
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
      {/*<!-- End Responsive Table --> */}
    </>
  );
};

export default TableBasic;
