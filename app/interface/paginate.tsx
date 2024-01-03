export type TPaginate = {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
};

export type TQuery = {
  page: number;
  limit: number;
  search?: string;
};
