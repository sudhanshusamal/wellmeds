/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import styles from './styles.module.scss'
import { useRef, useState } from "react";
import { offersArray } from '@/data/home';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/scss";
import "swiper/scss/free-mode";
import "swiper/scss/pagination";


// import required modules
import { FreeMode, Pagination, Mousewheel, Keyboard, Navigation } from "swiper";
import Link from 'next/link';

export default function MainOffers() {
    return (
        <div className={styles.offers}>
            <Swiper
                slidesPerView={3}
                spaceBetween={10}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                cssMode={true}
                mousewheel={true}
                keyboard={true}
                modules={[FreeMode, Pagination, Navigation, Mousewheel, Keyboard]}
                className="offers_swiper"
            >
                {
                    offersArray.map((offer) => (
                        
                        <SwiperSlide>
                            <Link href="">
                                <img src={offer.image} />
                            </Link>
                            <span>₹{offer.price}</span>
                            <span>-{offer.discount}%</span>
                        </SwiperSlide>
                        
                    ))
                }
            </Swiper>
        </div>
    );
}
