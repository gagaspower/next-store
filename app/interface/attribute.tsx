export type IAttributeValues = {
  id?: number;
  attribute_id: number;
  value: string;
};

export type IAttributeValuesWithParent = {
  id?: number;
  attribute_id: number;
  value: string;
  attribute: {
    id: number;
    attribute_name: string;
    attribute_slug: string;
  }[];
};

export type TProductAttribute = {
  id?: number;
  attribute_name: string;
  attribute_slug?: string;
  attribute_values?: IAttributeValues[];
};

export interface IAttribute {
  message: string;
  data: TProductAttribute[];
}

export interface IAttributeItem {
  message: string;
  data: IAttributeValuesWithParent[];
}
