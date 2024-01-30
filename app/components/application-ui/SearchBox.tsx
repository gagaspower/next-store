"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SearchBox() {
  const [search, setSearch] = useState<string>("");

  const router = useRouter();

  const searchParams = useSearchParams();
  const searchDefault = searchParams.get("search");

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (search !== "") {
        router.push(`/product?page=1&search=${search}`);
      } else {
        router.push(`/product?page=1`);
      }
    }
  };

  useEffect(() => {
    if (searchDefault) {
      setSearch(searchDefault);
    }
  }, [searchDefault]);

  return (
    <>
      {/*    <!-- Component: Rounded large search input  --> */}
      <div className="relative my-6">
        <input
          id="search"
          type="text"
          name="search"
          placeholder="Cari produk"
          value={search}
          className="flex relative w-full md:w-72 h-12 px-4 pr-12 transition-all border rounded outline-none  border-slate-200 text-slate-500 autofill:bg-white  focus:border-emerald-500 focus:outline-none text-sm"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-6 h-6 cursor-pointer top-3 right-4 stroke-slate-400 peer-disabled:cursor-not-allowed"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          aria-labelledby="title-9 description-9"
          role="graphics-symbol"
        >
          <title id="title-9">Search icon</title>
          <desc id="description-9">Icon description here</desc>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      {/*    <!-- End Rounded large search input  --> */}
    </>
  );
}
