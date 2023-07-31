/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { BsHeart } from "react-icons/bs";
import styles from "./styles.module.scss";

import React, { useEffect, useState } from 'react'
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { deleteWishlist } from "@/requests/user";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCart } from "@/store/cartSlice";

export default function WishlistProduct({ product }) {
    console.log(product)
    const { cart } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();
    const addToCartHandler = async () => {
        const { data } = await axios.get(
            `/api/product/${product._id}`
        );
        // if (qty > data.quantity) {
        //     // setError(
        //     //     "The Quantity you have choosed is more than in stock. Try and lower the Qty"
        //     // );
        //     toast.error('The Quantity you have choosed is more than in stock. Try and lower the Qty')
        // } else if (data.quantity < 1) {
        //     // setError("This Product is out of stock.");
        //     toast.warning('This Product is out of stock.')
        //     return;
        // } else {
            let _uid = `${data._id}`;
            let exist = cart?.cartItems.find((p) => p?._uid === _uid);
            if (exist) {
                let newCart = cart.cartItems.map((p) => {
                    if (p?._uid == exist._uid) {
                        return { ...p};
                    }

                    return p;
                });
                toast.success('Product Added To Cart Successfully')
                dispatch(updateCart(newCart));
            } else {
                dispatch(
                    addToCart({
                        ...data,
                        _uid,
                    })
                );
            }
        
    };
    return (
        <div className={`${styles.card} ${styles.product}`}>
            {product?.quantity < 1 && <div className={styles.blur}></div>}
            <div className={styles.product__header}>
                <img src="../../../images/store.webp" alt="" />
                {product?.brand} Store <MdOutlineKeyboardArrowDown />
            </div>
            <div className={styles.product__image}>
                <div className={`${styles.checkbox}`}> </div>
                <img src={product?.subProducts[0]?.images[0].url} alt="" />
                <div className={styles.col}>
                    <div className={styles.grid}>

                        <h1>
                            {
                                product?.name.length > 30 ? `${product?.name.substring(0, 30)}` : product?.name
                            }
                        </h1>
                        <div style={{ zIndex: '2' }} onClick={() => addToCartHandler()}>
                            <FiShoppingCart />
                        </div>
                    </div>
                    <div className={styles.product__priceQty}>
                        <div className={styles.product__priceQty_price}>
                            <span className={styles.price}>
                                ₹{(product.subProducts[0].sizes[0].price).toFixed(2)}
                            </span>
                            {product.subProducts[0].discount > 0 && (
                                <span className={styles.discount}>-{product.subProducts[0].discount}%</span>
                            )}
                        </div>

                    </div>
                    <div className={styles.product__shipping}>
                        {
                            product?.shipping ? `+₹${product.shipping} Delivery Charge` : "Free Delivery"
                        }
                    </div>
                    {
                        product?.quantity < 1 && <div className={styles.notAvailable}>
                            Out of Stock
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}