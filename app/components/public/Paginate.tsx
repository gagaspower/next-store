"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

type TPaginate = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const PaginateProduct: FC<TPaginate> = ({
  current_page,
  last_page,
  // per_page,
  // total,
}) => {
  const router = useRouter();
  const [page, setPage] = useState<number>(0);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const pageQuery = searchParams.get("page");
  const handlePrev = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setPage(page - 1);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setPage(page + 1);
  };

  useEffect(() => {
    if (search) {
      router.push(`/product?page=${page}&search=${search}`);
    } else {
      router.push(`/product?page=${page}`);
    }
  }, [page, router, search]);

  useEffect(() => {
    if (pageQuery) {
      setPage(Number(pageQuery));
    } else {
      setPage(1);
    }
  }, [pageQuery]);

  return (
    <>
      {/*<!-- Component: Minimal basic pagination with icons and text --> */}
      <nav role="navigation" aria-label="Pagination Navigation">
        <div className="flex list-none items-center justify-center text-sm text-slate-700 md:gap-2">
          <button
            type="button"
            className={`inline-flex h-10 items-center justify-center gap-4 rounded stroke-slate-700 px-4 text-sm font-medium text-slate-700 transition duration-300 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600 focus-visible:outline-none ${
              current_page === 1
                ? "hover:cursor-not-allowed"
                : "hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500"
            }`}
            disabled={current_page === 1 ? true : false}
            onClick={(e) => handlePrev(e)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-mx-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              role="graphics-symbol"
              aria-labelledby="title-09 desc-09"
            >
              <title id="title-09">Previous page</title>
              <desc id="desc-09">link to previous page</desc>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Prev</span>
          </button>
          <div className="flex gap-2">
            <span>{current_page}</span>
            <span>/</span>
            <span>{last_page}</span>
          </div>
          <button
            type="button"
            className={`inline-flex h-10 items-center justify-center gap-4 rounded stroke-slate-700 px-4 text-sm font-medium text-slate-700 transition duration-300 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600 focus-visible:outline-none ${
              current_page === last_page
                ? "hover:cursor-not-allowed"
                : "hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500"
            }`}
            disabled={current_page === last_page ? true : false}
            onClick={(e) => handleNext(e)}
          >
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-mx-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              role="graphics-symbol"
              aria-labelledby="title-10 desc-10"
            >
              <title id="title-10">Next page</title>
              <desc id="desc-10">link to next page</desc>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </nav>
      {/*<!-- End Minimal basic pagination with icons and text --> */}
    </>
  );
};

export default PaginateProduct;
