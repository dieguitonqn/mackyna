"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const images = [
    "/mackyna/gym1.jpeg",
    "/mackyna/gym2.jpeg",
    "/mackyna/gym3.jpeg",
    "/mackyna/gym4.jpeg",
    "/mackyna/gym5.jpeg",
    "/mackyna/gym6.jpeg",
    "/mackyna/gym7.jpeg",
    "/mackyna/gym8.jpeg",
    "/mackyna/gym9.jpeg",
];

export function Galeria() {
    return (
        <div className="w-full max-w-5xl mx-auto my-12">
            <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                spaceBetween={60}
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                coverflowEffect={{
                    rotate: 30,
                    stretch: 0,
                    depth: 500,
                    modifier: 1,
                    slideShadows: true,
                    scale: 1,

                }}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="mySwiper"
            >
                {images.map((src, idx) => (
                    <SwiperSlide key={idx} className="flex justify-center items-center !w-80 !h-80 md:!w-[400px] md:!h-[400px] bg-black rounded-xl overflow-hidden">
                        <Image 
                            src={src} 
                            alt={`Foto ${idx + 1}`} 
                            width={1200} 
                            height={1200} 
                            className="w-full h-full object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
