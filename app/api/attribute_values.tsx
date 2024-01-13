import { instance } from "../config/const";
import { IAttribute, TProductAttribute } from "../interface/attribute";

export const findAllAttribute = async (): Promise<IAttribute> => {
  const result = await instance.get(`/attribute`);
  return result?.data;
};

export const addAttribute = async ({
  id,
  data,
}: {
  id?: number;
  data: TProductAttribute;
}): Promise<any> => {
  let url: string = "";
  let method: string = "post | put";
  if (id === 0) {
    url = `/attribute/create`;
    method = "post";
  } else {
    url = `/attribute/update/${id}`;
    method = "put";
  }

  try {
    const result = await instance[method as "post" | "put"](url, data);
    return result?.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAttribute = async (id: number) => {
  try {
    const res = await instance.delete(`/attribute/delete/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
