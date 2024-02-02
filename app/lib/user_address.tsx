import { IUserAddress } from "@/interface/userAddress";
import { instance } from "@/utils/httpClient";

export const getAddress = async (): Promise<IUserAddress | undefined> => {
  try {
    const response = await instance.get(`/user-address`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error get address : ", error);
  }
};

export const setDefaultAddress = async ({
  addressId,
}: {
  addressId: number;
}) => {
  try {
    const response = await instance.post(`/set-default-address`, {
      addressId,
    });
    return response.data;
  } catch (error) {
    console.log("Error set default address: ", error);
  }
};
