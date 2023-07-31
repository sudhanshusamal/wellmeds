/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { useState } from 'react';
import styles from './styles.module.scss';
import ReactImageMagnify from 'react-image-magnify';


export default function MainSwiper({ images, activeImg }) {

    const [active, setActive] = useState(0)

    return (
        <div className={styles.swiper}>
            <div className={styles.swiper__active}>
                <ReactImageMagnify {...{
                    smallImage: {
                        alt: 'Wristwatch by Ted Baker London',
                        isFluidWidth: true,
                        src: activeImg ||  images[active].url
                    },
                    largeImage: {
                        src: activeImg || images[active].url,
                        width: 1500,
                        height: 2000
                    },
                    enlargedImageContainerDimensions: {
                        width: "200%",
                        height: "100%"
                    }
                }} />
            </div>
            <div className={styles.swiper__list}>
                {images.map((img, i) => (
                    <div className={`${styles.swiper__list_item} ${i == active && styles.active}`} onMouseOver={() => setActive(i)}>
                        <img src={img.url} alt='' />
                    </div>
                ))}
            </div>
        </div>
    )
}
