export type TCategory = {
  id?: number;
  category_name: string;
  category_slug?: string;
  category_image?: File | null;
};

export interface TCategoryData {
  message: string;
  data: TCategory[];
}
