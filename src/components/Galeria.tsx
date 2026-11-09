'use client';

import Image from "next/image";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function Galeria({ images }: { images: string[] }) {
  const slides = images.length === 2 ? [...images, ...images] : images;

  return (
    <div className="w-full py-2">
      <Swiper
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        spaceBetween={0}
        loop={slides.length > 1}
        grabCursor
        autoplay={{ delay: 3600, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation={slides.length > 1}
        pagination={{ clickable: true }}
        modules={[EffectFade, Pagination, Navigation, Autoplay]}
        className="gym-gallery overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/30"
      >
        {slides.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`}>
            <div className="relative h-[340px] w-full sm:h-[460px] lg:h-[580px]">
              <Image
                src={src}
                alt={`Vista ${index + 1} del gimnasio Mackyna`}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b08]/75 via-transparent to-black/10" />
              <div className="absolute bottom-10 left-6 right-6 flex items-end justify-between sm:bottom-12 sm:left-10 sm:right-10">
                <div>
                  <span className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c8e994]"><span className="h-1.5 w-1.5 rounded-full bg-[#b9dc75]" /> Mackyna · Neuquén</span>
                  <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Tu lugar para entrenar.</p>
                </div>
                <span className="hidden rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] text-white/70 backdrop-blur sm:block">{String((index % images.length) + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
