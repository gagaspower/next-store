export type TUserAddress = {
  id?: number;
  address: string;
  user_address_prov_id: number;
  user_address_kab_id: number;
  user_address_kodepos: string | number;
  user_id?: number;
  isDefault: boolean;
};

export type TUser = {
  id?: number;
  name: string;
  email: string;
  password?: string;
  roles: string;
  address?: TUserAddress[];
};

export type TUserData = {
  message: string;
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
  data: {
    data: TUser[];
  };
};
