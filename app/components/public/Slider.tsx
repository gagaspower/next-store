"use client";
import React, { Suspense, useEffect, useState } from "react";
import Glide from "@glidejs/glide";

import { BANNER_IMAGE_URL } from "@/utils/const";
import { publicApi } from "@/utils/httpClient";
import { IBannerData } from "@/interface/banner";

export default function Slider() {
  const [loading, setLoading] = useState<boolean>(false);
  const [banners, setBanners] = useState<IBannerData | undefined>(undefined);

  useEffect(() => {
    const getPublicBanner = async () => {
      setLoading(true);
      try {
        const response = await publicApi.get<IBannerData>(`/public/banner`);
        setBanners(response?.data);
        setLoading(false);
      } catch (error) {
        console.log("Error get image slide : ", error);
        setLoading(false);
      }
    };
    getPublicBanner();
  }, []);

  useEffect(() => {
    const slider = new Glide(".glide-02", {
      type: "slider",
      focusAt: "center",
      perView: 1,
      autoplay: 3000,
      animationDuration: 700,
      gap: 0,
    });

    if (banners) slider.mount();

    return () => {
      slider.destroy();
    };
  }, [banners]);

  return (
    <div className="relative w-full glide-02  bg-white p-5">
      <div className="overflow-hidden" data-glide-el="track">
        <ul className="whitespace-no-wrap flex-no-wrap [backface-visibility: hidden] [transform-style: preserve-3d] [touch-action: pan-Y] [will-change: transform] relative flex w-full overflow-hidden p-0">
          {banners ? (
            banners?.data?.map((banner: any, index: number) => {
              return (
                <li key={index} className="">
                  <img
                    src={`${BANNER_IMAGE_URL}/${banner?.banner_image}`}
                    className="w-full max-w-full max-h-96 m-auto object-contain"
                    alt={banner?.banner_title}
                  />
                </li>
              );
            })
          ) : (
            <div className="skeleton w-full max-w-full max-h-96 m-auto"></div>
          )}
        </ul>
      </div>

      <div
        className="absolute bottom-0 flex items-center justify-center w-full gap-2 p-3"
        data-glide-el="controls[nav]"
      >
        {banners &&
          banners?.data?.map((_: any, index: number) => {
            return (
              <button
                className="p-4 group"
                data-glide-dir={`=${index}`}
                aria-label={`goto slide ${index + 1}`}
                key={index}
              >
                <span className="block w-2 h-2 transition-colors duration-300 rounded-full bg-white/20 ring-1 ring-slate-700 focus:outline-none"></span>
              </button>
            );
          })}
      </div>
    </div>
  );
}
