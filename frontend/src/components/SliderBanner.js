import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const slides = [
  {
    id: 1,
    title: "MUST BUY",
    subtitle: "Shop Our Top Selling Products",
    buttonText: "Shop Now",
    image: require("../images/items/suits.jpg"),
  },
  {
    id: 2,
    title: "TRENDING NOW",
    subtitle: "Latest Fabric Collection",
    buttonText: "Explore More",
    image: require("../images/images.jpg"),
  },
  {
    id: 3,
    title: "BEST SHIRTING AT LOWEST PRICE AT ISTITCH",
    subtitle: "Experience The Best Quality",
    price: "Starting at $99",
    buttonText: "Buy Now",
    image: require("../images/items/shirts/shirt2.jpg"),
  },
];

const SliderBanner = () => {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
      className="w-full h-[500px]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative flex justify-center items-center bg-blue-900 text-white p-8">
            <div className="w-1/2">
              <h1 className="text-5xl font-bold">{slide.title}</h1>
              <p className="text-xl mt-4">{slide.subtitle}</p>
              <button className="mt-6 bg-yellow-400 text-black py-2 px-4 rounded-md">
                {slide.buttonText}
              </button>
            </div>
            <div className="w-1/2 flex justify-center">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-[90%] h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SliderBanner;
