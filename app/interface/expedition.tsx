export interface IExpResult {
  query: {
    origin: string;
    destination: number;
    weight: number;
    courier: string;
  };
  status: {
    code: number;
    description: string;
  };
  origin_details: {
    city_id: string;
    province_id: string;
    province: string;
    type: string;
    city_name: string;
    postal_code: string;
  };
  destination_details: {
    city_id: string;
    province_id: string;
    province: string;
    type: string;
    city_name: string;
    postal_code: string;
  };
  results: {
    code: string;
    name: string;
    costs: {
      service: string;
      description: string;
      cost: {
        value: number;
        etd: string;
        note: string;
      }[];
    }[];
  }[];
}
