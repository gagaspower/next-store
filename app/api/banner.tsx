import { instance, publicApi } from "../config/const";
import { IBanner, IBannerData, TBanner } from "../interface/banner";

export const getAllBanner = async (): Promise<IBannerData> => {
  const response = await instance.get(`/banner`);

  return response?.data;
};

export const addBanner = async ({ data }: { data: any }): Promise<IBanner> => {
  try {
    const formData = new FormData();
    formData.append("banner_title", data.banner_title);
    formData.append("banner_desc", data.banner_desc);
    formData.append("banner_url", data.banner_url);
    formData.append("banner_image", data.banner_image);
    const response = await instance.post(`/banner/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error: unknown | any) {
    throw error?.message;
  }
};

export const deleteBanner = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await instance.delete(`/banner/delete/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.message;
  }
};

export const detailBanner = async ({
  id,
}: {
  id: number;
}): Promise<TBanner> => {
  const response = await instance.get(`/banner/show/${id}`);
  return response?.data?.data;
};

export const updateBanner = async ({
  id,
  data,
}: {
  id: number;
  data: any;
}): Promise<IBanner> => {
  try {
    const formData = new FormData();
    formData.append("banner_title", data.banner_title);
    formData.append("banner_desc", data.banner_desc);
    formData.append("banner_url", data.banner_url);
    if (data.banner_image) {
      formData.append("banner_image", data.banner_image);
    }

    const response = await instance.post(`/banner/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error: any) {
    throw error?.message;
  }
};

/** for public banner */

/** for public */

export const getPublicBanner = async () => {
  const response = await publicApi.get(`/public/banner`);
  return response?.data;
};
