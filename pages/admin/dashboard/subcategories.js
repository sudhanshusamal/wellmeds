/* eslint-disable react-hooks/rules-of-hooks */
import Layout from '@/components/admin/layout'
import Create from '@/components/admin/subCategories/Create';
import List from '@/components/admin/subCategories/List';
import SingularSelect from '@/components/selects/SingularSelect';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import db from '@/utils/db'
import React, { useState } from 'react'

export default function subCategories({categories, subCategories}) {
    console.log(subCategories)
    const [data, setData] = useState(subCategories)
    return (
        <Layout>
            <div>
                <Create categories={categories} setSubCategories={setData} />
                <List categories={categories} subCategories={data} setSubCategories={setData} />
            </div>
        </Layout>
    )
}


export async function getServerSideProps(context) {
    db.connectDb();
    const categories = await Category.find({}).sort({ updateAt: -1 }).lean();
    const subCategories = await SubCategory.find({}).populate({path: "parent", model: Category}).sort({ updateAt: -1 }).lean();
    return {
        props: {
            categories: JSON.parse(JSON.stringify(categories)),
            subCategories: JSON.parse(JSON.stringify(subCategories))
        }
    }
}