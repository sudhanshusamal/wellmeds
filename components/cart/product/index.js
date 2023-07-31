/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { BsHeart } from "react-icons/bs";
import styles from "./styles.module.scss";

import React, { useEffect, useState } from 'react'
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { style } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "@/store/cartSlice";

export default function Product({ product, selected, setSelected }) {
    console.log(product)
    const { cart } = useSelector((state) => ({ ...state }));
    const [active, setActive] = useState()
    useEffect(()=>{
        const check = selected.find((p)=>p._uid==product._uid)
        setActive(check)
    }, [selected])
    const dispatch = useDispatch();
    const updateQty = (type) => {
        let newCart = cart.cartItems.map((p) => {
            if (p?._uid == product?._uid) {
                return {
                    ...p,
                    qty: type == "plus" ? product?.qty + 1 : product?.qty - 1
                }
            }
            return p;
        })
        dispatch(updateCart(newCart))
    }

    const removeProduct=(id)=> {
        let newCart = cart.cartItems.filter((p)=>{
            return p._uid !=id
        })
        dispatch(updateCart(newCart))
    }

    const handleSelect = () => {
        
        if(active){
            setSelected(selected.filter((p)=>p._uid !==product._uid ))
        } else{
            setSelected([...selected, product ])
        }
    }
    return (
        <div className={`${styles.card} ${styles.product}`}>
            {product?.quantity < 1 && <div className={styles.blur}></div>}
            <div className={styles.product__header}>
                <img src="../../../images/store.webp" alt="" />
                {product?.brand} Store <MdOutlineKeyboardArrowDown />
            </div>
            <div className={styles.product__image}>
                <div className={`${styles.checkbox} ${active ? styles.active : ''}`} onClick={()=>handleSelect()}> </div>
                <img src={product?.images[0].url} alt="" />
                <div className={styles.col}>
                    <div className={styles.grid}>

                        <h1>
                            {
                                product?.name.length > 30 ? `${product?.name.substring(0, 30)}` : product?.name
                            }
                        </h1>
                        <div style={{ zIndex: '2' }}>
                            <BsHeart />
                        </div>
                        <div style={{ zIndex: '2' }} onClick={()=> removeProduct(product._uid)}>
                            <AiOutlineDelete />
                        </div>
                    </div>
                    <div className={styles.product__style}>
                        {product?.color?.image ?<img src={product?.color?.image} alt="" />: ""}
                        {
                            product?.price && <span>₹{product?.price}</span>
                        }
                        <MdOutlineKeyboardArrowRight />
                    </div>
                    <div className={styles.product__priceQty}>
                        <div className={styles.product__priceQty_price}>
                            <span className={styles.price}>
                                ₹{(product?.price * product?.qty).toFixed(2)}
                            </span>
                            {product?.price !== product?.priceBefore && (
                                <span className={styles.priceBefore}>
                                    ₹{product.priceBefore}
                                </span>
                            )}
                            {product?.discount > 0 && (
                                <span className={styles.discount}>-{product.discount}%</span>
                            )}
                        </div>
                        <div className={styles.product__priceQty_qty}>
                            <button disabled={product?.qty < 2} onClick={() => updateQty('minus')}>-</button>
                            <span>{product?.qty}</span>
                            <button disabled={product?.qty == product?.quantity} onClick={() => updateQty('plus')}>+</button>
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