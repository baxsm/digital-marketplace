"use client";

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type SwiperType from "swiper";
import { Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const activeStyles =
  "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center border-2 bg-white border-zinc-300 rounded-full";
const inactiveStyles = "hidden text-gray-400";

interface ImageSliderProps {
  urls: string[];
}

const ImageSlider: FC<ImageSliderProps> = ({ urls }) => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideConfig, setSlideConfig] = useState({
    isStart: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isStart: activeIndex === 0,
        isEnd: activeIndex === (urls.length ?? 0) - 1,
      });
    });
  }, [swiper, urls]);

  return (
    <div className="group relative bg-zinc-100 aspect-square overflow-hidden rounded-xl">
      <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
        <button
          className={cn(activeStyles, "right-3 transition", {
            [inactiveStyles]: slideConfig.isEnd,
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isEnd,
          })}
          aria-label="next image"
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
        >
          <ChevronRight className="h-4 w-4 text-zinc-700" />
        </button>
        <button
          className={cn(activeStyles, "left-3 transition", {
            [inactiveStyles]: slideConfig.isStart,
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isStart,
          })}
          aria-label="next image"
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
        >
          <ChevronLeft className="h-4 w-4 text-zinc-700" />
        </button>
      </div>
      <Swiper
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`;
          },
        }}
        modules={[Pagination]}
        className="h-full w-full"
      >
        {urls.map((url, index) => {
          return (
            <SwiperSlide key={index} className="-z-10 relative h-full w-full">
              <Image
                src={url}
                fill
                loading="eager"
                className="-z-10 h-full w-full object-cover object-center"
                alt="product image"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
