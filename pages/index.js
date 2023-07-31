/* eslint-disable react/jsx-key */
import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import Header from '../components/header'
import Footer from '../components/footer'
import axios from 'axios';
import { useSession, signIn, signOut } from "next-auth/react";
import Main from '@/components/home/main';
import FlashDeals from '@/components/home/flashDeals.js';
import Category from '@/components/home/category';
import { health_food_drink, fitness_supplements, skin_care, pers_care_swiper } from '@/data/home';
import { useMediaQuery } from 'react-responsive';
import ProductsSwiper from '@/components/productsSwiper';
import db from '@/utils/db';
import Product from '@/models/Product';
import CategoryDb from '@/models/Category';
import ProductCard from '@/components/productCard';

export default function Home({ country, products, categories }) {
  // console.log(products);
  const { data: session } = useSession();
  const isMedium = useMediaQuery({ query: "(max-width:850px)" });
  const isMobile = useMediaQuery({ query: "(max-width:550px)" });
  return (
    <>
      <Header country={country} />
      <div className={styles.home}>
        <div className={styles.container} >
          <Main categories={categories} />
          <FlashDeals />
          <div className={styles.home__category}>
            <Category header="Fitness" products={fitness_supplements} background="#47A992" />
            {!isMedium && (
              <Category header="Skin Care" products={skin_care} background="#482121" />
            )}
            {isMobile && (
              <Category header="Skin Care" products={skin_care} background="#482121" />
            )}
            <Category header="Food & Drinks" products={health_food_drink} background="#262A56" />
          </div>
          <ProductsSwiper header="Personal Care" products={pers_care_swiper} bg="#A62349" />
          {/* <ProductsSwiper header="Ayurvedic Care" products={pers_care_swiper} bg="#2C3639" />
          <ProductsSwiper header="Elderly Care" products={pers_care_swiper} bg="#BE8C63" /> */}
          <div className={styles.products}>
            {
              products.map((product)=> (
                <ProductCard product={product} />
              ))
            }
          </div>
        </div>
      </div>
      <Footer country={country} />
    </>
  )
}

export async function getServerSideProps() {
  db.connectDb();
  let products = await Product.find().sort({createdAt:-1}).lean();
  let categories = await CategoryDb.find().lean()
  // console.log(products)
  const data = await axios.get(`https://api.ipregistry.co/?key=fijvz6uxr15qe32z`)
    .then((res) => {
      return res.data.location.country;
    })
    .catch((err) => {
      console.log(err)
    })
    
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
      country: { name: "India", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" },
      // country: {name: data.name, flag: data.flag.emojitwo },
    },
  }
}