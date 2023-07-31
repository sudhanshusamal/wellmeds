/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */

import { simillar_products } from "../../../data/products";
import styles from "./styles.module.scss";
import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation, FreeMode } from "swiper";
import Link from "next/link";
export default function SimillarSwiper() {
    return (<>
        <h3 className={styles.similar}>Similar Products</h3>
        <Swiper
            slidesPerView={4}
            spaceBetween={5}
            // slidesPerGroup={3}
            navigation={true}
            freeMode={true}
            modules={[Navigation, FreeMode]}
            className="swiper simillar_swiper products__swiper"
            breakpoints={{

                640: {
                    width: 670,
                    slidesPerView: 5,
                },
            }}
        >

            {simillar_products.map((p) => (
                <SwiperSlide>

                    <Link href=" ">
                        <img src={p} alt="" />
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    </>
    );
}