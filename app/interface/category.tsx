export type TCategory = {
  id?: number;
  categoryName: string;
  categorySlug?: string;
};

export interface TCategoryData {
  status: boolean;
  path: string;
  statusCode: number;
  res: TCategory[];
}
