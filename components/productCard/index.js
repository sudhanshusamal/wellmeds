/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Link from 'next/link';
import ProductSwiper from './ProductSwiper';

export default function ProductCard({ product }) {

    const [active, setActive] = useState(0);
    const [images, setImages] = useState(product.subProducts[active]?.images);
    // const [prices, setPrices] = useState(
    //     (product.subProducts[active]?.sizes.map((s) => {
    //         return s.price;
    //     }))
    // );
    const [prices, setPrices] = useState([]);
    const [styless, setStyless] = useState(product.subProducts.map((p) => {
        return p.color;
    }));
    const discount = product.subProducts[active].discount;
    const subProduct = product.subProducts[active];

    console.log(product.subProducts[active].discount)

    useEffect(() => {
        // setImages(product.subProducts[active].images);
        // setPrices((product.subProducts[active]?.sizes.map((s) => {
        //     return s.price;
        // }).sort((a, b) => {
        //     return b - a;
        // })))

        setImages(product.subProducts[active]?.images);

        const activeSubProduct = product.subProducts[active];
        const subProductPrices = activeSubProduct?.sizes.map((s) => s.price) || [];

        // Sort the prices in descending order
        const sortedPrices = subProductPrices.sort((a, b) => b - a);
        setPrices(sortedPrices);
    }, [active, product])
    return (
        <div className={styles.product}>
            <div className={styles.product__container}>
                <Link href={`/product/${product.slug}?style=${active}`}>
                    <div>
                        <ProductSwiper images={images} />
                    </div>
                </Link>
                {
                    discount ?

                        (
                            < div className={styles.product__discount}>
                                -{discount}%
                            </div>
                        ) : ""
                }
                <div className={styles.product__infos}>
                    <h1>{product.name.length > 45 ? `${product.name.substring(0, 45)}...` : product.name}</h1>
                    {/* <span>
                        {product.subProducts[active].discount > 0
                            ? `₹${prices - (prices * discount) / 100}`
                            : `₹${prices}`}
                    </span> */}
                    <span>
                        {

                            subProduct.discount > 0
                                ? `₹${(prices[prices.length - 1] - (prices[prices.length - 1] * subProduct.discount) / 100).toFixed(2)}`
                                : `₹${prices[prices.length - 1]?.toFixed(2) || '0.00'}`

                        }
                    </span>
                    <span>
                        {
                            subProduct.discount > 0 ?
                            <span>₹{prices[prices.length - 1]?.toFixed(2) || '0.00'}</span> :
                        ""
                        }

                    </span>

                    <div className={styles.product__colors}>
                        {
                            styless.length > 1 && styless.map((style, i) => (
                                style.image ? <img src={style.image} className={i === active && styles.active} onClick={() => {
                                    setImages(product.subProducts[i].images);
                                    setActive(i)
                                }} alt='' /> : (<span style={{ backgroundColor: `${style.color}` }} onClick={() => {
                                    setImages(product.subProducts[i].images);
                                    setActive(i)
                                }}>

                                </span>)
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
