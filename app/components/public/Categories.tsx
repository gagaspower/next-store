import { DefaultImageStore } from "@/asset/img";
import { publicApi } from "@/utils/httpClient";
import { TCategory } from "@/interface/category";
import { CATEGORY_IMAGE_URL } from "@/utils/const";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function getProductCategories() {
  const response = await publicApi.get(`/public/category`);
  return response?.data;
}
export default async function Categories() {
  const categories = await getProductCategories();

  return (
    <div className="bg-white  my-3">
      <div className="p-3">
        <h2 className="font-poppins font-bold">Kategori :</h2>
      </div>
      <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mx-auto ">
        {categories.map((cat: TCategory, index: number) => {
          let ImageForCategory: any = DefaultImageStore;
          if (cat.category_image) {
            ImageForCategory = CATEGORY_IMAGE_URL + "/" + cat.category_image;
          }
          return (
            <Link
              href={`/category/${cat.category_slug}`}
              key={index}
              className="flex flex-wrap border border-collapse sm:border-separate border-slate-100 group hover:border hover:border-green-500 hover:shadow-md"
            >
              <div className="flex flex-col justify-center items-center m-auto p-5 gap-2">
                <Image
                  src={ImageForCategory}
                  alt="Shoes"
                  width={64}
                  height={64}
                  className="rounded-xl w-full max-w-16 object-contain h-16"
                />
                <span className="font-thin font-poppins text-xs sm:text-sm md:text-md lg:text-md">
                  {cat.category_name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
