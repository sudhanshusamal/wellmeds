/* eslint-disable react-hooks/rules-of-hooks */
import Create from '@/components/admin/categories/Create';
import List from '@/components/admin/categories/List';
import Layout from '@/components/admin/layout'
import Category from '@/models/Category';
import db from '@/utils/db'
import React, { useState } from 'react'

export default function categories({categories}) {
    const [data, setData] = useState(categories)
    return (
        <Layout>
            <div>
                <Create setCategories={setData} />
                <List categories={data} setCategories={setData} />
            </div>
        </Layout>
    )
}


export async function getServerSideProps(context) {
    db.connectDb();
    const categories = await Category.find({}).sort({ updateAt: -1 }).lean();
    return {
        props: {
            categories: JSON.parse(JSON.stringify(categories))
        }
    }
}