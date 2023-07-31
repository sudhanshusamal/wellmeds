/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import styles from './styles.module.scss'

import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/scss";
import "swiper/scss/pagination";
import "swiper/scss/navigation";

import { Autoplay, Pagination, Navigation, Mousewheel, Keyboard } from "swiper";

export default function MainSwiper() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        cssMode={true}
        mousewheel={true}
        keyboard={true}
        modules={[Autoplay, Pagination, Navigation, Mousewheel, Keyboard]}
        className="mainSwiper"
      >
        {[...Array(10).keys()].map((i) => (
          <SwiperSlide>
            <img src={`../../../images/swiper/${i + 1}.jpg`} alt="" />
          </SwiperSlide>
        ))}

      </Swiper>
    </>
  );
}
