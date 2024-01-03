import { TPaginate } from "./paginate";

export type TVariant = {
  id?: number;
  variant: string;
  variantStock: number;
  variantPrice: number;
};

export type TAttribute = {
  id?: number;
  attributeKey1: string;
  attributeKey2: string;
  attributeStock: number;
  attributePrice: number;
};

export type ProductData = {
  id?: number;
  productSku: string;
  productName: string;
  productSlug?: string;
  productDesc?: any;
  productCategoryId: any;
  productStock?: number;
  productPrice?: number;
  productImage: File | null;
  userId?: number;
  isVariantActive?: boolean;
  variants?: TVariant[];
};

export type TProduct = {
  path: string;
  status: boolean;
  statusCode: number;
  res: {
    result: {
      data: ProductData[];
      meta: TPaginate;
    };
  };
};
