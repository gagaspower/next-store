import withWebStore from "@/context/withWebStore";
import ProductDetailCard from "./ProductDetailCard";
import { publicApi } from "@/utils/httpClient";
import type { Metadata } from "next";
import { PRODUCT_IMAGE_URL } from "@/utils/const";
import { TProduct } from "@/interface/product";

async function getProductDetail({ slug }: { slug: string }) {
  const response = await publicApi.get(`/public/product-by-slug/${slug}`);
  return response?.data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const response = await getProductDetail({ slug: slug });
  const product = response?.data;

  return {
    title: product.product_meta_title ?? product.product_name,
    metadataBase: new URL("http://localhost:3000/product/detail/" + slug),
    openGraph: {
      title:
        product.product_meta_title ?? product.product_name + " | Next Store",
      description: product.product_meta_desc ?? null,
      url: "http://localhost:3000/product/detail/" + slug,
      siteName: "Next Store",
      images: [
        {
          url: PRODUCT_IMAGE_URL + "/" + product.product_image, // Must be an absolute URL
          width: 500,
          height: 500,
        },
        {
          url: PRODUCT_IMAGE_URL + "/" + product.product_image, // Must be an absolute URL
          width: 500,
          height: 500,
          alt: product.product_name,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
  };
}

async function DetailProduct({ params }: { params: { slug: string } }) {
  const product = await getProductDetail({ slug: params.slug });

  return (
    <section className="w-full md:max-w-6xl m-auto px-5">
      <div className="bg-white my-3 p-3">
        <ProductDetailCard data={product.data as TProduct} />
      </div>
    </section>
  );
}

export default withWebStore(DetailProduct);
