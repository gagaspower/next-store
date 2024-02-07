export interface IProvinsi {
  province_id: number;
  province_name: string;
}

export interface IKota {
  city_id: number;
  city_name: string;
  city_postal_code: string;
  city_province_id: number;
}

export type IAddress = {
  id?: number;
  address: string;
  user_address_prov_id: number;
  user_address_kab_id: number;
  user_address_kodepos: string;
  user_id: number;
  isDefault: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
  provinsi: IProvinsi;
  kota: IKota;
};

export interface IUserAddress {
  message: string;
  data: IAddress[];
}
