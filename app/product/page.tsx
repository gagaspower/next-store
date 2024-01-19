import { publicApi } from "@/app/config/const";
import { TProduct, VariantStock } from "@/app/interface/product";
import { PRODUCT_IMAGE_URL } from "@/app/utils/fileUrl";
import { limitProductTitle, numberWithCommas } from "@/app/utils/func";
import Link from "next/link";

import React from "react";
import { Jarak } from "../component/application-ui/Spacing";
import withWebStore from "../hook/withWebStore";
import type { Metadata } from "next";
import Breadcrumbs from "../component/layouts/front/Breadcumbs";
import { Tbreadcumbs } from "../interface/breadcumb";
import Paginate from "../component/layouts/front/Paginate";

async function getFeaturedProduct({ page }: { page?: number }) {
  const response = await publicApi.get(`/public/all-product?page=${page}`);
  return response?.data;
}

export const metadata: Metadata = {
  title: "All Product",
};
async function Product({
  params,
  searchParams,
}: {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams?.page as string;
  const pages: number = parseInt(page) as number | 1;
  const featured = await getFeaturedProduct({ page: pages });

  const breadcumbs_link: Tbreadcumbs[] = [
    {
      page_title: "Produk",
      page_url: "/product",
    },
  ];
  return (
    <>
      <Breadcrumbs links={breadcumbs_link} />
      <section className="w-full md:max-w-6xl m-auto  mt-5 mb-5 bg-white p-5 min-h-screen">
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
                href="#"
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
        <div>
          <Paginate
            current_page={featured.current_page}
            per_page={featured.per_page}
            last_page={featured.last_page}
            total={featured.total}
          />
        </div>
      </section>
    </>
  );
}

export default withWebStore(Product);
