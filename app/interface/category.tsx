export type TCategory = {
  id?: number;
  category_name: string;
  category_slug?: string;
};

export interface TCategoryData {
  message: string;
  data: TCategory[];
}
