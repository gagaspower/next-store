import { instance } from "../utils/httpClient";
import { TCategory, TCategoryData } from "../interface/category";

export const findAllCategory = async (): Promise<TCategoryData> => {
  const result = await instance.get(`/cat`);
  return result?.data;
};

export const addCategory = async ({
  id,
  data,
}: {
  id?: number;
  data: TCategory;
}) => {
  try {
    let response;
    const formData = new FormData();
    formData.append("category_name", data.category_name);
    if (data.category_image) {
      formData.append("category_image", data.category_image);
    }

    if (id === 0) {
      response = await instance.post(`/cat/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      response = await instance.post(`/cat/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return response?.data;
  } catch (error: any | unknown) {
    throw error?.message;
  }
};

export const getCategoryById = async ({ id }: { id: number }) => {
  try {
    const response = await instance.get(`/cat/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error?.message;
  }
};

export const deleteCategory = async ({ id }: { id: number }) => {
  try {
    const resp = await instance.delete(`/cat/delete/${id}`);
    return resp.data;
  } catch (error: any) {
    throw error?.message;
  }
};
