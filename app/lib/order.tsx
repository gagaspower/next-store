import { publicApi } from "@/utils/httpClient";

export const ShoppingCart = async ({ user_id }: { user_id: number }) => {
  try {
    const resp = await publicApi.get(`/public/shopping-cart/${user_id}`);
    return resp.data;
  } catch (error) {
    console.log("Error : ", error);
  }
};

export const AddToCart = async (data: any) => {
  try {
    const resp = await publicApi.post(`/public/add-to-cart`, data);
    return resp.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCart = async ({ cartId }: { cartId: number }) => {
  try {
    const resp = await publicApi.get(`/public/delete-cart/${cartId}`);
    return resp.data;
  } catch (error) {
    console.log("Error : ", error);
  }
};

export const updateQty = async ({
  cartId,
  qty,
}: {
  cartId: number;
  qty: number;
}) => {
  try {
    const resp = await publicApi.post(`/public/update-cart`, {
      cartId,
      qty,
    });
    return resp.data;
  } catch (error) {
    console.log(error);
  }
};
