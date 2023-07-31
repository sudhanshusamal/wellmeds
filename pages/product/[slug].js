/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-key */
import db from '@/utils/db';
import styles from '../../styles/product.module.scss'
import Product from '@/models/Product';
import Head from 'next/head';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import MainSwiper from '@/components/productPage/mainSwiper';
import { useState } from 'react';
import Infos from '@/components/productPage/infos';
import Reviews from '@/components/productPage/reviews';
import User from '@/models/User';

export default function product({ product }) {
    const [activeImg, setActiveImg] = useState()
    // console.log(product.reviews)
    return (
        <>
            <Head>
                <title>{product.name} | Wellmeds</title>
            </Head>
            <Header country="india" />
            <div className={styles.product}>
                <div className={styles.product__container}>
                    <div className={styles.path}>
                        {
                            product.category?.name && `Home \ ${product.category.name}`
                        } 
                        {product.subCategories.map((sub) => (
                            <span>\ {sub.name}</span>
                        ))}
                    </div>
                    <div className={styles.product__main}>
                        <MainSwiper images={product.images} activeImg={activeImg} />
                        <Infos product={product} setActiveImg={setActiveImg} />
                    </div>
                    <Reviews product={product} />
                </div>
            </div>


            <Footer country="india" />
        </>
    )
}


export async function getServerSideProps(context) {

    const { query } = context;
    const slug = query.slug;

    const style = query.style;
    const size = query.size || 0;
    db.connectDb();
    let products = await Product.find().sort({ createdAt: -1 })
        .populate({ path: 'category', model: Category })
        .populate({ path: 'subCategories', model: SubCategory })
        .populate({ path: "reviews.reviewBy", model: User })
        .lean();



    let product = null;
    let index = -1;

    for (let i = 0; i < products.length; i++) {
        if (products[i].slug === slug) {
            product = products[i];
            index = i;
            break;
        }
    }

    let subProduct = product?.subProducts[style];
    //   let prices = subProduct?.sizes[subProduct.length-1].price
    let price = subProduct.sizes
        .map((s) => {
            return s.price;
        })
        .sort((a, b) => {
            return a - b;
        });
    let prices = price[0];

    let newProduct = {
        ...product,
        style,
        images: subProduct.images,
        sizes: subProduct.sizes,
        discount: subProduct.discount,
        sku: subProduct.sku,
        colors: product.subProducts.map((p) => {
            return p.color;
        }),
        priceRange: `₹${prices}`,
        price: subProduct.discount > 0 ? (prices -
            (prices * subProduct.discount) / 100).toFixed(2)
            : price.toString(),
        priceBefore: price[size],
        quantity: subProduct.sizes[size].qty,
        ratings: [
            {
                "percentage": calculatePercentage(5),
            },
            {
                "percentage": calculatePercentage(4),
            },
            {
                "percentage": calculatePercentage(3),
            },
            {
                "percentage": calculatePercentage(2),
            },
            {
                "percentage": calculatePercentage(1),
            },
        ],
        reviews: product.reviews.reverse(),
    };
    
    function calculatePercentage(num) {
        return Math.floor(((product.reviews.reduce((a, review) => {
            return a + (review.rating == Number(num) || review.rating == Number(num) + 0.5);
        }, 0) * 100) / product.reviews.length));
    }
    db.disconnectDb();
    return {
        props: {
            product: JSON.parse(JSON.stringify(newProduct))
        }
    }
}

