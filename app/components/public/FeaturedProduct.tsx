import { publicApi } from "@/utils/httpClient";
import { TProduct, VariantStock } from "@/interface/product";
import { PRODUCT_IMAGE_URL } from "@/utils/const";
import { limitProductTitle, numberWithCommas } from "@/utils/func";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

import React from "react";
import { Jarak } from "@/components/application-ui/Spacing";

async function getFeaturedProduct() {
  const response = await publicApi.get(`/public/featured-product`);
  return response?.data;
}

export default async function FeaturedProduct() {
  const featured = await getFeaturedProduct();

  return (
    <div className="bg-white p-3">
      <div className="flex justify-between items-center border-b border-gray-200 mb-3 w-full">
        <h2 className="font-poppins font-bold">Produk terbaru :</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {featured?.data?.map((product: TProduct, index: number) => {
          let price: number = product.product_price;
          if (product.variants_stock.length > 0) {
            const minPrice = Math.min(
              ...product.variants_stock.map(
                (p: VariantStock) => p.product_varian_price
              )
            );
            price = minPrice;
          }
          return (
            <Link
              className="card card-compact w-full md:max-w-56 bg-base-100 shadow-md rounded-none group hover:border border-orange-300"
              key={index}
              href={`/product/detail/${product.product_slug}`}
            >
              <figure>
                <img
                  src={`${PRODUCT_IMAGE_URL}/${product?.product_image}`}
                  alt={product?.product_name}
                  className="max-h-64 object-contain"
                />
              </figure>
              <div className="card-body">
                <h2 className="font-normal text-md font-poppins group-hover:text-orange-500">
                  {limitProductTitle(product?.product_name)}
                </h2>
                <h2 className="font-semibold text-md font-poppins text-orange-500">
                  Rp. {numberWithCommas(price)}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
      <Jarak />
      <Link href="/product" className="flex justify-center">
        <span className="flex items-center gap-2 text-sm hover:underline">
          Tampilkan Lainnya <BsArrowRight />
        </span>
      </Link>
      <Jarak />
    </div>
  );
}
