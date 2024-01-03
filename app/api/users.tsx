import { AiTwotoneUpSquare } from "react-icons/ai";
import { instance } from "../config/const";

export interface IMeta {
  current_page: number;
  per_page: number;
  total_data: number;
  total_page: number;
}

export type TUser = {
  id?: number;
  email: string;
  name: string;
  roles: string;
  password?: string | undefined;
};

export type IUserResult = {
  status: boolean;
  path: string;
  statusCode: number;
  res: {
    meta?: IMeta;
    data: TUser[];
  };
};

export interface ISingleUser {
  status: boolean;
  path: string;
  statusCode: number;
  res: TUser | undefined;
}

export const findAllUser = async ({
  page,
}: {
  page: number;
}): Promise<IUserResult> => {
  const response = await instance.get(`/users?page=${page}`);
  return response?.data;
};

export const createUser = async (data: TUser) => {
  try {
    const response = await instance.post(`/users`, data);
    return response?.data;
  } catch (error: any | unknown) {
    throw error?.response?.data?.message;
  }
};

export const getUserById = async ({ id }: { id: number }): Promise<TUser> => {
  try {
    const response = await instance.get(`/users/${id}`);
    return response.data?.res;
  } catch (error: any) {
    throw error?.message;
  }
};

export const updateUser = async (data: TUser) => {
  try {
    let body = {};
    if (data.password === "" || !data.password) {
      body = {
        name: data?.name,
        email: data?.email,
        roles: data?.roles,
      };
    } else {
      body = {
        name: data?.name,
        email: data?.email,
        roles: data?.roles,
        password: data?.password,
      };
    }

    const response = await instance.put(`/users/${data?.id}`, body);
    return response?.data;
  } catch (error: any | unknown) {
    throw error?.response?.data?.message;
  }
};

export const deleteUser = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await instance.delete(`/users/${id}`);
    return res.data;
  } catch (error: any | unknown) {
    throw error?.message;
  }
};
