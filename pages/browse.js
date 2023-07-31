/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-key */
import BrandFilter from '@/components/browse/brandFilter';
import CategoryFilter from '@/components/browse/categoryFilter';
import HeadingFilter from '@/components/browse/headingFilter';
import ItemFormFilter from '@/components/browse/itemFormFilter';
import UsesFilter from '@/components/browse/usesFilter';
import Header from '@/components/header';
import ProductCard from '@/components/productCard';
import Category from '@/models/Category';
import Product from '@/models/Product';
import SubCategory from '@/models/SubCategory';
import styles from '@/styles/browse.module.scss'
import { filterArrays, randomize, removeDuplicates } from '@/utils/arrays_utils';
import db from '@/utils/db'
import { Pagination } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function browse({ paginationCount, categories, products, itemForm, subCategories, brands, uses }) {

    const router = useRouter();
    const filter = ({ search, category, brand, sort, page, usesq, form, price, shipping, rating }) => {
        const path = router.pathname;
        const { query } = router;
        if (search) query.search = search;
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (usesq) query.uses = usesq
        if (form) query.form = form
        if (price) query.price = price
        if (shipping) query.shipping = shipping
        if (rating) query.rating = rating
        if (sort) query.sort = sort;
        if (page) query.page = page;
        router.push({
            pathname: path,
            query: query,
        })
    };

    const searchHandler = (search) => {
        if (search == "") {
            filter({ search: {} });
        } else {
            filter({ search });
        }
    }
    const categoryHandler = (category) => {
        filter({ category });
    }
    const brandHandler = (brand) => {
        filter({ brand });
    }
    const usesHandler = (usesq) => {
        filter({ usesq });
    }
    const formHandler = (form) => {
        filter({ form });
    }
    const priceHandler = (price, type) => {
        let priceQuery = router.query.price?.split("_") || "";
        let min = priceQuery[0] || "";
        let max = priceQuery[1] || "";
        let newPrice = "";
        if (type == "min") {
            newPrice = `${price}_${max}`;
        } else {
            newPrice = `${min}_${price}`;
        }
        filter({ price: newPrice });
    };
    const shippingHandler = (shipping) => {
        filter({ shipping });
    };
    const ratingHandler = (rating) => {
        filter({ rating });
    };
    const pageHandler = (e, page) => {
        filter({ page });
    };
    const sortHandler = (sort) => {
        if (sort == "") {
            filter({ sort: {} });
        } else {
            filter({ sort });
        }
    };

    const multiPriceHandler = (min, max) => {
        filter({ price: `${min}_${max}` });
    };



    function checkChecked(queryName, value) {
        const queryValue = router.query[queryName];
        if (Array.isArray(queryValue) && queryValue.includes(value)) {
            return true;
        }
        return false;
    };
    function replaceQuery(queryName, value) {
        const existedQuery = router.query[queryName];
        const valueCheck = typeof existedQuery === "string" ? existedQuery?.search(value) : -1;
        const _check = typeof existedQuery === "string" ? existedQuery?.search(`_${value}`) : -1;
        let result = "";
        if (existedQuery) {
            if (existedQuery == value) {
                result = {};
            } else {
                if (valueCheck !== -1) {
                    if (_check !== -1) {
                        result = existedQuery?.replace(`_${value}`, "");
                    } else if (valueCheck == 0) {
                        result = existedQuery?.replace(`${value}_`, "");
                    } else {
                        result = existedQuery?.replace(value, "");
                    }
                } else {
                    result = `${existedQuery}_${value}`;
                }
            }
        } else {
            result = value;
        }
        return {
            result,
            active: existedQuery && valueCheck !== -1 ? true : false,
        };
    }

    const [scrollY, setScrollY] = useState(0);
    const [height, setHeight] = useState(0);
    const headerRef = useRef(null);
    const el = useRef(null);
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        setHeight(headerRef.current?.offsetHeight + el.current?.offsetHeight);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={styles.browse}>
            <div ref={headerRef}>
                <Header searchHandler={searchHandler} country="india" />
            </div>
            <div className={styles.browse__container}>
                <div ref={el}>
                    <div className={styles.browse__path}>Home / Browse</div>
                    
                </div>
                <div
                    className={`${styles.browse__store} ${scrollY >= height ? styles.fixed : ""
                        }`}
                >
                    <div
                        className={`${styles.browse__store_filters} ${styles.scrollbar}`}
                    >
                        <button
                            className={styles.browse__clearBtn}
                            onClick={() => router.push("/browse")}
                        >
                            Clear All ({Object.keys(router.query).length})
                        </button>
                        <CategoryFilter replaceQuery={replaceQuery} categories={categories} subCategories={subCategories} categoryHandler={categoryHandler} />
                        <BrandFilter replaceQuery={replaceQuery} brands={brands} brandHandler={brandHandler} />
                        <UsesFilter replaceQuery={replaceQuery} data={uses} usesHandler={usesHandler} />
                        <ItemFormFilter replaceQuery={replaceQuery} data={itemForm} formHandler={formHandler} />

                    </div>
                    <div className={styles.browse__store_products_wrap}>
                        <HeadingFilter sortHandler={sortHandler} ratingHandler={ratingHandler} replaceQuery={replaceQuery} shippingHandler={shippingHandler} priceHandler={priceHandler} multiPriceHandler={multiPriceHandler} />
                        <div className={styles.browse__store_products}>
                            {products.length > 0 ?
                                products.map((product) => (
                                    <ProductCard product={product} />
                                )) : <div className={styles.browse__store_noresult}> <img src="../images/noresults.jpg" alt="" /></div>
                            }
                        </div>
                        <div className={styles.pagination}>
                            <Pagination count={paginationCount} onChange={pageHandler} defaultPage={Number(router.query.page) || 1} shape="rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const { query } = ctx;
    const searchQuery = query.search || "";
    const categoryQuery = query.category || "";
    const priceQuery = query.price?.split("_") || "";
    const shippingQuery = query.shipping || 0;
    const ratingQuery = query.rating || "";
    const sortQuery = query.sort || "";
    const pageSize = 20;
    const page = query.page || 1;
    const brandQuery = query.brand?.split("_") || "";
    const brandRegex = `^${brandQuery[0]}`;
    const brandSearchRegex = createRegex(brandQuery, brandRegex);
    const usesQuery = query.uses?.split("_") || "";
    const usesRegex = `^${usesQuery[0]}`;
    const usesSearchRegex = createRegex(usesQuery, usesRegex);
    const formQuery = query.form?.split("_") || "";
    const formRegex = `^${formQuery[0]}`;
    const formSearchRegex = createRegex(formQuery, formRegex);



    const search = searchQuery && searchQuery !== "" ? {
        name: {
            $regex: searchQuery,
            $options: "i",
        }
    } : {}
    const category = categoryQuery && categoryQuery !== "" ? { category: categoryQuery } : {};
    const usesq =
        usesQuery && usesQuery !== ""
            ? {
                "details.value": {
                    $regex: usesSearchRegex,
                    $options: "i",
                },
            }
            : {};
    const form =
        formQuery && formQuery !== ""
            ? {
                "details.value": {
                    $regex: formSearchRegex,
                    $options: "i",
                },
            }
            : {};
    const brand =
        brandQuery && brandQuery !== ""
            ? {
                brand: {
                    $regex: brandSearchRegex,
                    $options: "i",
                },
            }
            : {};
    const price =
        priceQuery && priceQuery !== ""
            ? {
                "subProducts.sizes.price": {
                    $gte: Number(priceQuery[0]) || 0,
                    $lte: Number(priceQuery[1]) || Infinity,
                },
            }
            : {};

    const shipping = shippingQuery && shippingQuery == "0" ? {
        shipping: 0,
    }
        : {}
    const rating =
        ratingQuery && ratingQuery !== ""
            ? {
                rating: {
                    $gte: Number(ratingQuery),
                },
            }
            : {};

    const sort =
        sortQuery == ""
            ? {}
            : sortQuery == "popular"
                ? { rating: -1, "subProducts.sold": -1, }
                : sortQuery == "newest"
                    ? { createdAt: -1 }
                    : sortQuery == "topSelling"
                        ? { "subProducts.sold": -1, }
                        : sortQuery == "topReviewed"
                            ? { rating: -1, }
                            : sortQuery == "pricedesc"
                                ? { "subProducts.sizes.price": -1, }
                                : sortQuery == "priceasc"
                                    ? { "subProducts.sizes.price": 1, }
                                    : {}

    function createRegex(data, usesRegex) {
        if (data.length > 1) {
            for (let i = 1; i < data.length; i++) {
                usesRegex += `|^${data[i]}`
            }
        }
        return usesRegex
    };


    db.connectDb();
    let productsDb = await Product.find({ ...search, ...category, ...rating, ...brand, ...usesq, ...form, ...price, ...shipping }).skip(pageSize * (page - 1))
        .limit(pageSize).sort(sort).lean();
    let products = sortQuery && sortQuery !== "" ? productsDb : randomize(productsDb)
    let categories = await Category.find().lean()
    let subCategories = await SubCategory.find().populate({ path: 'parent', model: Category }).lean()
    let colors = await Product.find().distinct('subProducts.color.color');
    let brandsDb = await Product.find({ ...category }).distinct('brand');
    let details = await Product.find({ ...category }).distinct('details')
    let itemFormDb = filterArrays(details, "Item Form")
    let netQuantityDb = filterArrays(details, "Net Quantity")
    let containsDb = filterArrays(details, "Contains")
    let usesDb = filterArrays(details, "Uses")
    let sideEffectsDb = filterArrays(details, "Side Effects")
    let itemForm = removeDuplicates(itemFormDb)
    let netQuantity = removeDuplicates(netQuantityDb)
    let contains = removeDuplicates(containsDb)
    let uses = removeDuplicates(usesDb)
    let sideEffects = removeDuplicates(sideEffectsDb)
    let brands = removeDuplicates(brandsDb)
    let totalProducts = await Product.countDocuments({
        ...search, ...category, ...rating, ...brand, ...usesq, ...form, ...price, ...shipping
    })

    return {
        props: {
            categories: JSON.parse(JSON.stringify(categories)),
            products: JSON.parse(JSON.stringify(products)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
            brands: JSON.parse(JSON.stringify(brands)),
            uses: JSON.parse(JSON.stringify(uses)),
            itemForm: JSON.parse(JSON.stringify(itemForm)),
            paginationCount: Math.ceil(totalProducts / pageSize)
        }
    }
}