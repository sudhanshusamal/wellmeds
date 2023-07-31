/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import Header from '@/components/header'
import styles from '../../styles/order.module.scss'
import Order from '@/models/Order';
import { IoIosArrowForward } from 'react-icons/io';
import { style } from '@mui/system';
import db from '@/utils/db';
import User from '@/models/User';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useEffect, useReducer } from 'react';
import StripePayment from '@/components/stripePayment';

function reducer(state, action) {
    switch (action.type) {
        case "PAY_REQUEST":
            return { ...state, loading: true };
        case "PAY_SUCCESS":
            return { ...state, loading: false, success: true };
        case "PAY_FAIL":
            return { ...state, loading: false, error: action.payload };
        case "PAY_RESET":
            return { ...state, loading: false, success: false, error: false };

    }
}



export default function order({
    orderData,
    paypal_client_id,
    stripe_public_key,
  }) {
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    
    const [dispatch] = useReducer(reducer, {
      loading: true,
      error: "",
      success: "",
    });
    useEffect(() => {
      if (!orderData._id) {
        dispatch({
          type: "PAY_RESET",
        });
      } else {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal_client_id,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      }
    }, [order]);
    function createOrderHanlder(data, actions) {
      return actions.order
        .create({
          purchase_units: [
            {
              amount: {
                value: orderData.total,
              },
            },
          ],
        })
        .then((order_id) => {
          return order_id;
        });
    }
    function onApproveHandler(data, actions) {
      return actions.order.capture().then(async function (details) {
        try {
          dispatch({ type: "PAY_REQUEST" });
          const { data } = await axios.put(
            `/api/order/${orderData._id}/pay`,
            details
          );
          dispatch({ type: "PAY_SUCCESS", payload: data });
        } catch (error) {
          dispatch({ type: "PAY_ERROR", payload: error });
        }
      });
    }
    function onErroHandler(error) {
      console.log(error);
    }
    return (
        <>
            <Header country="india" />
            <div className={styles.order}>
                <div className={styles.container}>
                    <div className={styles.order__infos}>
                        <div className={styles.order__header}>
                            <div className={styles.order__header_head}>
                                Home <IoIosArrowForward /> Order <IoIosArrowForward /> {" #"}{orderData._id}
                            </div>
                            <div className={styles.order__header_status}>
                                Payment Status : {" "}{
                                    orderData.isPaid ? <img src="../../../images/verified.png" alt='' /> : <img src="../../../images/unverified.png" alt='' />
                                }
                            </div>
                            <div className={styles.order__header_status}>
                                Order Status : <span className={
                                    orderData.status == "Not Processed" ? styles.not_processed :
                                        orderData.status == "Processing" ? styles.processing :
                                            orderData.status == "Dispatched" ? styles.dispatched :
                                                orderData.status == "Cancelled" ? styles.cancelled :
                                                    orderData.status == "Delivered" ? styles.completed : ""
                                }>{orderData.status}</span>
                            </div>
                        </div>
                        <div className={styles.order__products}>
                            {
                                orderData.products.map((product) => (
                                    <div className={styles.product}>
                                        <div className={styles.product__img}>
                                            <img src={product.image} alt={product.name} />

                                        </div>
                                        <div className={styles.product__infos}>
                                            <h1 className={styles.product__infos_name}>
                                                {product.name.length > 30 ? `${product.name.substring(0, 30)}...` : product.name}
                                            </h1>
                                            {product?.color?.image &&
                                                <div className={styles.product__infos_style}>
                                                    <img src={product.color.image} alt='' />
                                                </div>}
                                            <div className={styles.product__infos_priceQty}>
                                                ₹{product.price} x {product.qty}
                                            </div>
                                            <div className={styles.product__infos_total}>
                                                ₹{product.price * product.qty}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div className={styles.order__products_total}>
                                {
                                    orderData.couponApplied ? (
                                        <>
                                            <div className={styles.order__products_total_sub}>
                                                <span>Item Total</span>
                                                <span>₹{orderData.totalBeforeDiscount}</span>
                                            </div>
                                            <div className={styles.order__products_total_sub}>
                                                <span>Coupon Applied <em>({orderData.couponApplied})</em>{" "}</span>
                                                <span>- ₹{(orderData.totalBeforeDiscount - orderData.total).toFixed(2)}</span>
                                            </div>
                                            <div className={styles.order__products_total_sub}>
                                                <span>Taxes</span>
                                                <span>+ ₹{orderData.taxPrice}</span>
                                            </div>
                                            <div className={`${styles.order__products_total_sub} ${styles.bordertop}`}>
                                                <span>To Pay Cash</span>
                                                <b>Bill Total : ₹{orderData.total + orderData.taxPrice}</b>
                                            </div>
                                        </>
                                    ) : <>
                                        <div className={styles.order__products_total_sub}>
                                            <span>Item Total</span>
                                            <span>₹{orderData.totalBeforeDiscount}</span>
                                        </div>
                                        <div className={styles.order__products_total_sub}>
                                            <span>Taxes</span>
                                            <span>+ ₹{orderData.taxPrice}</span>
                                        </div>
                                        <div className={`${styles.order__products_total_sub} ${styles.bordertop}`}>
                                            <span>To Pay Cash</span>
                                            <b>Bill Total : ₹{orderData.total + orderData.taxPrice}</b>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.order__actions}>
                        <div className={styles.order__address}>
                            <h1>Customer's Order</h1>
                            <div className={styles.order__address_user}>
                                <div className={styles.order__address_user_infos}>
                                    <img src={orderData.user.image} alt="" />
                                    <div>
                                        <span>{orderData.user.name}</span>
                                        <span>{orderData.user.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.order__address_shipping}>
                                <h2>Shipping Address: </h2>
                                <span>{(orderData.shippingAddress.firstName).toLowerCase().replace(/(^|\s)\S/g, function (char) {
                                    return char.toUpperCase();
                                })}{" "}{(orderData.shippingAddress.lastName).toLowerCase().replace(/(^|\s)\S/g, function (char) {
                                    return char.toUpperCase();
                                })} </span>
                                <span>{(orderData.shippingAddress.address1).toLowerCase().replace(/(^|\s)\S/g, function (char) {
                                    return char.toUpperCase();
                                })} </span>
                                <span>{(orderData.shippingAddress.address2).toLowerCase().replace(/(^|\s)\S/g, function (char) {
                                    return char.toUpperCase();
                                })} </span>
                                <span>{(orderData.shippingAddress.city).toLowerCase().replace(/(^|\s)\S/g, function (char) {
                                    return char.toUpperCase();
                                })}, {(orderData.shippingAddress.state).toLowerCase().replace(/(^|\s)\S/g, function (char) {
                                    return char.toUpperCase();
                                })} </span>
                                <span>{orderData.shippingAddress.zipCode}</span>
                            </div>
                        </div>

                        {!orderData.isPaid &&
                            <div className={styles.order__payment}>
                                {
                                    orderData.paymentMethod == "paypal" && (
                                        <div>
                                            {
                                                isPending ? <span>loading...</span> : (<PayPalButtons createOrder={createOrderHanlder} onApprove={onApproveHandler} onError={onErroHandler}></PayPalButtons>)
                                            }
                                        </div>
                                    )
                                }
                                {
                                    orderData.paymentMethod == "credit_card" && (
                                        <StripePayment total={orderData.total} order_id={orderData._id} stripe_public_key={stripe_public_key} />
                                    )
                                }
                            </div>
                        }
                    </div>

                </div>
            </div>
        </>
    )
}


export async function getServerSideProps(context) {
    db.connectDb()
    const { query } = context;
    const id = query.id;
    const order = await Order.findById(id).populate({ path: 'user', model: User }).lean();
    let paypal_client_id = process.env.PAYPAL_CLIENT_ID;
    let stripe_public_key = process.env.STRIPE_PUBLIC_KEY;
    db.disconnectDb();
    return {
        props: {
            orderData: JSON.parse(JSON.stringify(order)),
            paypal_client_id,
            stripe_public_key
        }
    }
}