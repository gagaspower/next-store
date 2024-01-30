import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import withWebStore from "@/context/withWebStore";
import { publicApi } from "@/utils/httpClient";
import { TProduct, VariantStock } from "@/interface/product";
import { PRODUCT_IMAGE_URL } from "@/utils/const";
import { limitProductTitle, numberWithCommas } from "@/utils/func";
import { Jarak } from "@/components/application-ui/Spacing";
import dynamic from "next/dynamic";
import EmptyStock from "@/components/application-ui/EmptyStock";
const PaginateProduct = dynamic(() => import("@/components/public/Paginate"));

async function getFeaturedProduct({
  page,
  search,
}: {
  page?: number;
  search?: string;
}) {
  let url: string;
  if (search) {
    url = `/public/all-product?page=${page}&search=${search}`;
  } else {
    url = `/public/all-product?page=${page}`;
  }

  const response = await publicApi.get(url);
  return response?.data?.data;
}

export const metadata: Metadata = {
  title: "Semua Product",
};
async function Product({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams?.page as string;
  const search = searchParams?.search as string;
  const pages: number = parseInt(page) as number | 1;

  const featured = await getFeaturedProduct({ page: pages, search: search });

  return (
    <>
      <section className="w-full md:max-w-6xl m-auto  mt-5 mb-5 bg-white p-5 min-h-screen">
        {featured?.data?.length > 0 ? (
          <>
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
            <div>
              <PaginateProduct
                current_page={featured.current_page}
                per_page={featured.per_page}
                last_page={featured.last_page}
                total={featured.total}
              />
            </div>
          </>
        ) : (
          <EmptyStock />
        )}
      </section>
    </>
  );
}

export default withWebStore(Product);
