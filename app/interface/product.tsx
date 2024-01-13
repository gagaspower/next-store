import { TCategory } from "./category";

export type TProduct = {
  id?: number;
  product_name: string;
  product_slug?: string;
  product_sku: string;
  product_desc: any;
  product_category_id: any;
  product_stock: number;
  product_price: number;
  product_weight: number;
  product_image: File | null;
  category?: TCategory;
};

export type TProductData = {
  message: string;
  data: {
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
    data: TProduct[];
  };
};
