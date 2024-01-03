import { instance } from "../config/const";

import { TProduct, TVariant } from "../interface/product";

export const findAllProduct = async ({
  page,
}: {
  page: number;
}): Promise<TProduct> => {
  const response = await instance.get(`/product?page=${page}`);
  return response?.data;
};

export const createProduct = async ({
  data,
  variants,
}: {
  data: any;
  variants: TVariant[];
}) => {
  try {
    if (variants.length > 0) {
      data.productStock = 0;
      data.productPrice = 0;
    }

    const formData = new FormData();
    formData.append("productSku", data.productSku);
    formData.append("productName", data.productName);
    formData.append("productDesc", data.productDesc);
    formData.append("productStock", data?.productStock);
    formData.append("productPrice", data?.productPrice);
    formData.append("productCategoryId", data.productCategoryId);
    formData.append("productImage", data.productImage);
    formData.append("variants", JSON.stringify(variants || []));

    const response = await instance.post(`/product`, formData, {
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
    const res = await instance.delete(`/product/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.message;
  }
};

export const showProduct = async ({ id }: { id: number }) => {
  const { data } = await instance.get(`/product/${id}`);
  return data.res.result;
};

export const updateProduct = async ({
  id,
  data,
  variants,
}: {
  id: number;
  data: any;
  variants: TVariant[];
}) => {
  try {
    if (variants.length > 0) {
      data.productStock = 0;
      data.productPrice = 0;
    }

    const formData = new FormData();
    formData.append("productSku", data.productSku);
    formData.append("productName", data.productName);
    formData.append("productDesc", data.productDesc);
    formData.append("productStock", data?.productStock);
    formData.append("productPrice", data?.productPrice);
    formData.append("productCategoryId", data.productCategoryId);
    formData.append("productImage", data.productImage);
    formData.append("variants", JSON.stringify(variants || []));

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
