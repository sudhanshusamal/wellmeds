/* eslint-disable react/jsx-key */
import Layout from '@/components/profile/layout';
import User from '@/models/User';
import { getSession } from 'next-auth/react';
import React from 'react'
import styles from '@/styles/cart.module.scss'
import Product from '@/models/Product';
import WishlistProduct from '@/components/wishlist/product';

export default function index({ user, tab, wishlist }) {
   
    console.log(wishlist)
    return (
        <Layout session={user.user} tab={tab}>
            <div className={styles.cart__products}>

                {wishlist.wishlist.map((w) => (
                    <WishlistProduct
                        product={w.product}
                         />

                ))
                }
            </div>
        </Layout>
    )
}

export async function getServerSideProps(ctx) {
    const { query, req } = ctx;
    const session = await getSession({ req });
    const tab = query.tab || 0;
    
    const wishlist = await User.findById(session.user.id).select("wishlist") .populate({
        path: 'wishlist.product', 
        model: Product, 
        select: '_id name brand shipping subProducts.discount subProducts.images subProducts.sizes.price subProducts.sizes.qty' // Select the fields you want to include in the populated product object
    }).lean();
    
    return {
        props: {
            user: session,
            tab,
            wishlist: JSON.parse(JSON.stringify(wishlist)),
        }
    }
}