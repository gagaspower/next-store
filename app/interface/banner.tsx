export type TBanner = {
  id?: number;
  banner_title: string;
  banner_desc: string;
  banner_url: string;
  banner_image: File | string | null;
};

export interface IBannerData {
  message: string;
  data: {
    id?: number;
    banner_title: string;
    banner_desc: string;
    banner_url: string;
    banner_image: string | null;
  }[];
}
