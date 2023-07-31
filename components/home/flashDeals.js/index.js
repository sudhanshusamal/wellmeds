/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import Countdown from '@/components/countdown'
import styles from './styles.module.scss'
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { flashDealsArray } from '@/data/home';

import "swiper/scss";
import "swiper/scss/free-mode";
import "swiper/scss/pagination";


import { FreeMode, Keyboard, Mousewheel, Navigation } from "swiper";
import FlashCard from './Card';
import { TbDiscount2 } from 'react-icons/tb';

export default function FlashDeals() {
    return (
        <div className={styles.flashDeals}>
            <div className={styles.flashDeals__header}>
                <h1><TbDiscount2 />Sale</h1>

                <Countdown date={new Date(2023,5, 19)} />
            </div>
            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                cssMode={true}
                mousewheel={true}
                keyboard={true}
                freeMode={true}
                navigation={true}
                modules={[FreeMode, Navigation, Mousewheel, Keyboard]}
                breakpoints={{
                    350: {
                        slidesPerView: 1.4,
                    },
                    450: {
                        slidesPerView: 2,
                    },
                    630: {
                        slidesPerView: 3,
                    },
                    920: {
                        slidesPerView: 4,
                    },
                    1232: {
                        slidesPerView: 5,
                    },
                    1520: {
                        slidesPerView: 6,
                    },
                }}
                className="flashDeals__swiper"
            >
                <div className={styles.flashDeals__list}>
                    {
                        flashDealsArray.map((product, i) => (
                            <SwiperSlide>
                                <FlashCard product={product} key={i} />
                            </SwiperSlide>
                        ))
                    }
                </div>

            </Swiper>
        </div>
    )
}
