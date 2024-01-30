import { instance } from "../utils/httpClient";
import { TUser, TUserData } from "../interface/user";

export const findAllUser = async ({ page }: { page: number }) => {
  const response = await instance.get(`/user?page=${page}`);
  return response?.data;
};

export const createUser = async (data: TUser) => {
  try {
    const response = await instance.post(`/user/create`, data);
    return response?.data;
  } catch (error: any | unknown) {
    throw error?.response?.data?.message;
  }
};

export const getUserById = async ({ id }: { id: number }): Promise<TUser> => {
  try {
    const response = await instance.get(`/user/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error?.message;
  }
};

export const updateUser = async (data: TUser) => {
  try {
    const response = await instance.put(`/user/update/${data?.id}`, {
      name: data?.name,
      email: data?.email,
      roles: data?.roles,
      password: data?.password,
    });
    return response?.data;
  } catch (error: any | unknown) {
    throw error?.response?.data?.message;
  }
};

export const deleteUser = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await instance.delete(`/user/delete/${id}`);
    return res.data;
  } catch (error: any | unknown) {
    throw error?.message;
  }
};
