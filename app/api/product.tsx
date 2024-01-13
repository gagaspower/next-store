import { instance } from "../config/const";

import { TProductData } from "../interface/product";

type TProductAttr = {
  varian_group: string;
  varian_item: string;
};

type TVariantStock = {
  product_varian_name: string;
  product_varian_stock: number;
  product_varian_price: number;
  product_varian_sku?: string;
};

export const findAllProduct = async ({
  page,
}: {
  page: number;
}): Promise<TProductData> => {
  const response = await instance.get(`/product?page=${page}`);

  return response?.data;
};

export const createProduct = async ({
  data,
  product_varian,
  product_varian_stock,
  isVariants,
}: {
  data: any;
  product_varian?: TProductAttr[];
  product_varian_stock?: TVariantStock[];
  isVariants: boolean;
}) => {
  try {
    const formData = new FormData();
    formData.append("product_sku", data.product_sku);
    formData.append("product_name", data.product_name);
    formData.append("product_desc", data.product_desc);
    formData.append("product_stock", data?.product_stock);
    formData.append("product_price", data?.product_price);
    formData.append("product_category_id", data.product_category_id);
    formData.append("product_image", data.product_image);
    formData.append("product_weight", data.product_weight);
    formData.append("isVarian", JSON.stringify(isVariants));
    formData.append("product_varian", JSON.stringify(product_varian));
    formData.append(
      "product_varian_stock",
      JSON.stringify(product_varian_stock)
    );
    const response = await instance.post(`/product/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error: unknown | any) {
    throw error?.message;
  }
};

export const deleteProduct = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await instance.delete(`/product/delete/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.message;
  }
};

export const showProduct = async ({ id }: { id: number }) => {
  const response = await instance.get(`/product/${id}`);

  return response?.data?.data;
};

export const updateProduct = async ({
  id,
  data,
  product_varian,
  product_varian_stock,
  isVariants,
}: {
  id: number;
  data: any;
  product_varian?: TProductAttr[];
  product_varian_stock?: TVariantStock[];
  isVariants: boolean;
}) => {
  try {
    const formData = new FormData();
    formData.append("product_sku", data.product_sku);
    formData.append("product_name", data.product_name);
    formData.append("product_desc", data.product_desc);
    formData.append("product_stock", data?.product_stock);
    formData.append("product_price", data?.product_price);
    formData.append("product_category_id", data.product_category_id);
    formData.append("product_weight", data.product_weight);
    formData.append("isVarian", JSON.stringify(isVariants));
    formData.append("product_varian", JSON.stringify(product_varian));
    formData.append(
      "product_varian_stock",
      JSON.stringify(product_varian_stock)
    );

    if (data.product_image) {
      formData.append("product_image", data.product_image);
    }

    const response = await instance.post(`/product/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error: any) {
    throw error?.message;
  }
};
