/* eslint-disable react-hooks/rules-of-hooks */
import Create from '@/components/admin/coupons/Create';
import List from '@/components/admin/coupons/List';
import Layout from '@/components/admin/layout'
import Coupon from '@/models/Coupon';
import db from '@/utils/db'
import React, { useState } from 'react'

export default function coupons({coupons}) {
    const [data, setData] = useState(coupons)
    return (
        <Layout>
            <div>
                <Create setCoupons={setData} />
                <List coupons={data} setCoupons={setData} />
            </div>
        </Layout>
    )
}


export async function getServerSideProps(context) {
    db.connectDb();
    const coupons = await Coupon.find({}).sort({ updateAt: -1 }).lean();
    return {
        props: {
            coupons: JSON.parse(JSON.stringify(coupons))
        }
    }
}