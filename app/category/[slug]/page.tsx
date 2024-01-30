import withWebStore from "@/context/withWebStore";
import React from "react";
import type { Metadata } from "next";

import { publicApi } from "@/utils/httpClient";
import { Jarak } from "@/components/application-ui/Spacing";
import Link from "next/link";
import { CATEGORY_IMAGE_URL, PRODUCT_IMAGE_URL } from "@/utils/const";
import { TProduct, VariantStock } from "@/interface/product";
import { limitProductTitle, numberWithCommas } from "@/utils/func";
import EmptyStock from "@/components/application-ui/EmptyStock";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const response = await publicApi.get(`/public/categories/${slug}`);
  const category = response.data.data;

  return {
    title: category.category_name,
    metadataBase: new URL("http://localhost:3000/category/" + slug),
    openGraph: {
      title: category.category_name + " | Next Store",
      description:
        "Next Store merupakan situs penjualan online aneka produk fashion",
      url: "http://localhost:3000/category/" + slug,
      siteName: "Next Store",
      images: [
        {
          url: CATEGORY_IMAGE_URL + "/" + category.category_image, // Must be an absolute URL
          width: 500,
          height: 500,
        },
        {
          url: CATEGORY_IMAGE_URL + "/" + category.category_image, // Must be an absolute URL
          width: 500,
          height: 500,
          alt: category.category_name,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
  };
}

async function getProduct({ slug }: { slug: string }) {
  const response = await publicApi.get(`/public/product-by-categories/${slug}`);
  return response?.data?.data;
}

async function ProductByCategory({ params }: { params: { slug: string } }) {
  const products = await getProduct({ slug: params.slug });

  return (
    <>
      <section className="w-full md:max-w-6xl m-auto  mt-5 mb-5 bg-white p-5 min-h-screen">
        {products?.data?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {products?.data?.map((product: TProduct, index: number) => {
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
        ) : (
          <EmptyStock />
        )}
        <Jarak />
        {/* <div>
          <PaginateProduct
            current_page={featured.current_page}
            per_page={featured.per_page}
            last_page={featured.last_page}
            total={featured.total}
          />
        </div> */}
      </section>
    </>
  );
}

export default withWebStore(ProductByCategory);
