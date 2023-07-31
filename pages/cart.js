/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
import Header from '@/components/cart/header'
import Footer from '@/components/footer'
import React, { useEffect, useState } from 'react'
import styles from '../styles/cart.module.scss'
import Empty from '@/components/cart/empty';
import { useDispatch, useSelector } from 'react-redux';
import Product from '@/components/cart/product';
import CartHeader from '@/components/cart/cartHeader';
import Checkout from '@/components/cart/checkout';
import PaymentMethods from '@/components/cart/paymentMethods';
import ProductsSwiper from '@/components/productsSwiper';
import { pers_care_swiper } from '@/data/home';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { saveCart } from '@/requests/user';
import GridLoaderSpinner from '@/components/loaders/gridLoader';

export default function cart() {
  const Router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([])
  const { cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();


  const [shippingFee, setShippingFee] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setShippingFee(
      selected.reduce((a, c) => a + Number(c.shipping), 0).toFixed(2)
    );
    setSubtotal(selected.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2));
    setTotal(
      (
        selected.reduce((a, c) => a + c.price * c.qty, 0) + Number(shippingFee)
      ).toFixed(2)
    );
  }, [selected]);

  const saveCartToDbHandler = async () => {
    setLoading(true);
    try {
      await saveCart(selected);
      Router.push('/checkout');

    } catch (error) {
      // Handle the error here or show an error message to the user
      console.error('Error saving cart:', error);
    }
    setLoading(false);
  }
  return (
    <>
      {loading && <GridLoaderSpinner loading={loading} />}
      <Header country="india" />
      <div className={styles.cart}>
        {cart.cartItems.length > 0 ?
          <div className={styles.cart__container}>
            <CartHeader cartItems={cart.cartItems} selected={selected} setSelected={setSelected} />
            <div className={styles.cart__products}>

              {cart.cartItems.map((product) => (
                <Product
                  product={product}
                  selected={selected}
                  setSelected={setSelected} />

              ))
              }
            </div>
            <Checkout subtotal={subtotal} shippingFee={shippingFee} total={total} selected={selected} saveCartToDbHandler={saveCartToDbHandler} />
            <PaymentMethods />
          </div> :
          <Empty />
        }

        <ProductsSwiper header="More For You" products={pers_care_swiper} bg="#435B66" />
      </div>
      {/* <Footer country="india" /> */}
    </>
  )
}
