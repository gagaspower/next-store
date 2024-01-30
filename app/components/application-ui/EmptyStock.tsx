"use client";
import { Box } from "@/asset/img";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";
const EmptyStock = () => {
  const searchParam = useSearchParams();
  const search = searchParam.get("search");
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Image src={Box} width={250} height={250} alt="empty product" />
      <span className="font-poppins ">
        {search ? (
          <>
            Oops!! tidak ditemukan produk dengan kata kunci:
            <span className="font-bold italic"> {search} </span>
          </>
        ) : (
          <>Oops !! produk tidak tersedia</>
        )}
      </span>
    </div>
  );
};

export default EmptyStock;
