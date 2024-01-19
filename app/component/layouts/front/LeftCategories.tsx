"use client";
import { publicApi } from "@/app/config/const";
import { TCategory } from "@/app/interface/category";
import React, { useEffect, useState } from "react";
import SpinLoading from "../../application-ui/Spinner";
import { DefaultImageStore } from "@/app/asset/img";
import { CATEGORY_IMAGE_URL } from "@/app/utils/fileUrl";
import Link from "next/link";
import Image from "next/image";

const LeftCategories = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TCategory[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response = await publicApi.get(`/public/category`);
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching categories : ", error);
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const Skeleton = () => {
    return (
      <div className="flex flex-col gap-4 w-52">
        <div className="flex gap-4 items-center">
          <div className="skeleton w-6 h-6 rounded-full shrink-0"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-5 w-20"></div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="skeleton w-6 h-6 rounded-full shrink-0"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-5 w-20"></div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="skeleton w-6 h-6 rounded-full shrink-0"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-5 w-20"></div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="skeleton w-6 h-6 rounded-full shrink-0"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-5 w-20"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          {data?.map((category: TCategory, index: number) => {
            let ImageForCategory: any = DefaultImageStore;
            if (category.category_image) {
              ImageForCategory =
                CATEGORY_IMAGE_URL + "/" + category.category_image;
            }
            return (
              <Link href="#" key={index} className="p-2">
                <span className="flex items-center gap-4">
                  <Image
                    src={ImageForCategory}
                    width={25}
                    height={25}
                    alt={category.category_name}
                  />
                  {category.category_name}
                </span>
              </Link>
            );
          })}
        </>
      )}
    </>
  );
};

export default LeftCategories;
