import { instance } from "@/utils/httpClient";
import { useEffect, useState } from "react";

export interface IProductOrder {
  id: number;
  order_id: number;
  product_id: number;
  product_price: number;
  product_qty: number;
  product_variant_id: number;
  product: {
    id: number;
    product_name: string;
  };
  product_variants: {
    id: number;
    product_varian_name: string;
  };
}

export interface ICurrentOrder {
  id: number;
  order_amount: number;
  order_code: string;
  order_date: Date;
  order_status: string;
  order_total_weight: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    roles: string;
    email: string;
    address: {
      id: number;
      address: string;
      isDefault: boolean;
      user_address_kab_id: number;
      user_address_prov_id: number;
      user_address_kodepos: string;
      user_id: number;
      kota: {
        city_id: number;
        city_name: string;
        city_postal_code: string;
        city_province_id: number;
      };
      provinsi: {
        province_id: number;
        province_name: string;
      };
    }[];
  };
  expedisi: {
    id: number;
    expedition_estimated: string;
    expedition_name: string;
    expedition_price: number;
    expedition_servie: string;
    order_id: number;
  };
  orders_detail: IProductOrder[];
  payment_bank: {
    id: number;
    order_bank: string;
    order_id: string;
    payment_datetime: string;
    payment_expired: string;
    payment_gross_amount: number;
    payment_merchant_id: string;
    payment_provider: string;
    payment_status: string;
    payment_transaction_id: string;
    payment_type: string;
    payment_va_numbers: string;
  };
}

type IPaginate<T> = {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url?: string;
  path: string;
  per_page: number;
  prev_page_url?: string;
  to: number;
  total: number;
  data: T;
};

interface IDataOrderWithPaginate extends IPaginate<ICurrentOrder[]> {}

export function useOrder() {
  const [isLoadingOrder, setLoadingOrder] = useState<boolean>(false);
  const [data, setData] = useState<IDataOrderWithPaginate>(
    {} as IDataOrderWithPaginate
  );
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  const getAllOrders = async () => {
    setLoadingOrder(true);
    try {
      let url: string = "";
      if (search || search !== "") {
        url = `/order?page=${page}&search=${search}`;
      } else {
        url = `/order?page=${page}`;
      }

      const response = await instance.get(url);
      setData(response?.data?.data);
      setLoadingOrder(false);
    } catch (error) {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [page]);

  return {
    page,
    setPage,
    search,
    setSearch,
    isLoadingOrder,
    data,
  };
}
